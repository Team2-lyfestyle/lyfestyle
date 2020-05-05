import * as _ from 'lodash';
import chatStorage from '../ChatStorage';
jest.mock('../AsyncStorage');

const ISOStringOne = (new Date()).toISOString();
const chatSessionOne = {
  members: {
    john: true,
    jane: true,
  },
  lastMessageText: 'hi',
  lastMessageAt: ISOStringOne,
  createdAt: ISOStringOne,
  numOfUnreadMessages: 1,
  title: 'New Chat Room'
};
const messageOne = {
  text: 'hi',
  user: {
    _id: 'john',
    name: 'John Johnson'
  },
  createdAt: ISOStringOne
};

const initialSessions = {
  1: chatSessionOne
}


it('get and setChatSessions(initialSessions)', async () => {
  await chatStorage.setChatSessions(initialSessions);
  const data = await chatStorage.getChatSessions();
  expect(data).toEqual(initialSessions);
});

it('get and setChatSession(1, chatSessionOne)', async () => {
  await chatStorage.setChatSession(1, chatSessionOne);
  const data = await chatStorage.getChatSession(1);
  expect(data).toEqual(chatSessionOne);
});

it('chatSessionExists(1) should be true', async () => {
  const data = await chatStorage.chatSessionExists(1);
  expect(data).toEqual(true);
});

it('chatSessionExists(2) should be false', async () => {
  const data = await chatStorage.chatSessionExists(2);
  expect(data).toEqual(false);
});

it('get and setMessages(1, messages)', async () => {
  await chatStorage.setMessages(1, {1: messageOne});
  const data = await chatStorage.getMessages(1);
  expect(data).toEqual({ 1: messageOne });
});


const ISOStringTwo = (new Date()).toISOString();
const chatSessionTwo = {
  members: {
    bob: true,
    bill: true,
  },
  lastMessageText: 'hey',
  lastMessageAt: ISOStringTwo,
  createdAt: ISOStringTwo,
  numOfUnreadMessages: 1,
  title: 'Another Chat Room'
};
const newMessageOne = {
  text: 'hey',
  user: {
    _id: 'bob',
    name: 'Bob Bobson'
  },
  createdAt: ISOStringTwo
};


it('get and setChatSession(2, chatSessionTwo)', async () => {
  await chatStorage.setChatSession(2, chatSessionTwo);
  const data = await chatStorage.getChatSession(2);
  expect(data).toEqual(chatSessionTwo);
});

it('chatSessionExists(2) should now be true', async () => {
  const data = await chatStorage.chatSessionExists(2);
  expect(data).toEqual(true);
});

it('get and setMessages(2, messages)', async () => {
  await chatStorage.setMessages(2, {1: newMessageOne } );
  const data = await chatStorage.getMessages(2);
  expect(data).toEqual({1: newMessageOne });
});


const newMessageTwoISO = (new Date()).toISOString();
const newMessageTwo = {
  text: 'sup',
  user: {
    _id: 'bill',
    name: 'Bill Billy'
  },
  createdAt: newMessageTwoISO
};
it('addNewMessage(2, 2, newMessageTwo)', async () => {
  await chatStorage.addNewMessage(2, 2, newMessageTwo);
  const data = await chatStorage.getMessages(2);
  expect(data).toEqual({1: newMessageOne, 2: newMessageTwo });
});

// Update test
const chatSessionTwoUpdated = _.cloneDeep(chatSessionTwo);
chatSessionTwoUpdated.lastMessageAt = newMessageTwo.createdAt;
chatSessionTwoUpdated.lastMessageText = newMessageTwo.text;
it('updateChatSession(2, { new info from newMessageTwo })', async () => {
  await chatStorage.updateChatSession(2, {lastMessageAt: newMessageTwo.createdAt, lastMessageText: newMessageTwo.text});
  const data = await chatStorage.getChatSession(2);
  expect(data).toEqual(chatSessionTwoUpdated);
});


// Notif object merge test
const ISOStringNotif = (new Date()).toISOString();
const notifMessage = {
  text: 'hello',
  user: {
    _id: 'bill',
    name: 'Bill Billy'
  },
  createdAt: ISOStringNotif
}
const notifMessageObject = {
  2: { // Chat id = 2
    3: notifMessage // Message id = 3
  }
}
const chatSessionTwoMerged = _.cloneDeep(chatSessionTwoUpdated);
chatSessionTwoMerged.lastMessageAt = notifMessage.createdAt;
chatSessionTwoMerged.lastMessageText = notifMessage.text;
chatSessionTwoMerged.numOfUnreadMessages += 1;
it('mergeNewMsgsFromNotifs(notifMessageObject, null)', async () => {
  await chatStorage.mergeNewMsgsFromNotifs(notifMessageObject, null);
  const data = await chatStorage.getChatSession(2);
  expect(data).toEqual(chatSessionTwoMerged);
});

it('merged messages update messages', async () => {
  const data = await chatStorage.getMessages(2);
  notifMessage.createdAt = (new Date(notifMessage.createdAt)).toISOString();
  expect(data).toEqual({1: newMessageOne, 2: newMessageTwo, 3: notifMessage});
});