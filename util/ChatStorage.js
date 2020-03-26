import asyncStorage from './AsyncStorage';

/*
  Helper function
  returns the most recent message in an object containing messages
*/
function getMostRecentMessage(messages) {
  let min = {}, curr;
  min.timestamp = Number.MAX_VALUE;
  for (let message of Object.keys(messages)) {
    message.timestamp = new Date(message.timestamp);
    if (message.timestamp.getTime() < min.timestamp.getTime()) {
      min = message;
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
  lastMessage: "last message",
  timestamp: "iso 8601 time, basically a (new Date()).toISOString()",
  title: "title of chat session",
  numOfUnreadMessages: Number
}

The relevant chat data stored in AsyncStorage is as follows:
{
  'chatSessions': ChatSessions,
  'chatid1': Messages,
  ...
  'chatidn': Messages,
  'totalNumOfUnreadMessages': Number
}
*/
const chatStorage = {
  getChatSessions: async () => {
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

  setChatSessions: async (sessions) => {
    return await asyncStorage.setItem('chatSessions', sessions);
  },

  setChatSession: async (id, session) => {
    let chatSessions = await this.getChatSessions();
    chatSessions[id] = session;
    return await asyncStorage.setItem('chatSessions', chatSessions);
  },

  /*
    Updates a specific chat session.
    'id' is the chat session being updated, 'session' holds the new data. 
    Data in 'session' is merged with 'id', not completely overwritten.
  */
  updateChatSession: async (id, session) => {
    if (!session)
      return false;

    let chatSessions = await this.getChatSessions();
    if (!chatSessions[id])
      return false;

    if (session['lastMessage'])
      chatSessions[id]['lastMessage'] = session['lastMessage'];
    if (session['timestamp'])
      chatSessions[id]['timestamp'] = session['timestamp'];
    if (session['numOfUnreadMessages'])
      chatSessions[id]['numOfUnreadMessages'] = session['numOfUnreadMessages'];
    if (session['incNumOfUnreadMessages'])
      chatSessions[id]['numOfUnreadMessages'] += session['incNumOfUnreadMessages'];

    return await this.setChatSessions(chatSessions);
  },

  /*
    'sessions' is an object of the form:
    {
      chatId1:
    }
  */
  updateChatSessions: async (sessions) => {

  },

  deleteChatSession: async (id) => {
    let chatSessions = this.getChatSessions();
    if (!chatSessions[id])
      return false;
    
    delete chatSessions[id];
    this.setChatSessions(chatSessions);
    return true;
  },


  mergeNewMsgsFromNotifs: async (newMessageObj) => {
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
   let promises = [], mostRecentMessage, newChatSession;
    for (let chatid of Object.keys(newMessageObj)) {
      mostRecentMessage = getMostRecentMessage(newMessageObj[chatid]);
      newChatSession = {
        timestamp: mostRecentMessage.timestamp,
        lastMessage: mostRecentMessage.message,
        incNumOfUnreadMessages: Object.keys(chatid).length
      };
      promises.push( updateChatSession(chatid, newChatSession) );
      promises.push( addNewMessages(chatid, newMessageObj[chatid]) );
    }
    await Promise.all(promises);
  },

  getMessages: async (chatid) => {
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
        message: '...',
        name: 'userid of sender',
        timestamp: 'UTC timestamp'
      },
      ...
    }
  */
  setMessages: async (chatid, messages) => {
    return await asyncStorage.setItem(chatid, messages);
  },

  addNewMessages: async (chatid, messages) => {
    let oldMessages = await this.getMessages(chatid);
    let newMessages = {
      ...oldMessages, 
      ...messages
    };
    return await this.setMessages(chatid, newMessages);
  },

  /*
    'message' is an object of the form:
    {
      message: '...',
      name: 'userid of sender',
      timestamp: 'UTC timestamp'
    }
  */
  addNewMessage: async (chatid, key, message) => {
    let messages = await this.getMessages(chatid);
    messages[key] = message;
    return await asyncStorage.setItem(chatid, messages);
  },

  getTotalNumOfUnreadMessages: async () => {
    let numMsgs = await asyncStorage.getItem('totalNumOfUnreadMessages');
    if (numMsgs === null) {
      await asyncStorage.setItem('totalNumOfUnreadMessages', 0);
      return 0;
    }
    else {
      return numMsgs;
    }
  },

  setTotalNumOfUnreadMessages: async (num) => {
    return await asyncStorage.setItem('totalNumOfUnreadMessages', num);
  },

  addTotalNumOfUnreadMessages: async (num) => {
    let numMsgs = await asyncStorage.getItem('totalNumOfUnreadMessages');
    numMsgs += num;
    return await asyncStorage.setItem('totalNumOfUnreadMessages', numMsgs);
  }

}