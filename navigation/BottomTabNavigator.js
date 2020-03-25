import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//SCREENS
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import TrainingScreen from '../screens/TrainingScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ChatStackNavigator from '../navigation/ChatStackNavigator';
import TipScreen from '../screens/TipScreen';
import ProfileScreen from '../screens/ProfileScreen';
import QueryExampleScreen from '../screens/QueryExampleScreen';


const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ header: 'null' });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME} activeBackgroundColor = '#2f95dc'>
      <BottomTab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name='ios-home' />
          )
        }}
      />
      <BottomTab.Screen
        name='Training'
        component={TrainingScreen}
        options={{
          title: 'Training',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name='ios-fitness' />
          )
        }}
      />
      <BottomTab.Screen
        name='Tips'
        component={TipScreen}
        options={{
          title: 'Tips',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name='ios-bulb' />
          )
        }}
      />
      <BottomTab.Screen
        name='Chat'
        component={ChatStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name='ios-text' />
          )
        }}
      />
      <BottomTab.Screen
        name='Explore'
        component={ExploreScreen}
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name='md-compass' />
          )
        }}
      />

      <BottomTab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name='md-person' />
          )
        }}
      />

      <BottomTab.Screen
        name='Queries'
        component={QueryExampleScreen}
        options={{
          title: 'Queries',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name='md-compass' />
          )
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'Home Page';
    case 'Training':
      return 'Training';
    case 'Tips':
      return 'Tips';
    case 'Chat':
      return 'Chat';
    case 'Explore':
      return 'Explore';
    case 'Profile':
      return 'Profile';
  }
}
