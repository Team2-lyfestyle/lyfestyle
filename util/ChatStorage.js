import asyncStorage from './AsyncStorage';

/*
  Helper function
  returns the most recent message in an object containing messages
*/
function getMostRecentMessage(messages) {
  let min = {};
  min.createdAt = new Date(0); // new Date(0) returns 0 seconds since Unix epoch
  for (let message of Object.keys(messages)) {
    messages[message].createdAt = new Date(messages[message].createdAt);
    if (messages[message].createdAt.getTime() > min.createdAt.getTime()) {
      min = messages[message];
    }
  }
  return min;
}

/*
CHAT STORAGE DATA TYPES:

ChatSessions is an object of the form:
{
  chatSessionId1: ChatSession,
  chatSessionId2: ChatSession,
  ...
}
s
ChatSession is an object of the form:
{
  members: { userId1: true, userId2: true, ...},
  lastMessageText: "last message",
  lastMessageAt: "iso string",
  createdAt: "iso 8601 time, basically a (new Date()).toISOString()",
  title: "title of chat session",
  numOfUnreadMessages: Number
}

The relevant chat data stored in AsyncStorage is as follows:
{
  'chatSessions': ChatSessions,
  'chatid1': Messages,
  ...
  'chatidn': Messages,
}

Note that chatId === chatSessionId
*/
const chatStorage = {
  clearChatData: async function() {
    let chatSessions = await this.getChatSessions();
    let promises = [];
    for (let chatSession of Object.keys(chatSessions)) {
      promises.push(asyncStorage.removeItem(chatSession))
    }
    promises.push(asyncStorage.removeItem('chatSessions'));
    return Promise.all(promises);
  },

  syncWithFirebase: async function(chatSessions, messages) {

  },

  getChatSessions: async function() {
    let chatSessions = await asyncStorage.getItem('chatSessions');

    // Null check: chatSessions is null if it has never been set before
    if (chatSessions === null) {
      asyncStorage.setItem('chatSessions', {});
      return {};
    }
    else {
      return JSON.parse(chatSessions);
    }
  },

  getChatSession: async function(chatSessionId) {
    let chatSessions = await this.getChatSessions();
    if (chatSessions[chatSessionId]) {
      return chatSessions[chatSessionId];
    }
    else {
      return null;
    }
  },

  setChatSessions: function(sessions) {
    return asyncStorage.setItem('chatSessions', sessions);
  },

  setChatSession: async function(id, session) {
    let chatSessions = await this.getChatSessions();
    chatSessions[id] = session;
    return asyncStorage.setItem('chatSessions', chatSessions);
  },

  chatSessionExists: async function(id) {
    let chatSessions = await this.getChatSessions();
    if (chatSessions[id]) {
      return true;
    }
    else {
      return false;
    }
  },

  /*
    Updates a specific chat session.
    'id' is the chat session being updated, 'session' holds the new data. 
    Data in 'session' is merged with 'id', not completely overwritten.
  */
  updateChatSession: async function(id, session) {
    if (!session)
      return false;

    let chatSessions = await this.getChatSessions();
    if (!chatSessions[id]) {
      return;
      console.log(`Chat session ${id} does not exist. Create this chat session before updating it with ${session}.`);
      throw new Error(`Chat session ${id} does not exist. Create this chat session before updating it with ${session}.`);
    }

    //console.log('From updateChatSession:', id, session);
    //console.log('From updateChatSession:', chatSessions[id].numOfUnreadMessages);
    for (let key of Object.keys(session)) {
      if (key === 'incNumOfUnreadMessages') {
        chatSessions[id].numOfUnreadMessages = Number(chatSessions[id].numOfUnreadMessages) + Number(session.incNumOfUnreadMessages);
      }
      else {
        chatSessions[id][key] = session[key];
      }
    }

    return this.setChatSessions(chatSessions);
  },

  /*
    'sessions' is an object of the form:
    {
      chatId1:
    }
  */
  updateChatSessions: async function(sessions) {

  },

  deleteChatSession: async function(id) {
    let chatSessions = await this.getChatSessions();
    if (!chatSessions[id]) {
      console.log('Chat session does not exist with id', id);
      return false;
    }
    
    delete chatSessions[id];
    this.setChatSessions(chatSessions);
    asyncStorage.removeItem(id);
    return true;
  },


  /*
    focusedChatId is the chatSessionId of the currently focused chat (only if ChatScreen is focused)
    If valid, will not update unreadMessages for that chatSessionId.
  */
  mergeNewMsgsFromNotifs: function(newMessageObj, focusedChatId) {
    /*
      newMessageObj is an object of the form:
      {
        chatId1: { 
          msg1: { text: '...', createdAt: '...', user: { _id: 'userid', name: 'users name' }}, 
          msg2: ...
        },
        chatId2: ...
      }
    */

    let promises = [], mostRecentMessage, newChatSession;
    //console.log('From mergeNewMsgsFromNotifs:', newMessageObj, focusedChatId);
    for (let chatid of Object.keys(newMessageObj)) {
      mostRecentMessage = getMostRecentMessage(newMessageObj[chatid]);
      newChatSession = {
        lastMessageAt: mostRecentMessage.createdAt,
        lastMessageText: mostRecentMessage.text,
        incNumOfUnreadMessages: chatid === focusedChatId ? 0 : Object.keys(newMessageObj[chatid]).length 
      };
      promises.push( this.updateChatSession(chatid, newChatSession) );
      promises.push( this.addNewMessages(chatid, newMessageObj[chatid]) );
    }
    //promises.push( this.addTotalNumOfUnreadMessages(unreadMessageCount));
    return Promise.all(promises);
  },

  getMessages: async function(chatid) {
    let messages = await asyncStorage.getItem(chatid);

    // Null check
    if (messages === null) {
      asyncStorage.setItem(chatid, {});
      return {};
    }
    else {
      return JSON.parse(messages);
    }
  },

  /*
    'messages' is an object of the form
    {
      msg1: {
        text: '...',
        user: {
          _id: 'userid',
          name: 'users name'
        }
        createdAt: 'ISO String'
      },
      ...
    }
  */
  setMessages: async function(chatid, messages) {
    return asyncStorage.setItem(chatid, messages);
  },

  addNewMessages: async function(chatid, messages) {
    let oldMessages = await this.getMessages(chatid);
    let newMessages = {
      ...oldMessages, 
      ...messages
    };
    return this.setMessages(chatid, newMessages);
  },

  /*
    'message' is an object of the form:
    {
      text: '...',
      user: {
        _id: 'userid',
        name: 'users name'
      }
      createdAt: 'ISO String'
    }
  */
  addNewMessage: async function(chatid, messageid, message) {
    let messages = await this.getMessages(chatid);
    messages[messageid] = message;
    return asyncStorage.setItem(chatid, messages);
  },

  getTotalNumOfUnreadMessages: async function() {
    let totalNumOfUnreadMessages = 0;
    let chatSessions = await this.getChatSessions();
    for (let chatSession of Object.keys(chatSessions)) {
      totalNumOfUnreadMessages += chatSessions[chatSession].numOfUnreadMessages;
    }
    return totalNumOfUnreadMessages;
    /*
    let numMsgs = await asyncStorage.getItem('totalNumOfUnreadMessages');
    if (numMsgs === null) {
      await asyncStorage.setItem('totalNumOfUnreadMessages', 0);
      return 0;
    }
    else {
      return numMsgs;
    }
    */
  },

  setTotalNumOfUnreadMessages: async function(num) {
    return asyncStorage.setItem('totalNumOfUnreadMessages', num);
  },

  addTotalNumOfUnreadMessages: async function(num) {
    let numMsgs = await asyncStorage.getItem('totalNumOfUnreadMessages');
    numMsgs += num;
    return asyncStorage.setItem('totalNumOfUnreadMessages', numMsgs);
  }

}

export default chatStorage;
