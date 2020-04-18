import firebase from '../constants/firebase'
let uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {

        const xhr = new XMLHttpRequest();

        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function () {
            reject(new Error('uriToBlob failed'));
        };
        xhr.responseType = 'blob';

        xhr.open('GET', uri, true);
        xhr.send(null);
    });
}

let uploadToProfile = async (blob, fileName) => {
    let currentUser = await firebase.auth().currentUser.uid
    let path = 'uploads/' + currentUser + '/profile/' + fileName
    firebase.storage().ref().child(path).put(blob, {
            contentType: 'image/jpeg'
        }).then((snapshot) => {            
            blob.close();
            snapshot.ref.getDownloadURL().then(async url => {
                await firebase.database().ref('users/' + currentUser).update({ media: url })
            })
        }).catch((error) => {
            console.log("FAILED PROFILE PIC UPLOAD", error)
        });
}

let uploadToPost = async (blob, postId) => {
    let currentUser = await firebase.auth().currentUser.uid
    //update DB with path to image
    let path = 'uploads/' + currentUser + '/posts/' + postId + '.jpeg'
    // upload image
    firebase.storage().ref().child(path).put(blob, {
        contentType: 'image/jpeg'
    }).then((snapshot) => {
        blob.close()
        snapshot.ref.getDownloadURL().then(async url => {
            await firebase.database().ref('posts/' + postId).update({ media: url })
        })
    }).catch((error) => {
        console.log("ERROR UPLOADING", error)
    });
};


module.exports = {
    uploadProfileImage: (uri) => {
        var name = uri.split('/')
        name = name[name.length - 1]

        uriToBlob(uri)
            .then((blob) => {
                return uploadToProfile(blob, name);
            }).then((snapshot) => {
                console.log("File uploaded");
            }).catch((error) => {
                throw error;
            });
    },

    uploadPostImage: (uri, postId) => {
        uriToBlob(uri)
            .then((blob) => {
                return uploadToPost(blob, postId);
            }).then((snapshot) => {
                console.log("File uploaded");
            }).catch((error) => {
                throw error;
            });
    }

}
