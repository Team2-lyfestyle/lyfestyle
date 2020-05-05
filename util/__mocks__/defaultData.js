export const nowISOString = (new Date()).toISOString();
export const chatSessionOne = {
  members: {
    john: true,
    jane: true,
  },
  lastMessageText: 'hi',
  lastMessageAt: nowISOString,
  createdAt: nowISOString,
  numOfUnreadMessages: 1,
  title: 'New Chat Room'
};
export const messageOne = {
  text: 'hi',
  user: {
    _id: 'john',
    name: 'John Johnson'
  },
  createdAt: nowISOString
};

export const storageCache = {
  chatSessions: {
    1: chatSessionOne,
  },
  1: messageOne
};