import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen, Notifications } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import SignInScreen from './screens/SignInScreen';
import RegisterScreen from './screens/RegisterScreen';
import useLinking from './navigation/useLinking';
import firebase from './constants/firebase'
import ChatService from './util/ChatService';

import AuthContext from './constants/AuthContext';
import ChatServiceContext from './constants/ChatServiceContext';

const Stack = createStackNavigator();


export default function App(props) {
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
  const _chatService = new ChatService();

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'LOAD_COMPLETE':
          return {
            ...prevState,
            isLoadingComplete: true,
          };
        case 'NAVIGATION':
          return {
            ...prevState,
            initialNavigationState: action.initialNavigationState,
          }
        case 'SIGN_IN':
          return {
            ...prevState,
            isLoggedIn: true,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isLoggedIn: false,
          };
      }
    },
    {
      isLoadingComplete: false,
      initialNavigationState: null,
      isLoggedIn: false,
    }
  );

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        dispatch({ type: 'NAVIGATION', initialNavigationState: await getInitialState() });

        // check firebase login and register for push notifications
        firebase.auth().onAuthStateChanged(async user => {
          // If user is defined, then we are signed in
          if (user) {

            // Set up a listener for any new messages sent to firebase
            //_chatService.listenForNewMessages();
            dispatch({ type: 'SIGN_IN' });
          }
        });

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });

      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        dispatch({ type: 'LOAD_COMPLETE' });
        SplashScreen.hide();
      }
    }
    loadResourcesAndDataAsync();

  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (email, password) => {
        console.log("Signing in");
        try {
          await firebase.auth().signInWithEmailAndPassword(email, password);
          console.log("Credentials valid");
          dispatch({ type: 'SIGN_IN' });
        }
        catch (e) {
          console.log("Log in failed", e);
        }
      },
      signOut: () => {
        firebase.auth().signOut().then(() => {
          console.log("Sign Out Successful")
          dispatch({ type: 'SIGN_OUT' })
        }).catch(err => {
          console.log("Sign Out FAILED: ", err)
        })

      },
      signUp: async (email, password, name) => {
        try {
          let authentication = await firebase.auth().createUserWithEmailAndPassword(email, password);
          await authentication.user.updateProfile({ displayName: name })
          let uid = await firebase.auth().currentUser.uid;
          await firebase.database().ref('users/' + uid).set(
            {
              email: email,
              name: name,
              bio: "Hello this is my lyfestyle",
              media: "https://firebasestorage.googleapis.com/v0/b/csci152-lyfestyle.appspot.com/o/uploads%2Fdefaults%2Fprofile%2Fdoctor.png?alt=media&token=84fb61ca-ef18-4733-9afd-05d1d9bc7687"
            });
          dispatch({ type: 'SIGN_IN' });
        }
        catch (e) {
          console.log("Sign up failed", e);
        }
      },
    }),
    []
  );

  if (!state.isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>

        <AuthContext.Provider value={authContext}>
          <ChatServiceContext.Provider value={_chatService}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <NavigationContainer ref={containerRef} initialState={state.initialNavigationState} theme={DarkTheme}>
              <Stack.Navigator headerMode='none' >
                {
                  state.isLoggedIn ?
                    (
                      <Stack.Screen name="Home" component={BottomTabNavigator} />
                    ) :
                    (
                      <>
                        <Stack.Screen name="SignIn" component={SignInScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                      </>
                    )
                }
              </Stack.Navigator>
            </NavigationContainer>
          </ChatServiceContext.Provider>
        </AuthContext.Provider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});