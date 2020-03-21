import chatStorage from './ChatStorage';
import dbCaller from './DatabaseCaller';

export default class ChatService {
    totalNumOfUnreadMessages;
    constructor() {
        chatStorage.getTotalNumOfUnreadMessages().then( (result) => {
            this.totalNumOfUnreadMessages = result;
        });
    }

    async sendNewMessage(chatid, message) {
        let key = await dbCaller.sendNewMessage(chatid, message);
        chatStorage.addNewMessage(chatid, key, message);
    }

    async getChatSessions() {
        return await chatStorage.getChatSessions();
    }

    async deleteChatSession() {

    }

    async sendNewMessage(chatId, message) {
        dbCaller.sendNewMessage(chatId, message);
        chatStorage.updateChatSession(chatId, {lastMessage: message, timestamp: new Date()})
    }

}