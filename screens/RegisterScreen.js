import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import firebase from '../constants/firebase';
import AuthContext from '../util/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [name, updateName] = React.useState(false);
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
      .once('value', function(snapshot) {
        // once('value') gets value once. on('value') get value and keepd listening for changes
        updatedata(JSON.stringify(snapshot.val()));
      });
  };

  let _submit = () => {
    signUp(email, password);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Are you ready for a new
        <Text style={{ fontWeight: '600', color: '#00FED4' }}> LYFESTYLE?</Text>
      </Text>
      <Image
        source={require('../assets/images/lyfestyle.png')}
        style={styles.image}
      />

      <View style={styles.form}>
        
        <View style={{ marginTop: 32 }}>
          <Text style={styles.inputTitle}>EMAIL ADDRESS</Text>
          <TextInput
            style={styles.input}
            autoCapitalize='none'
             onChangeText={text => updateEmail(text)}
          ></TextInput>
        </View>
        <View style={{ marginTop: 32 }}>
          <Text style={styles.inputTitle}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            autoCapitalize='none'
            onChangeText={text => updatePassword(text)}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => _submit()}
      >
        <Text styles={{ fontWeight: 'bold' }}>Sign Up</Text>

      </TouchableOpacity>
      <TouchableOpacity
        style={{ alignSelf: 'center', marginTop: 32 }}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '500' }}>
          Already have an account?
          <Text style={{ fontWeight: '600', color: '#00FED4' }}> Log In!</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

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
    marginTop: 20,
    fontWeight: "bold"
  },
  input: {
    borderBottomColor: '#00FED4',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: 'white'
  },
  button: {
    marginTop: 30,
    marginHorizontal: 60,
    backgroundColor: '#00FED4',
    borderRadius: 4,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

