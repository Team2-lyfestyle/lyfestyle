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
  let storeData = obj => {
    firebase
      .database()
      .ref('users/' + obj.email)
      .set(obj);
  };

  let getData = () => {
    firebase
      .database()
      .ref('users/')
      .on('value', function(snapshot) {
        updatedata(JSON.stringify(snapshot.val()));
      });
  };

  return (
    <View style={styles.container}>
      <Text>Are you ready for a new lyfestyle?</Text>
      <TextInput
        style={styles.inputContainer}
        placeholder={'Input name'}
        placeholderTextColor={'black'}
        onChangeText={text => updateName(text)}
      ></TextInput>
      <TextInput
        style={styles.inputContainer}
        placeholder={'Input Email'}
        placeholderTextColor={'black'}
        onChangeText={text => updateEmail(text)}
      ></TextInput>
      <TouchableOpacity
        style={{ borderColor: 'black' }}
        onPress={() => storeData({ name: name, email: email })}
      >
        <Text>CLICK ME TO STORE</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => getData()}>
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


