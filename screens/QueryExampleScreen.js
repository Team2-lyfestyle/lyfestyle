import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { TextInput, FlatList } from 'react-native-gesture-handler';
import firebase from '../constants/firebase';
import queries from '../util/firebase_queries'
const QueryExampleScreen = ({ navigation }) => {

    const [_data, setdata] = React.useState(false)
    const [name, updateName] = React.useState(false)
    const [email, updateEmail] = React.useState(false)
    const [post, updatePost] = React.useState(false)

    let getCurrUser = async () => {
        var user = await queries.getCurrentUser()
        setdata(JSON.stringify(user))
    }
    let getUserByID = async (id) => {
        var user = await queries.getUserByID(id)
        setdata(JSON.stringify(user))
    }
    let updateCurrentUser = async (data) => {
        await queries.updateCurrentUser(data)
    }
    let getPostByUser = async () => {
        var posts = await queries.getPostByUser()
        setdata(JSON.stringify(posts))
    }
    let createPost = async (data) => {
        await queries.createPost(data)
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => getCurrUser()}>
                <Text>Click to getCurrentUser</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => getUserByID('EoPzNJ1gctTP5vsm6oWalDPP7zD3')}>
                <Text>Click to getUserById</Text>
            </TouchableOpacity>

            <View style={{ borderBottomColor: 'black', borderWidth: 2, marginLeft: 5, marginRight: 5 }}>
                <TextInput style={styles.input} placeholder="Input new name" onChangeText={(e) => updateName(e)} />
                <TextInput style={styles.input} placeholder="Input new email" onChangeText={(e) => updateEmail(e)} />
                <TouchableOpacity style={styles.button}
                    onPress={() => {
                        updateCurrentUser({
                            "email": email,
                            "name": name
                        })
                    }
                    }>
                    <Text>Click to updateUser</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => getPostByUser()}>
                <Text>Click to getPostByUser</Text>
            </TouchableOpacity>

            <View style={{ borderBottomColor: 'black', borderWidth: 2, marginLeft: 5, marginRight: 5 }}>
                <TextInput style={styles.input} placeholder="Input post" onChangeText={(e) => updatePost(e)} />
                <TouchableOpacity style={styles.button}
                    onPress={() => {
                        createPost({
                            description: post
                        })
                    }
                    }>
                    <Text>Click to createPost</Text>
                </TouchableOpacity>
            </View>

            <Text>{_data}</Text>
        </View>
    );
};

export default QueryExampleScreen;

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
    },
    input: {
        borderBottomColor: '#8A8F9E',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
    },
});
