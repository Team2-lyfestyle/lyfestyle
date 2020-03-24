import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import firebase from '../constants/firebase';

const PUSH_ENDPOINT = 'https://your-server.com/users/push-token';

export default async function registerForPushNotificationsAsync() {
  try {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    // only asks if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    // On Android, permissions are granted on app installation, so
    // `askAsync` will never prompt the user

    // Stop here if the user did not grant permissions
    if (status !== 'granted') {
      alert('No notification permissions!');
      return;
    }

    // Get the token that identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    console.log("Getting token:", token);

    // Send the token to firebase
    // const uid = firebase.auth().currentUser.uid
    // const tokenRef = firebase.database().ref(`users/${uid}/token`).push(token);
  }catch(err){
    console.log(err)
  }
}