import firebase from '../constants/firebase'
import { uploadPostImage, uploadProfileImage } from '../util/image_upload'
import Firebase from 'firebase'

module.exports = {
  // GET curent Loggedin USER.
  getCurrentUser: (callback) => {
    let uid = firebase.auth().currentUser.uid;
    return firebase
      .database()
      .ref('users/' + uid)
      .once('value', function (snapshot) {
        if (callback) callback(snapshot.val());
        else snapshot.val();
      });
  },

  // GET a user using ID
  getUserByID: (uid, callback) => {
    return firebase
      .database()
      .ref('users/' + uid)
      .once('value', function (snapshot) {
        if (callback) callback(snapshot.val());
        else snapshot.val();
      });
  },


    // Updates the current user. data is a json object. This will only change the values passed in the json object. 
    // For example, if data = {email: yoshida@mail.com} it will only change the email of the user and nothing else.
    // If the parameter passed doesnt exist, it will be added to the user.
    updateCurrentUser: (data, image) => {
        let uid = firebase.auth().currentUser.uid
        data.timestamp =  Firebase.database.ServerValue.TIMESTAMP
        return firebase.database().ref('users/' + uid)
            .update(data)
            .then(() => {
                if (image) {
                    uploadProfileImage(image)
                }
                console.log("UPDATE Successful SUCCESSFULLY")
            })
            .catch((err) => {
                console.log("POST FAILED \n", err)
            })
    },

  // callback is a function that handles the output of the snapshot. In this callback you should transform the snapshot and save it in the state
  getPosts: (callback) => {
    return firebase
      .database()
      .ref('posts/')
      .orderByChild('timestamp')
      .limitToLast(40)
      .on('value', function (snapshot) {
        if(snapshot.exists()){
          if (callback) callback(snapshot.val());
          else snapshot.val();
        }
        
      });
  },

  getCurrUserPosts: (callback) => {
    let uid = firebase.auth().currentUser.uid;
    return firebase
      .database()
      .ref('posts/')
      .orderByChild('posterUID')
      .equalTo(uid)
      .limitToLast(10)
      .on('value', function (snapshot) {
        if(snapshot.exists()){
          if (callback) callback(snapshot.val());
          else snapshot.val();
        } 
      });
  },

    // Creates a post. data is a json that must contain a posterUID value. Refer to database_struc.json to see what other values data can contain
    createPost: (data, image) => {
        let uid = firebase.auth().currentUser.uid
        let name = firebase.auth().currentUser.displayName

        data.posterUID = uid
        data.displayName = name
        data.timestamp = Firebase.database.ServerValue.TIMESTAMP
        if (image) {
            return firebase.database().ref('posts/')
                .push(data)
                .then(async snapshot => {
                    if (image) {
                        let id = snapshot.key
                        uploadPostImage(image, id)
                    }
                })
                .catch((err) => {
                    console.log("POST FAILED \n", err)
                })
        }
        else {
            return firebase.database().ref('posts/')
                .push(data)
                .then(snapshot => {
                    snapshot.val()
                })
                .catch((err) => {
                    console.log("POST FAILED \n", err)
                })
        }

    }
}
