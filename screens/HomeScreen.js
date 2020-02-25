import * as React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput
} from 'react-native';
import firebase from '../constants/firebase';

export default function HomeScreen() {
  const [name, updateName] = React.useState(false);
  const [email, updateEmail] = React.useState(false);
  const [data, updatedata] = React.useState(false);
  let storeData = (obj) => {
    firebase
      .database()
      .ref('users/' + obj.name)
      .set(obj);
  };

  let getData = () => {
    firebase
      .database()
      .ref('users/')
      .once('value', function(snapshot) { // once('value') gets value once. on('value') get value and keepd listening for changes
        updatedata(JSON.stringify(snapshot.val()));
      });
  };

  return (
    <View style={styles.container}>
      <Text>Are you ready for a new lyfestyle?</Text>
      <TextInput
        clearButtonMode='always'
        style={styles.inputContainer}
        placeholder={'Input name'}
        placeholderTextColor={'grey'}
        onChangeText={text => updateName(text)}
      ></TextInput>
      <TextInput
        clearButtonMode='always'
        style={styles.inputContainer}
        placeholder={'Input Email'}
        placeholderTextColor={'grey'}
        onChangeText={text => updateEmail(text)}
      ></TextInput>
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => storeData({ name: name, email: email })}
      >
        <Text>CLICK ME TO STORE</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.inputContainer} onPress={() => getData()}>
        <Text>CLICK ME TO GET</Text>
      </TouchableOpacity>
      <Text>{data}</Text>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  inputContainer: {
    textAlign: 'center',
    padding: 20,
    margin: 10,
    alignContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#00FED4',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 5,
    position: 'relative'
  }
});
