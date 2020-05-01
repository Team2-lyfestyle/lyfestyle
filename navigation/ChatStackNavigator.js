import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatSelectScreen from '../screens/ChatSelectScreen';
import ChatScreen from '../screens/ChatScreen';
const Stack = createStackNavigator();

export default function ChatStackNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="ChatSelect"
        >
            <Stack.Screen
                name="ChatSelect"
                component={ChatSelectScreen}
                options={{
                    title: 'Chats',
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
                name="Chat"
                component={ChatScreen}
                options={{
                    title: 'Chat',
                    headerStyle: {
                        backgroundColor: '#204051',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                  }}
            />
        </Stack.Navigator>
    )
}