import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ExploreScreen from '../screens/ExploreScreen';
import FriendsScreen from '../screens/FriendsScreen';
const Stack = createStackNavigator();

export default function ChatStackNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Explore"
        >
            <Stack.Screen
                name="Explore"
                component={ExploreScreen}
                options={{
                    title: 'Explore',
                    headerStyle: {
                        height: 0,
                        backgroundColor: '#204051',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                  }}
            />
            <Stack.Screen
                name="Friends"
                component={FriendsScreen}
                options={{
                    title: 'Friends',
                    headerStyle: {
                        backgroundColor: '#204051',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontSize: 20,
                        fontWeight: '500',
                        color: 'white'
                    },
                  }}
            />
        </Stack.Navigator>
    )
}