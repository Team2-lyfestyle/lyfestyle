import * as React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput
} from 'react-native';
import firebase from '../constants/firebase';

export default function SignInScreen({navigation}) {
  const [email, updateEmail] = React.useState(false);
  const [password, updatePassword] = React.useState(false);

  const [data, updatedata] = React.useState(false);

  let _submit = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(console.log("LoggedIn"))
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
        onPress={() => navigation.navigate('Register')}
      >
        <Text>CLICK ME TO register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => getData()}>
        <Text>CLICK ME TO GET</Text>
      </TouchableOpacity>
      <Text>{data}</Text>
    </View>
  );
}

SignInScreen.navigationOptions = {
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


