import AsyncStorage from '@react-native-community/async-storage';

const asyncStorage = {
  setItem: async (key, value) => {
    try {
      if (!(typeof value === "string" || value instanceof String)) {
        value = JSON.stringify(value);
      }
      console.log(`Setting ${key}: ${value}`);
      await AsyncStorage.setItem(key, value);
      return true;
    }
    catch (err) {
      console.log(`Error setting ${key}: ${value}`, err);
      return false;
    }
  },

  getItem: async (key) => {
    try {
      console.log(`Getting value from ${key}`);
      let value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }
      else {
        // No value set at key
        console.log(`No value set at ${key}`);
        return null;
      }
    }
    catch (err) {
      console.log(`Error getting ${key}`, err);
      return null;
    }
  },
}


/*
ChatSessions is an object of the form:
{
  chatSessionId1: ChatSession,
  chatSessionId2: ChatSession,
  ...
}

ChatSession is an object of the form:
{
  members: { userId1: true, userId2: true, ...},
  lastMessage: "last message",
  timestamp: "ios 8601 time",
  title: "title of chat session"
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
    return asyncStorage.setItem('chatSessions', sessions);
  },

  setChatSession: async (id, session) => {
    let chatSessions = this.getChatSessions();
    chatSessions[id] = session;
    return asyncStorage.setItem('chatSessions', chatSessions);
  },

  /*
    Updates a specific chat session.
    'id' is the chat session being updated, 'session' holds the new data. 
    Data in 'session' is merged with 'id', not completely overwritten.
  */
  updateChatSession: async (id, session) => {
    if (!session)
      return false;

    let chatSessions = this.getChatSessions();
    if (!chatSessions[id])
      return false;

    if (session['lastMessage'])
      chatSessions[id]['lastMessage'] = session['lastMessage'];
    if (session['timestamp'])
      chatSessions[id]['timestamp'] = session['timestamp'];

    return this.setChatSession(id, chatSessions[id]);
  },

  deleteChatSession: async (id) => {
    let chatSessions = this.getChatSessions();
    if (!chatSessions[id])
      return false;
    
    delete chatSessions[id];
    this.setChatSessions(chatSessions);
    return true;
  },

  getMessages: async (chatid) => {
    let messages = asyncStorage.getItem(chatid);

    // Null check
    if (messages === null) {
      asyncStorage.setItem(chatid, []);
      return [];
    }
    else {
      return JSON.parse(messages);
    }
  },

  addMessage: async (chatid, message, timestamp) => {
    let messages = this.getMessages(chatid);
    messages.push(message);
    
    // Also updates chatSession data so that lastMessage and timestamp is consistent
    let result = this.updateChatSession(chatid, {lastMessage: message, timestamp: timestamp ? timestamp : new Date()});
    return result && asyncStorage.setItem(chatid, messages);
  }
}