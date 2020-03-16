import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { TextInput, FlatList } from 'react-native-gesture-handler';
import firebase from '../constants/firebase';
const TrainingScreen = ({ navigation }) => {

    const [_data, setdata] = React.useState(false)

    // GET curent Loggedin USER
    let getCurrUser = () => {
        let currUser = firebase.auth().currentUser
        setdata(JSON.stringify(currUser))
    }

    // GET a user using ID
    let getUserByID = (uid) => {
        firebase.database().ref('users/' + uid)
            .once('value', function (snapshot) {
                let val = snapshot.val()
                setdata(JSON.stringify(val))
            });
    }

    // Updates the current user. data is a json object. This will only change the values passed in the json object. 
    // For example, if data = {email: yoshida@mail.com} it will only change the email of the user and nothing else.
    // If the parameter passed doesnt exist, it will be added to the user.
    let updateCurrentUser = (data) => {
        let uid = firebase.auth().currentUser.uid
        firebase.database().ref('users/' + uid)
            .update(data)
    }

    // GETS all posts made by current User.
    // To get ALL posts made by ANYONE, remove ".orderByChild('posterUID').equalTo(uid)"
    let getPostByUser = () => {
        let uid = firebase.auth().currentUser.uid
        firebase.database().ref('posts/').orderByChild('posterUID').equalTo(uid)
            .once('value', function (snapshot) {
                let posts = snapshot.val()
                setdata(JSON.stringify(posts))
            })
    }

    // Creates a post. data is a json that must contain a posterUID value. Refer to database_struc.json to see what other values data can contain
    let createPost = (data) => {
        let uid = firebase.auth().currentUser.uid
        data.posterUID = uid
        firebase.database().ref('posts/')
            .push(data)
    }


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => { getCurrUser() }}>
                <Text>Click to getCurrentUser</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => { getUserByID('EoPzNJ1gctTP5vsm6oWalDPP7zD3') }}>
                <Text>Click to getUserById</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
                onPress={() => {
                    updateCurrentUser({
                        "email": "leoNew@mail.com",
                        "name": "leo"
                    })
                }}>
                <Text>Click to updateUser</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => { getPostByUser() }}>
                <Text>Click to getPostByUser</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
                onPress={() => {
                    createPost({
                        description: "Hello this is me not working out"
                    })
                }}>
                <Text>Click to createPost</Text>
            </TouchableOpacity>
            <Text>{_data}</Text>
        </View>
    );
};

export default TrainingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    inputTitle: {
        color: '#000',
        marginTop: 70,
        textAlign: "center"
    },
    button: {
        marginTop: 35,
        marginHorizontal: 60,
        backgroundColor: '#00FED4',
        borderRadius: 4,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
