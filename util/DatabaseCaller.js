import firebase from '../constants/firebase';

const db = {
    getCurrentUser: () => {
        return firebase.auth().currentUser;
    },

    getFriendsList: async () => {
        let thisId = this.getCurrentUser().uid;
    },

    getNewMessages: async () => {
        /*
            'messages' is an object of the form:
            {
                chatID1: { message1: 'new', message2: 'message'}
                chatID2: ...
            }
        */
        let messages = {};
        try {
            messages = (await firebase.database().ref('notifs/' + this.getCurrentUser().uid + '/chats').once('value')).val();
        }
        catch (err) {
            console.log('Error getting new messages');
            return;
        }
        console.log('New messages:', messages);

        // If there were new messages successfully retrieved, delete them in the database
        if (messages) {
            try {
                await firebase.database().ref('notifs/' + this.getCurrentUser().uid + '/chats').remove();
            }
            catch (err) {
                console.log('Error deleting new messages in firebase');
            }
        }
        return messages;
    },

    listenForNewMessages: (callback) => {
        firebase.database().ref('notifs/' + this.getCurrentUser().uid + '/chats').on('value', 
            function(snapshot) {
                /*
                    snapshot.val() is an object of the form:
                    {
                        chatId1: { msg1: "...", msg2: "...."},
                        chatId2: ...
                    }
                */
                callback(snapshot.val());
            });
    },

    stopListenForNewMessages: () => {
        firebase.database().ref('notifs/' + this.getCurrentUser().uid + '/chats').off('value');
    },

    /*
    Sends a new message object to the database, under messages/{chatID}
    Returns the reference string to the new message (aka, the messageId)
    */
    sendNewMessage: async (chatID, message) => {
        let newMsgRef = firebase.database().ref('messages/' + chatID).push();
        try {
            let newMsg = {
                message: message,
                name: this.getCurrentUser().uid,
                timestamp: (new Date()).toUTCString()
            }
            console.log('Sending new message', newMsg);
            await newMsgRef.set(newMsg);
            return newMsgRef.key;
        }
        catch (err) {
            console.log('Error sending new message', message);
            return '';
        }
    }

}

export default db;