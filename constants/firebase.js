import firebase from "firebase"

const config = {
    apiKey: "AIzaSyB2ZiTg0DeVTdSKklzLLuLXVadkTS2Oct8",
    authDomain: "csci152-lyfestyle.firebaseapp.com",
    databaseURL: "https://csci152-lyfestyle.firebaseio.com",
    projectId: "csci152-lyfestyle",
    storageBucket: "csci152-lyfestyle.appspot.com",
    messagingSenderId: "320500258407",
    appId: "1:320500258407:web:2d1cc2c1eede15b9ba26c2"
}

const Firebase = firebase.initializeApp(config)

export default Firebase