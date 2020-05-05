import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
//SCREENS
import TabBarIcon from '../components/TabBarIcon';
import TabBarIconWithBadge from '../components/TabBarIconWithBadge';
import HomeScreen from '../screens/HomeScreen';
import TrainingScreen from '../screens/TrainingScreen';
import ChatStackNavigator from '../navigation/ChatStackNavigator';
import PostScreen from '../screens/PostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ExploreStackNavigator from '../navigation/ExploreStackNavigator';
import QueryExampleScreen from '../screens/QueryExampleScreen';
import { DarkTheme } from '@react-navigation/native';

import ChatServiceContext from '../constants/ChatServiceContext';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ header: 'null' });

  let chatService = React.useContext(ChatServiceContext);
  let [totalNumOfUnreadMessages, setTotalNumOfUnreadMessages] = React.useState(chatService.totalNumOfUnreadMessages);
  
  React.useEffect( () => {
    // This is where chat service will listen for new messages
    chatService.listenForNewMessages();

    const unsubscribe = chatService.addNewMsgListener(async function() {
      console.log('New message from bottomtabnavigator');
      setTotalNumOfUnreadMessages(await chatService.getTotalNumOfUnreadMessages());
    });
    return unsubscribe;
  }, []);

  React.useEffect( () => {
    const unsubscribe = chatService.addChatSessionReadListener( async (chatSessionId) => {
      console.log('Reading', chatSessionId, 'from bottomtabnavigator');
      setTotalNumOfUnreadMessages(await chatService.getTotalNumOfUnreadMessages());
    });
    return unsubscribe;
  }, []);
  
  return (
    <BottomTab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      theme={DarkTheme}
      tabBarOptions={{
        activeTintColor: '#00FED4',
        style: {
          backgroundColor: '#122028'
        }
      }}
    >
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
          ),

          tabBarVisible: 'false'
        }}
      />
      <BottomTab.Screen
        name='Post'
        component={PostScreen}
        options={{
          title: 'Post',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name='ios-add-circle' />
          )
        }}
      />
      <BottomTab.Screen
        name='Explore'
        component={ExploreStackNavigator}
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name='ios-search' />
          )
        }}
      />
      <BottomTab.Screen
        name='Chat'
        component={ChatStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIconWithBadge focused={focused} name='ios-text' badgeCount={totalNumOfUnreadMessages} />
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
      
    </BottomTab.Navigator>
  );
}
/*
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
*/

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'LYFESTYLE';
    case 'Training':
      return 'Training';
    case 'Post':
      return 'Post';
    case 'Chat':
      return 'Chat';
    case 'Profile':
      return 'Profile';
  }
}
