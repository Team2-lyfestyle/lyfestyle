import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Button } from 'react-native';
import { TextInput, FlatList } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker'
import queries from '../util/firebase_queries'
const QueryExampleScreen = ({ navigation }) => {

    // State for displaying data retrieved from DB
    const [currUser, setCurrUser] = React.useState(false)
    const [userById, setuserById] = React.useState(false)
    const [postsByUser, setPostsByUser] = React.useState(false)


    // States for data to be uploaded to DB
    const [name, updateName] = React.useState(false)
    const [email, updateEmail] = React.useState(false)
    const [post, updatePost] = React.useState(false)
    const [profilePhoto, updateProfilePhoto] = React.useState(false)
    const [postPhoto, updatePostPhoto] = React.useState(false)

    React.useEffect(() => {
        async function askPermission() {
            if (Constants.platform.ios) {
                const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
                const { statusCamera } = await Permissions.askAsync(Permissions.CAMERA);
                CAMERA
                if (statusRoll !== 'granted' && statusCamera !== 'granted') {
                    console.log("Gimme Permission")
                }
            };
        }
    })

    // Take picture for profile
    let handleProfilePhotoCamera = () => {

        ImagePicker.launchCameraAsync({
            mediaTypes: "Images",
            allowsEditing: true
        }).then((result) => {
            updateProfilePhoto(result.uri)
        })
    }

    // Use image from library for Profile
    let handleProfilePhotoLibrary = () => {

        ImagePicker.launchImageLibraryAsync({
            mediaTypes: "Images",
            allowsEditing: true
        }).then((result) => {
            updateProfilePhoto(result.uri)
        })
    }

    // Take picture for post
    let handlePostPhotoLibrary = () => {
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: "Images",
            allowsEditing: true
        }).then((result) => {
            updatePostPhoto(result.uri)
        })
    }

    // Use image from Library for post
    let handlePostPhotoCamera = () => {
        ImagePicker.launchCameraAsync({
            mediaTypes: "Images",
            allowsEditing: true
        }).then((result) => {
            updatePostPhoto(result.uri)
        })
    }


    let getCurrUser = async () => {
        var user = await queries.getCurrentUser()
        setCurrUser(JSON.stringify(user))
    }
    let getUserByID = async (id) => {
        var user = await queries.getUserByID(id)
        setuserById(JSON.stringify(user))
    }
    let updateCurrentUser = async (data, uri = null) => {
        if(uri)
            data.media = true       // TODO: Maybe store the path instead of a boolean. Path alway follows the pattern uploads/{userID}/profile/
                                    // TODO: Think about how to save and mark the newest profile picture
        await queries.updateCurrentUser(data, uri)
    }
    let getPostByUser = async () => {
        var posts = await queries.getPostByUser()
        setPostsByUser(JSON.stringify(posts))
    }
    let createPost = async (data, uri = null) => {
        if(uri)
            data.media = true       // TODO: Maybe store the path instead of a boolean. Path alway follows the pattern uploads/{userID}/posts/{postId}
        await queries.createPost(data, uri)
    }

    return (
        <ScrollView style={styles.container}>

            <View style={{ borderBottomColor: 'black', borderWidth: 2, marginLeft: 5, marginRight: 5 }}>
                <TouchableOpacity style={styles.button} onPress={() => getCurrUser()}>
                    <Text>Click to getCurrentUser</Text>
                </TouchableOpacity>
                <Text>{currUser}</Text>
            </View>

            <View style={{ borderBottomColor: 'black', borderWidth: 2, marginLeft: 5, marginRight: 5 }}>

                <TouchableOpacity style={styles.button} onPress={() => getUserByID('EoPzNJ1gctTP5vsm6oWalDPP7zD3')}>
                    <Text>Click to getUserById</Text>
                </TouchableOpacity>
                <Text>{userById}</Text>
            </View>

            <View style={{ borderBottomColor: 'black', borderWidth: 2, marginLeft: 5, marginRight: 5 }}>
                <TextInput style={styles.input} placeholder="Input new name" onChangeText={(e) => updateName(e)} />
                <TextInput style={styles.input} placeholder="Input new email" onChangeText={(e) => updateEmail(e)} />
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {profilePhoto && (
                        <Image
                            source={{ uri: profilePhoto }}
                            style={{ width: 300, height: 300 }}
                        />
                    )}
                    <Button title="Choose Photo From Library  " onPress={() => handleProfilePhotoLibrary()} />
                    <Button title="Take Picture" onPress={() => handleProfilePhotoCamera()} />
                </View>
                <TouchableOpacity style={styles.button}
                    onPress={() => {
                        updateCurrentUser(
                            {
                                "email": email,
                                "name": name
                            },
                            profilePhoto
                        )
                    }
                    }>
                    <Text>Click to updateUser</Text>
                </TouchableOpacity>
            </View>

            <View style={{ borderBottomColor: 'black', borderWidth: 2, marginLeft: 5, marginRight: 5 }}>

                <TouchableOpacity style={styles.button} onPress={() => getPostByUser()}>
                    <Text>Click to getPostByUser</Text>
                </TouchableOpacity>
                <Text>{postsByUser}</Text>

            </View>

            <View style={{ borderBottomColor: 'black', borderWidth: 2, marginLeft: 5, marginRight: 5 }}>
                <TextInput style={styles.input} placeholder="Input post" onChangeText={(e) => updatePost(e)} />
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {postPhoto && (
                        <Image
                            source={{ uri: postPhoto }}
                            style={{ width: 300, height: 300 }}
                        />
                    )}
                    <Button title="Choose Photo From Library  " onPress={() => handlePostPhotoLibrary()} />
                    <Button title="Take Picture" onPress={() => handlePostPhotoCamera()} />
                </View>
                <TouchableOpacity style={styles.button}
                    onPress={() => {
                        createPost({
                            description: post
                        },
                            postPhoto
                        )
                    }
                    }>
                    <Text>Click to createPost</Text>
                </TouchableOpacity>
            </View>
        </ScrollView >
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
