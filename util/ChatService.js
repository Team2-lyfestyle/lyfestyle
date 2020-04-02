import chatStorage from './ChatStorage';
import dbCaller from './DatabaseCaller';
import { EventEmitter } from 'react-native';

/*
  Helper function to sort two message/chatSession objects by timestamp
*/
const sortByDate = (a, b) => (
  a.timestamp.getTime() - b.timestamp.getTime()
);

  
export default class ChatService {
  totalNumOfUnreadMessages;
  listeners;

  constructor() {
    this.listeners = [];
    this.totalNumOfUnreadMessages = 0;
    chatStorage.getTotalNumOfUnreadMessages().then( (result) => {
      this.totalNumOfUnreadMessages = result;
    });
  }

  /*
  Accepts a function that gets executed when a new message is received
  */
  addNewMsgListener(fun) {
    this.listeners.push(fun);
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
          msg1: { message: '...', timestamp: '...', name: '...'}, 
          msg2: ...
        },
        chatId2: ...
      }
      */
      try {
        let p1 = await chatStorage.mergeNewMsgsFromNotifs(newMessageObj);
        let p2 = await dbCaller.deleteChatsFromNotifs();
        await Promise.all([p1, p2]);

        // Remember to update unread message counter
        this.totalNumOfUnreadMessages = chatStorage.getTotalNumOfUnreadMessages();

        // Emit to all listeners that a new message(s) is ready to be read from local storage
        for (let callback in listeners) {
          callback();
        }
      }
      catch (err) {
        console.log('Error:', err);
      }
    });
  }

  async sendNewMessage(chatid, message) {
    let key = await dbCaller.sendNewMessage(chatid, message);
    chatStorage.addNewMessage(chatid, key, message);
  }

  async getChatSessions() {
    return await chatStorage.getChatSessions();
  }

  /*
  Checks if there exists a chat session that is equivalent to the 'members' array (equivalent meaning set equality)
  */
  async doesChatSessionExistWithMembers(members) {
    // Helper Functions copied from stack overflow
    //-----------------
    function eqSet(as, bs) {
      return as.size === bs.size && all(isIn(bs), as);
    }
    function all(pred, as) {
        for (var a of as) if (!pred(a)) return false;
        return true;
    }
    function isIn(as) {
      return function (a) {
          return as.has(a);
      };
    }
    //--------------

    // Make sure current user id is included in the members array
    let currentUserId = dbCaller.getCurrentUser().uid;
    if (!(currentUserId in members)) {
      members.push(currentUserId);
    }
    members = new Set(members);

    let chatSessions = await chatStorage.getChatSessions();
    for (let chatSessionId of Object.keys(chatSessions)) {
      if (eqSet(members, new Set(chatSessions[chatSessionId].members))) {
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
    for (let key in Object.keys(chatSessions)) {
      listData.push({key: key, ...chatSessions[key]});
    }
    listData.sort(sortByDate);
    return listData;
  }

  /*
  Equivalent to convertChatSessionsToOrderedArr
  */
  convertMessagesToOrderedArr(messages) {
    let listData = [];
    for (let key in Object.keys(messages)) {
      listData.push({_id: key, ...messages[key]});
    }
    listData.sort(sortByDate);
    return listData;
  }

  async deleteChatSession() {

  }

  async sendNewMessage(chatId, message) {
    dbCaller.sendNewMessage(chatId, message);
    chatStorage.updateChatSession(chatId, {lastMessage: message, timestamp: new Date()});
  }
}