import * as React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput
} from 'react-native';
import firebase from '../constants/firebase';
import AuthContext from '../util/AuthContext';

export default function RegisterScreen({navigation}) {
  const [email, updateEmail] = React.useState(false);
  const [password, updatePassword] = React.useState(false);
  const [data, updatedata] = React.useState(false);

  const { signUp } = React.useContext(AuthContext);

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
      .once('value', function(snapshot) { // once('value') gets value once. on('value') get value and keepd listening for changes
        updatedata(JSON.stringify(snapshot.val()));
      });
  };

  let _submit = () => {
    signUp(email, password);
  }

  return (
    <View style={styles.container}>
      <Text>Are you ready for a new lyfestyle?</Text>
      <TextInput
        style={styles.inputContainer}
        placeholder={'Input Email'}
        placeholderTextColor={'black'}
        onChangeText={text => updateEmail(text)}
      ></TextInput>
      <TextInput
        style={styles.inputContainer}
        placeholder={'Input Password'}
        placeholderTextColor={'black'}
        onChangeText={text => updatePassword(text)}
      ></TextInput>
      <TouchableOpacity
        style={{ borderColor: 'black' }}
        onPress={() => _submit()}
      >
        <Text>CLICK ME TO SUBMIT</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => getData()}>
        <Text>CLICK ME TO GET</Text>
      </TouchableOpacity>
      <Text>{data}</Text>
    </View>
  );
}

RegisterScreen.navigationOptions = {
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


