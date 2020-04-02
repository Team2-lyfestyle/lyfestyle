import firebase from '../constants/firebase';
import fbqueries from './firebase_queries';

const db = {
    getCurrentUser: function() {
        return firebase.auth().currentUser;
    },

    getFriendsList: async function() {
        let thisId = this.getCurrentUser().uid;
        try {
            let friends = await (firebase.database().ref('users/' + thisId + '/friends').once('value')).val();
            console.log('Got friends:', friends);
            return friends;
        }
        catch (err) {
            console.log('Error getting friend data');
            return null;
        }
    },

    getUsersById: async function(ids) {
        let users = [];
        try {
            for (let id in ids) {
                users.push(fbqueries.getUserById(id));
            }
            return await Promise.all(users); // Make sure all promises resolve succesfully before returning
        }
        catch (err) {
            console.log('Error getting users');
            return []
        }
    },

    getNewMessages: async function() {
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

    listenForNewMessages: function(callback) {
        firebase.database().ref('notifs/' + this.getCurrentUser().uid + '/chats').on('value', 
            (snapshot) => {
                /*
                    snapshot.val() is an object of the form:
                    {
                        chatId1: { 
                            msg1: { message: '...', timestamp: '...', name: '...'}, 
                            msg2: ...
                        },
                        chatId2: ...
                    }
                */
                let messages = snapshot.val();
                console.log('Reading from chat notifs:', messages);
                
                // only return data if new messages are available
                if (messages) {
                    callback(snapshot.val());
                }
            });
    },

    stopListenForNewMessages: function() {
        firebase.database().ref('notifs/' + this.getCurrentUser().uid + '/chats').off('value');
    },

    deleteChatsFromNotifs: async function() {
        try {
            await firebase.database().ref('notifs/' + this.getCurrentUser().uid + '/chats').remove();
            return true;
        }
        catch (err) {
            console.log('Error deleting new messages in firebase');
            return false;
        }
    },

    /*
    Sends a new message object to the database, under messages/{chatID}
    Returns the reference string to the new message (aka, the messageId)
    */
    sendNewMessage: async function(chatID, message) {
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