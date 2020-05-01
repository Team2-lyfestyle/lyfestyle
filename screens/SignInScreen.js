import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
  Platform
} from 'react-native';
import firebase from '../constants/firebase';
import AuthContext from '../constants/AuthContext';


const SignInScreen = ({ navigation }) => {
  const [email, updateEmail] = React.useState(false);
  const [password, updatePassword] = React.useState(false);
  const [data, updatedata] = React.useState(false);
  //const { signIn } = React.useContext(AuthContext);

  let _submit = () => {
    signIn(email, password);
  };

  return (
    <KeyboardAvoidingView
      behavior={(Platform.OS = 'ios' ? 'padding' : 'height')}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Image
            source={require('../assets/images/lyfestyle.png')}
            style={styles.image}
          />
          <View style={styles.form}>
            <View>
              <Text style={styles.inputTitle}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                autoCapitalize='none'
                onChangeText={text => updateEmail(text)}
              ></TextInput>
            </View>
            <View>
              <Text style={styles.inputTitle}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                autoCapitalize='none'
                onChangeText={text => updatePassword(text)}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => _submit()}>
            <Text styles={{ fontWeight: 'bold' }}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignSelf: 'center' }}
            onPress={() => navigation.navigate('Register')}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 15,
                fontWeight: '500'
              }}
            >
              Already have an account?
              <Text style={{ fontWeight: '600', color: '#00FED4' }}>
                {' '}
                Sign Up!
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#122028'
  },
  inner: {
    padding: 10,
    height: 10,
    flex: 1,
    justifyContent: 'space-around'
  },
  greeting: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    color: 'white'
  },
  image: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    borderRadius: 30,
    margin: 20
  },
  form: {
    marginBottom: 10,
    marginHorizontal: 30
  },
  inputTitle: {
    color: 'white',
    marginTop: 20,
    fontWeight: 'bold'
  },
  input: {
    borderBottomColor: '#00FED4',
    borderBottomWidth: 1,
    marginBottom: 36,
    height: 40,
    fontSize: 15,
    color: 'white'
  },
  button: {
    marginHorizontal: 60,
    backgroundColor: '#00FED4',
    borderRadius: 4,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
