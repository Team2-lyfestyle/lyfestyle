import chatStorage from './ChatStorage';
import dbCaller from './DatabaseCaller';
import { EventEmitter } from 'react-native';

const sortByDate = (a, b) => (
  a.timestamp.getTime() - b.timestamp.getTime()
);

  
export default class ChatService {
  totalNumOfUnreadMessages;
  newMsgEmitter;

  constructor() {
    this.newMsgEmitter = new EventEmitter();
    this.newMsgEmitter.setMaxListeners(15);
    this.totalNumOfUnreadMessages = 0;
    chatStorage.getTotalNumOfUnreadMessages().then( (result) => {
      this.totalNumOfUnreadMessages = result;
    });
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
      let p1 = chatStorage.mergeNewMsgsFromNotifs(newMessageObj);
      let p2 = dbCaller.deleteChatsFromNotifs();
      await Promise.all([p1, p2]);

      // Remember to update unread message counter
      this.totalNumOfUnreadMessages = chatStorage.getTotalNumOfUnreadMessages();

      // Emit to all listeners that a new message(s) is ready to be read from local storage
      this.newMsgEmitter.emit('newMessage');
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
  Returns chat sessions as an array of chat session objects.
  Each chat session object has an added 'key' property which is
  set to the chatSessionId as according to firebase
  */
  async getChatSessionsAsOrderedArr() {
    let listData = [];
    for (let key in state.chatSessions) {
      if (state.chatSessions.hasOwnProperty(key)) {
        listData.push({key: key, ...state.chatSessions[key]});
      }
    }
    listData.sort(sortByDate);
    return listData;
  }

  async deleteChatSession() {

  }

  async sendNewMessage(chatId, message) {
    dbCaller.sendNewMessage(chatId, message);
    chatStorage.updateChatSession(chatId, {lastMessage: message, timestamp: new Date()})
  }
}