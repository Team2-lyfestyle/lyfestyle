import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import firebase from '../constants/firebase';
import AuthContext from '../util/AuthContext';


export default function SignInScreen({navigation}) {
  const [email, updateEmail] = React.useState(false);
  const [password, updatePassword] = React.useState(false);
  const [data, updatedata] = React.useState(false);
  const { signIn } = React.useContext(AuthContext);

  let _submit = () => {
    signIn(email, password);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        It's a
        <Text style={{ fontWeight: '600', color: '#00FED4' }}> LYFESTYLE!</Text>
      </Text>
      <Image source={require('../assets/images/lyfestyle.png')} style={styles.image} />
      <View style={styles.form}>
        <View>
          <Text style={styles.inputTitle}>EMAIL ADDRESS</Text>
          <TextInput
            style={styles.input}
            autoCapitalize='none'
            onChangeText={text => updateEmail(text)}
        />
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
        <Text>
          Sign In
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ alignSelf: 'center', marginTop: 32 }}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '500' }}>
          Already have an account?
          <Text style={{ fontWeight: '600', color: '#00FED4' }}> Register Now!</Text>
        </Text>
      </TouchableOpacity>
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
