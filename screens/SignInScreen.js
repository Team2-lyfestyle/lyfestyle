import * as React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';

import { MonoText } from '../components/StyledText';
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

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/get-started/create-a-new-app/#making-your-first-change'
  );
}

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


