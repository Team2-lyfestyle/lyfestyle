import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen, Notifications } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import SignInScreen from './screens/SignInScreen';
import RegisterScreen from './screens/RegisterScreen';
import useLinking from './navigation/useLinking';
import firebase from './constants/firebase'

import registerForPushNotificationsAsync from './util/registerForPushNotificationsAsnyc';
import NotificationContext from './util/NotificationContext';
import AuthContext from './util/AuthContext';

const Stack = createStackNavigator();

export default function App(props) {
  /*
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [notification, setNotification] = React.useState();
  */
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
  let _notificationSubscription;

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
        case 'NOTIFICATION':
          return {
            ...prevState,
            notification: action.notification,
          }
      }
    },
    {
      isLoadingComplete: false,
      initialNavigationState: null,
      isLoggedIn: false,
      notification: null,
    }
  );
  
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    function _handleNotification(notification) {
      dispatch({ type: 'NOTIFICATION', notification });
    }

    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        dispatch({ type: 'NAVIGATION', initialNavigationState: await getInitialState() });

        await registerForPushNotificationsAsync();
        
        // check firebase login and register for push notifications
        firebase.auth().onAuthStateChanged(async user => {
          if (user) {
            // Register for push notifications 
            await registerForPushNotificationsAsync();
            // Handle notifications that are received or selected while the app
            // is open. If the app was closed and then opened by tapping the
            // notification (rather than just tapping the app icon to open it),
            // this function will fire on the next tick after the app starts
            // with the notification data.
            _notificationSubscription = Notifications.addListener(_handleNotification);
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

    // Unsubscribe from notifications when component unmounts
    /*
    return function cleanup() {
      if (_notificationSubscription) {
        _notificationSubscription.remove();
      }
    }
    */
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
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (email, password) => {
        try {
          await firebase.auth().createUserWithEmailAndPassword(email, password);
          let uid = firebase.auth().currentUser.uid;
          await firebase.database().ref('users/' + uid).set({email: email, password: password});
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

        <AuthContext.Provider value={authContext}><NotificationContext.Provider value={state.notification}>

          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <NavigationContainer ref={containerRef} initialState={state.initialNavigationState}>
            <Stack.Navigator headerMode='none'>
              {
                state.isLoggedIn ? 
                (
                  <Stack.Screen name="Home" component={BottomTabNavigator} />
                ) : 
                (
                <>
                  <Stack.Screen name="SignIn" component={SignInScreen}/>
                  <Stack.Screen name="Register" component={RegisterScreen}/>
                </>
                )
              }
            </Stack.Navigator>
          </NavigationContainer>
        </NotificationContext.Provider></AuthContext.Provider>
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