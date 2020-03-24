import firebase from '../constants/firebase'
module.exports = {
    // GET curent Loggedin USER.
    getCurrentUser: () => {
        let uid = firebase.auth().currentUser.uid
        return firebase.database().ref('users/' + uid)
            .once('value', function (snapshot) {
                return snapshot
            });
    },

    // GET a user using ID
    getUserByID: (uid) => {
        return firebase.database().ref('users/' + uid)
            .once('value', function (snapshot) {
                return snapshot
            });
    },

    // Updates the current user. data is a json object. This will only change the values passed in the json object. 
    // For example, if data = {email: yoshida@mail.com} it will only change the email of the user and nothing else.
    // If the parameter passed doesnt exist, it will be added to the user.
    updateCurrentUser: (data) => {
        let uid = firebase.auth().currentUser.uid
        return firebase.database().ref('users/' + uid)
            .update(data)
            .then(() => {
                console.log("UPDATE Successful SUCCESSFULLY")
            })
            .catch((err) => {
                console.log("POST FAILED \n", err)
            })
    },

    // GETS all posts made by current User.
    // To get ALL posts made by ANYONE, remove ".orderByChild('posterUID').equalTo(uid)"
    getPostByUser: () => {
        let uid = firebase.auth().currentUser.uid
        return firebase.database().ref('posts/').orderByChild('posterUID').equalTo(uid)
            .once('value', function (snapshot) {
                return snapshot
            })
    },

    // Creates a post. data is a json that must contain a posterUID value. Refer to database_struc.json to see what other values data can contain
    createPost:  (data) => {
        let uid = firebase.auth().currentUser.uid
        data.posterUID = uid
        return firebase.database().ref('posts/')
            .push(data)
            .then(() => {
                console.log("Post CREATED SUCCESSFULLY")
            })
            .catch((err) => {
                console.log("POST FAILED \n", err)
            })
    }
}