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
const Stack = createStackNavigator();

export default function App(props) {
  
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const [isLoggedIn, setLoggedIn] = React.useState(false);

  const [notification, setNotification] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    function _handleNotification(notification) {
      setNotification(notification);
    }

    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // check firebase login
        firebase.auth().onAuthStateChanged(user => {
          if(user)
            setLoggedIn(true)
        })

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });

        // Register for push notifications 
        await registerForPushNotificationsAsync();
        // Handle notifications that are received or selected while the app
        // is open. If the app was closed and then opened by tapping the
        // notification (rather than just tapping the app icon to open it),
        // this function will fire on the next tick after the app starts
        // with the notification data.
        _notificationSubscription = Notifications.addListener(_handleNotification);
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();

    // Unsubscribe from notifications when component unmounts
    return function cleanup() {
      _notificationSubscription.remove();
    }
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
          <Stack.Navigator>
            {
                isLoggedIn ? 
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