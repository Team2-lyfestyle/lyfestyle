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

let uploadToFirebase = async (blob, fileName) => {
    let currentUser = await firebase.auth().currentUser.uid
    return new Promise((resolve, reject) => {
        var storageRef = firebase.storage().ref();
        storageRef.child('uploads/' + currentUser + '/' + fileName).put(blob, {
            contentType: 'image/jpeg'
        }).then((snapshot) => {
            blob.close();
            resolve(snapshot);
        }).catch((error) => {
            reject(error);
        });
    });
}

let uploadImage = (result) => {
    let uri = result.uri
    var name = uri.split('/')
    name = name[name.length-1]

    uriToBlob(uri)
    .then((blob) => {
        return uploadToFirebase(blob, name);
    }).then((snapshot) => {
        console.log("File uploaded");
    }).catch((error) => {
        throw error;
    });
}

export default uploadImage;