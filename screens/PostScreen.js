import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import queries from '../util/firebase_queries';

const PostScreen = ({ navigation }) => {
  // State data needed
  const [post, updatePost] = React.useState(false);
  const [postPhoto, updatePostPhoto] = React.useState(false);
  const [profilePic, updateProfilePic] = React.useState(false);  // Used to save profile picture in post to load it in home screen

  React.useEffect(() => {
    async function askPermission() {
      if (Constants.platform.ios) {
        const { statusRoll } = await Permissions.askAsync(
          Permissions.CAMERA_ROLL
        );
        const { statusCamera } = await Permissions.askAsync(Permissions.CAMERA);
        //CAMERA
        if (statusRoll !== 'granted' && statusCamera !== 'granted') {
          console.log('Gimme Permission');
        }
      }
    }
    getCurrentUser()
  });

  let getCurrentUser = async () => {

    let user = await queries.getCurrentUser()
    updateProfilePic(user.media)
  }


  let createPost = async (data, uri = null) => {
    await queries.createPost(data, uri);
    updatePost(false);
    updatePostPhoto(false);
    navigation.navigate('Home');
  };

  // Take picture for post
  // Take picture for post
  let handlePostPhotoLibrary = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
    }).then((result) => {
      updatePostPhoto(result.uri);
    });
  };

  // Use image from Library for post
  let handlePostPhotoCamera = () => {
    ImagePicker.launchCameraAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
    }).then((result) => {
      updatePostPhoto(result.uri);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name='ios-arrow-round-back' size={30} color='#00FED4' />
        </TouchableOpacity>
        {/* Submit/Post */}
        <TouchableOpacity
          onPress={async () => {
            if (post && postPhoto) {
              await createPost(
                {
                  description: post,
                  profile: profilePic
                },
                postPhoto
              );
            }
          }}
        >
          <Text style={styles.headerTitle}> POST </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Share your lyfestyle!'
          placeholderTextColor='white'
          onChangeText={(text) => {
            updatePost(text);
          }}
          value={post}
        />
      </View>
      {/* Options */}
      <View style={styles.photoOption}>
        <TouchableOpacity>
          <Ionicons
            name='ios-camera'
            size={35}
            title='Take photo'
            color='#00FED4'
            onPress={() => handlePostPhotoCamera()}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name='ios-image'
            size={35}
            color='#00FED4'
            title='Choose Photo From Library  '
            onPress={() => handlePostPhotoLibrary()}
          />
        </TouchableOpacity>
      </View>

      <View>
        {postPhoto && (
          <Image source={{ uri: postPhoto }} style={styles.photoUpload} />
        )}
      </View>
    </SafeAreaView>
  );
};
export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#204051',
  },
  header: {
    flexDirection: 'row',
    paddingBottom: 8,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    //borderBottomWidth: 1,
    // borderBottomColor: '#fff',
    //shadowColor: '#00FED4',
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#00FED4',
  },
  input: {
    flexDirection: 'row',
    color: '#fff',
  },
  inputContainer: {
    margin: 32,
    flexDirection: 'row',
  },
  photoUpload: {
    width: 400,
    height: 300,
    top: 40,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 15,
    borderColor: 'red',
  },
  photoOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});
