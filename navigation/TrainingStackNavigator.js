import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import TrainingScreen from '../screens/TrainingScreen';
import MuscleGroup from '../screens/MuscleGroup';
const Stack = createStackNavigator();

export default function ChatStackNavigator() {
  return (
    <Stack.Navigator initialRouteName='Training'>
      <Stack.Screen name='Training' component={TrainingScreen} />
      <Stack.Screen name='Muscle Group' component={MuscleGroup} />
    </Stack.Navigator>
  );
}
