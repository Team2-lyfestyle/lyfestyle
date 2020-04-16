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
  const [post, updatePost] = React.useState('');
  const [postPhoto, updatePostPhoto] = React.useState(null);

  React.useEffect(() => {
    async function askPermission() {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          console.log('Gimme Permission');
        }
      }
    }
  });

  let createPost = async (data, uri = null) => {
    if (uri) data.media = true;
    await queries.createPost(data, uri);
    navigation.navigate('Home');
  };

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
          <Ionicons name='ios-arrow-round-back' size={30} color='#000' />
        </TouchableOpacity>
        {/* Submit/Post */}
        <TouchableOpacity
          onPress={() => {
            if (post && postPhoto){
              createPost(
                {
                  description: post,
                },
                postPhoto
              );
              updatePost('');
              updatePostPhoto(null);
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
            onPress={() => handlePostPhotoCamera()}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name='ios-image'
            size={35}
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
    backgroundColor: '#EFEdF4',
  },
  header: {
    paddingTop: 40,
    flexDirection: 'row',
    paddingBottom: 8,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#CACACA',
    shadowColor: '#454D65',
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },
  input: {
    flexDirection: 'row',
  },
  inputContainer: {
    margin: 32,
    flexDirection: 'row',
  },
  photoUpload: {
    alignSelf: 'center',
    marginHorizontal: 30,
    borderRadius: 15,
    width: 400,
    height: 300,

    borderBottomColor: '#CACACA',
    shadowColor: '#454D65',
    shadowOffset: { height: 5 },
    shadowRadius: 15,
  },
  photoOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});
