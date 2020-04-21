import chatStorage from './ChatStorage';
import dbCaller from './DatabaseCaller';
import { EventEmitter } from 'react-native';

/*
  Helper function to sort two message objects by createdAt
*/
const sortMessagesByDate = (a, b) => (
  b.createdAt.getTime() - a.createdAt.getTime()
);
const sortChatSessionsByDate = (a, b) => (
  a.lastMessageAt.getTime() - b.lastMessageAt.getTime()
);

// TODO: Make own EventEmitter class for listeners objects
export default class ChatService {
  currentFocusedChatSession;         // chatSessionId of the currently focused chat session (for ChatScreen)
  newMessageListeners;               // Object containing functions that should execute on every new message event
  chatSessionReadListeners;


  constructor() {
    this.currentFocusedChatSession = null;
    this.newMessageListeners = {};
    this.chatSessionReadListeners = {};
  }

  getTotalNumOfUnreadMessages() {
    return chatStorage.getTotalNumOfUnreadMessages();
  }

  focusChatSession(chatSessionId) {
    this.currentFocusedChatSession = chatSessionId;
    this.readChatSession(chatSessionId);
  }

  blurChatSession() {
    this.currentFocusedChatSession = null;
  }

  addChatSessionReadListener(fun) {
    // Generate a random number [0, 100) that is not already a property in this.newMessageListeners
    let key = Math.floor(Math.random() * 100);
    while (key in this.chatSessionReadListeners) {
      key = Math.floor(Math.random() * 100);
    }
    this.chatSessionReadListeners[key] = fun;
    return () => this.clearChatSessionReadListener(key);
  }

  clearChatSessionReadListener(key) {
    delete this.chatSessionReadListeners[key];
  }

  // Sets unread messages to 0, emits to any listeners on chat session read (really only for bottomtabnavigator)
  async readChatSession(chatSessionId) {
    await chatStorage.updateChatSession(chatSessionId, {
      numOfUnreadMessages: 0
    });
    for (let i of Object.keys(this.chatSessionReadListeners)) {
      this.chatSessionReadListeners[i](chatSessionId);
    }
  }


  /*
  Accepts a function that gets executed when a new message is received
  */
  addNewMsgListener(fun) {
    // Generate a random number [0, 100) that is not already a property in this.newMessageListeners
    let key = Math.floor(Math.random() * 100);
    while (key in this.newMessageListeners) {
      key = Math.floor(Math.random() * 100);
    }
    this.newMessageListeners[key] = fun;
    return () => this.clearNewMessageListener(key);
  }

  clearNewMessageListener(key) {
    delete this.newMessageListeners[key];
  }

  /*
    Sets up a listener on 'notifs/userId/chats'
    On every object returned, store the new chat data and delete it from firebase
  */
  listenForNewMessages() {
    dbCaller.listenForNewMessages( async ( newMessageObj ) => {
      /*
      newMessageObj is an object of the form:
      {
        chatId1: { 
          msg1: { text: '...', createdAt: '...', user: { _id: 'id', name: 'name' } }, 
          msg2: ...
        },
        chatId2: ...
      }
      */
      try {
        // First, convert createdAt to a new Date object. Note that createdAt is just an ISO string
        for (let chatId of Object.keys(newMessageObj)) {
          for (let message of Object.keys(chatId)) {
            message.createdAt = new Date(message.createdAt);
          }
        }

        // Next, check whether or not each chat session exists on this device
        // If does not exist, create it
        let chatSessions = chatStorage.getChatSessions(); // Use chatStorage getChatSessions to save time creating Data() objects
        for (let chatId of Object.keys(newMessageObj)) {
          if ( !(await chatStorage.chatSessionExists(chatId)) ) {
            let chatSession = await dbCaller.getChatSession(chatId);
            await chatStorage.setChatSession(chatId, {...chatSession, numOfUnreadMessages: Object.keys(newMessageObj[chatId]).length} );
          }
        }

        // Pass currentFocusedChatSession so that unreadMessages are updated correctly
        // ie, dont increment unread messages for a chat session that is currently focused in Chat Screen
        let p1 = chatStorage.mergeNewMsgsFromNotifs(newMessageObj, this.currentFocusedChatSession);
        let p2 = dbCaller.deleteChatsFromNotifs();
        await Promise.all([p1, p2]);

        // Emit to all listeners that a new message(s) is ready to be read from local storage
        // Pass an array of chatSessionId's that had new messages
        chatSessions = Object.keys(newMessageObj);
        for (let i of Object.keys(this.newMessageListeners)) {
          this.newMessageListeners[i](chatSessions);
        }
      }
      catch (err) {
        console.log('Error:', err);
      }
    });
  }

  // Converts timestamp to a new Date object
  async getMessages(chatId) {
    let messages = await chatStorage.getMessages(chatId);
    for (let message of Object.keys(messages)) {
      messages[message].createdAt = new Date(messages[message].createdAt);
    }
    return messages;
  }
  
  async getMessagesAsOrderedArr(chatId) {
    let messages = await this.getMessages(chatId);
  }

  async sendNewMessage(chatid, message) {
    let key = await dbCaller.sendNewMessage(chatid, message);
    chatStorage.addNewMessage(chatid, key, message);
  }

  // 'filterEmpty' is a boolean
  // Converts timestamp to a new Date object
  async getChatSessions(filterEmpty) {
    let chatSessions = await chatStorage.getChatSessions();
    for (let chatSession of Object.keys(chatSessions)) {
      if (filterEmpty && chatSessions[chatSession].lastMessageAt === "") {
        delete chatSessions[chatSession];
      }
      else {
        chatSessions[chatSession].lastMessageAt = new Date(chatSessions[chatSession].lastMessageAt);
      }
    }
    return chatSessions;
  }

  /*
  Checks if there exists a chat session that is equivalent to the 'members' array (equivalent meaning set equality)
  */
  async doesChatSessionExistWithMembers(members) {
    // Helper Functions copied from stack overflow
    //-----------------
    function arrIsSubset(arr1, arr2) {
      return arr1.every( elem => arr2.includes(elem));
    }
    function checkEqualityAsSets(arr1, arr2) {
      return arrIsSubset(arr1, arr2) && arrIsSubset(arr2, arr1);
    }
    //--------------

    // Make sure current user id is included in the members array
    let currentUserId = dbCaller.getCurrentUser().uid;
    if (!members.includes(currentUserId)) {
      members.push(currentUserId);
    }

    let chatSessions = await chatStorage.getChatSessions();
    for (let chatSessionId of Object.keys(chatSessions)) {
      let submembers = Object.keys( chatSessions[chatSessionId].members );
      if (checkEqualityAsSets(members, submembers)) {
        return chatSessionId;
      }
    }

    return null;
  }

  /*
  Returns chat sessions as an array of chat session objects.
  Each chat session object has an added 'key' property which is
  set to the chatSessionId as according to firebase
  */
  convertChatSessionsToOrderedArr(chatSessions) {
    let listData = [];
    for (let key of Object.keys(chatSessions)) {
      listData.push({
        ...chatSessions[key],
        key: key
      });
    }
    listData.sort(sortChatSessionsByDate);
    return listData;
  }

  /*
  Converts a messages object to a format recognized by gifted chat
  users object is used to assign a user to each message
  */
  convertMessagesToOrderedArr(messages, users) {
    let listData = [];
    for (let key of Object.keys(messages)) {
      listData.push({
        ...messages[key],
        _id: key
      });
    }
    listData.sort(sortMessagesByDate);
    return listData;
  }

  async deleteChatSession() {

  }

  async sendNewMessage(chatId, message) {
    console.log('Sending new message', message, 'to', chatId);
    let thisUser = dbCaller.getCurrentUser();
    let newMessage = {
      text: message,
      user: {
        _id: thisUser.uid,
        name: thisUser.name ? thisUser.name : ''
      },
      createdAt: (new Date()).toISOString()
    };
    let messageId = await dbCaller.sendNewMessage(chatId, newMessage);

    let promises = [];
    promises.push( chatStorage.updateChatSession(chatId, { lastMessageText: message, lastMessageAt: newMessage.createdAt }) );
    promises.push( chatStorage.addNewMessage(chatId, messageId, newMessage) );
    return Promise.all(promises);
  }

  /*
  members is an array containing the userid's of the new chat session
  message is a string containing the message

  Returns the chatSessionId of the newly created chat session
  */
  async createNewChatSession(members, message) {
    
    // Convert members array to an object
    let membersObj = {};
    for (let member of members) {
      membersObj[member] = true;
    }

    let thisUser = dbCaller.getCurrentUser();
    let newMessage = {
      text: message,
      user: {
        _id: thisUser.uid,
        name: thisUser.name ? thisUser.name : '' // In case thisUser.name is undefined
      },
      createdAt: (new Date()).toISOString()
    };
    let newChatSession = {
      members: membersObj,
      createdAt: newMessage.createdAt,
      lastMessageText: newMessage.text,
      lastMessageAt: newMessage.createdAt,
      //numOfUnreadMessages: 0
    };
    let data = {
      chatSession: newChatSession,
      message: newMessage
    };

    // result contains new chatSessionId and messageId
    let result = await dbCaller.createNewChatSession(data);
    console.log('result: ', result);
    newChatSession.numOfUnreadMessages = 0; // Update numOfUnreadMessages for local storage
    await Promise.all([chatStorage.addNewMessage(result.chatSessionId, result.messageId, newMessage),
    chatStorage.setChatSession(result.chatSessionId, newChatSession)]);

    return result.chatSessionId;
  }

  test() {
    dbCaller.test();
  }
}