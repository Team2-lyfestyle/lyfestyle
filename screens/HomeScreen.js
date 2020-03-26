import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { TextInput, FlatList } from 'react-native-gesture-handler';
import firebase from '../constants/firebase';
import AuthContext from '../constants/AuthContext';

const HomeScreen = ({ navigation }) => {
 

  return (
    <View style={styles.container}>
      <Text style={styles.inputTitle}>HELLO</Text>
    </View> 
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  inputTitle: {
    color: '#000',
    marginTop: 70,
    textAlign: "center"
  }
});
