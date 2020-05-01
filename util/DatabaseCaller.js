import firebase from '../constants/firebase';
import fbqueries from './firebase_queries';


const db = {
    getCurrentUser: async function() {
        let thisUserId = firebase.auth().currentUser.uid;
        let snapshot = await firebase.database().ref('users/' + thisUserId).once('value');
        return snapshot.val();
    },

    getCurrentUserId: function() {
        return firebase.auth().currentUser.uid;
    },

    getFriendsList: async function() {
        let thisId = this.getCurrentUserId();
        try {
            let friends = await firebase.database().ref('users/' + thisId + '/friends').once('value');
            friends = friends.val(); // Convert snapshot to object
            console.log('Got friends:', friends);
            return friends;
        }
        catch (err) {
            console.log('Error getting friend data for', thisId);
            return null;
        }
    },

    getUserById: async function(id) {
        try {
            let user = await firebase.database().ref(`users/${id}`).once('value');
            user = user.val();
            user.uid = id;
            return user;
        }
        catch (err) {
            console.log('Error getting user', id);
            return null;
        }
    },

    // ids is an object with keys as the user id's
    getUsersByIdsAsArray: async function(ids) {
        let users = [];
        try {
            console.log('Getting users:', ids);
            for (let id of Object.keys(ids)) {
                users.push(this.getUserById(id));
            }
            // Make sure all promises resolve succesfully
            return await Promise.all(users); 
        }
        catch (err) {
            console.log('Error getting users');
            return [];
        }
    },

    getAllUsers: async function() {
        try {
            let users = (await firebase.database().ref('users').once('value')).val();
            return users;
        }
        catch (err) {
            console.log('Error getting users', err);
            return {};
        }
    },

    userChangeListeners: {},

    listenForUserChanges: function(callback) {
        try {
            firebase.database().ref('users/' + this.getCurrentUserId()).on('value', callback);
            
        }
        catch (err) {
            console.log('Error listening to user changes', err);
        }
    },

    stopListenForUserChanges: function(callback) {
        try {
            firebase.database().ref('users/' + this.getCurrentUserId()).off('value', callback);
        }
        catch (err) {
            console.log(err);
        }
    },

    addUserToFriends: function(id) {
        try {
            let friendsRef = firebase.database().ref('users/' + this.getCurrentUserId() + '/friends/' + id);
            return friendsRef.set(true);
        }
        catch (err) {
            console.log('Error adding user to friends', id);
        }
    },

    deleteSentFriendRequest: function(id) {
        try {
            let friendReqsRef = firebase.database().ref('users/' + this.getCurrentUserId() + '/friendRequestsSent/' + id);
            return friendReqsRef.remove();
        }
        catch (err) {
            console.log('Error removing user from sent friend requests', id);
        }
    },

    deleteRcvdFriendRequest: function(id) {
        try {
            let friendReqsRef = firebase.database().ref('users/' + this.getCurrentUserId() + '/friendRequestsRcvd/' + id);
            return friendReqsRef.remove();
        }
        catch (err) {
            console.log('Error removing user from received friend requests', id);
        }
    },

    deleteRcvdFriendRequest: function(id) {
        try {
            let friendReqsRef = firebase.database().ref('users/' + this.getCurrentUserId() + '/friendRequestsRcvd/' + id);
            return friendReqsRef.remove();
        }
        catch (err) {
            console.log('Error removing user from friend requests', id);
        }
    },

    removeFriend: function(id) {
        try {
            let friendReqsRef = firebase.database().ref('users/' + this.getCurrentUserId() + '/friends/' + id);
            return friendReqsRef.remove();
        }
        catch (err) {
            console.log('Error removing user from friend requests', id);
        }
    },

    sendFriendRequest: function(id) {
        try {
            let friendReqsRef = firebase.database().ref('users/' + this.getCurrentUserId() + '/friendRequestsSent/' + id);
            return friendReqsRef.set(true);
        }
        catch (err) {
            console.log('Error sending friend request to', id);
        }
    },

    getChatSession: async function(id) {
        try {
            let chatSession = (await firebase.database().ref('chats/' + id).once('value')).val();
            return chatSession;
        }
        catch (err) {
            console.log('Error getting chat session', id);
            return {};
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
            messages = (await firebase.database().ref('notifs/' + this.getCurrentUserId() + '/chats').once('value')).val();
        }
        catch (err) {
            console.log('Error getting new messages');
            return;
        }
        console.log('New messages:', messages);

        // If there were new messages successfully retrieved, delete them in the database
        if (messages) {
            try {
                await firebase.database().ref('notifs/' + this.getCurrentUserId() + '/chats').remove();
            }
            catch (err) {
                console.log('Error deleting new messages in firebase');
            }
        }
        return messages;
    },

    listenForNewMessages: function(callback) {
        firebase.database().ref('notifs/' + this.getCurrentUserId() + '/chats').on('value', 
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
                //console.log('Reading from chat notifs', snapshot, messages);
                
                // only return data if new messages are available
                if (messages) {
                    console.log('New messages available:', messages);
                    callback(snapshot.val());
                }
            });
    },

    stopListenForNewMessages: function() {
        firebase.database().ref('notifs/' + this.getCurrentUserId() + '/chats').off('value');
    },

    deleteChatsFromNotifs: async function() {
        try {
            await firebase.database().ref('notifs/' + this.getCurrentUserId() + '/chats').remove();
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
    sendNewMessage: async function(chatId, message) {
        let messagesRef = firebase.database().ref('messages/' + chatId);
        let messageRef = messagesRef.push();
        await messageRef.set(message);
        return messageRef.key;
    },

    /*
    data is an object of the form:
    {
        chatSession: { chatSession object }
        message: { text: 'text', user: { _id: 'userid', name: 'users name' }, createdAt: 'str'}
    }
    */
    createNewChatSession: async function(data) {
        // Create new chat session
        let chatsRef = firebase.database().ref('chats').push();
        chatsRef.set(data.chatSession);

        // Create new message
        let ref = firebase.database().ref('messages');
        await ref.update({
            [chatsRef.key]: { }
        });
        let messageRef = ref.child(chatsRef.key).push(data.message);

        // Return ID's of the newly created chat session and message
        return {
            chatSessionId: chatsRef.key,
            messageId: messageRef.key
        }
    },

    test: async function() {
        var ref;
        try {
          let url = `notifs/${this.getCurrentUserId()}/chats`;
          console.log('Url:', url);
          let ref = firebase.database().ref(url);
          console.log('got ref');
          let value = await ref.once('value');
          console.log(value);
        }
        catch (err) {
            console.log('couldn\'t get reference', err);
        }
    }
}

export default db;