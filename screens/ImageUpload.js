import React from 'react';
import { Button, Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker'
import firebase from '../constants/firebase'

const currentUser = firebase.auth().currentUser.uid

export default function ImageUpload({ navigation }) {
    const [photo, updatePhoto] = React.useState(false)

    React.useEffect(() => {
        async function askPermission() {
            if (Constants.platform.ios) {
                const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
                if (status !== 'granted') {
                    console.log("Gimme Permission")
                }
            };
        }
    })

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

    let uploadToFirebase = (blob) => {

        return new Promise((resolve, reject) => {
            var storageRef = firebase.storage().ref();
            storageRef.child('uploads/' + currentUser + '/photo.jpg').put(blob, {
                contentType: 'image/jpeg'
            }).then((snapshot) => {
                blob.close();
                resolve(snapshot);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    let handleOnPress = () => {

        ImagePicker.launchImageLibraryAsync({
            mediaTypes: "Images"
        }).then((result) => {

            if (!result.cancelled) {
                const { height, width, type, uri } = result;
                return uriToBlob(uri);
            }

        }).then((blob) => {
            return uploadToFirebase(blob);
        }).then((snapshot) => {
            console.log("File uploaded");
        }).catch((error) => {
            throw error;
        });

    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {photo && (
                <Image
                    source={{ uri: photo }}
                    style={{ width: 300, height: 300 }}
                />
            )}
            <Button title="Choose Photo" onPress={handleOnPress} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#122028'
    },
    greeting: {
        marginTop: 50,
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center',
        color: 'white'
    },
    image: {
        alignSelf: 'center',
        width: 250,
        height: 250,
        borderRadius: 30,
        margin: 30
    },
    form: {
        marginTop: 10,
        marginBottom: 40,
        marginHorizontal: 30
    },
    inputTitle: {
        color: 'white',
        marginTop: 20
    },
    input: {
        borderBottomColor: '#8A8F9E',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: 'white'
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
