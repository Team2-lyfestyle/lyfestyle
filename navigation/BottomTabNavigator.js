import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//SCREENS
import TabBarIcon from '../components/TabBarIcon';
import TabBarIconWithBadge from '../components/TabBarIconWithBadge';
import HomeScreen from '../screens/HomeScreen';
import TrainingScreen from '../screens/TrainingScreen';
import ChatStackNavigator from '../navigation/ChatStackNavigator';
import TipScreen from '../screens/TipScreen';
import PostScreen from '../screens/PostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import QueryExampleScreen from '../screens/QueryExampleScreen';

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
    console.log('mounting bottomtabnavigator');

    // This is where chat service will listen for new messages
    chatService.listenForNewMessages();

    const unsubscribe = chatService.addNewMsgListener(function() {
      console.log('New message from bottomtabnavigator');
      setTotalNumOfUnreadMessages(chatService.totalNumOfUnreadMessages);
    });
    return unsubscribe;
  }, []);

  React.useEffect( () => {
    chatService.addChatSessionReadListener( async (chatSessionId) => {
      setTotalNumOfUnreadMessages(await chatService.getTotalNumOfUnreadMessages());
    });
  }, []);
  
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
      return 'Home Page';
    case 'Training':
      return 'Training';
    case 'Post':
      return 'Post';
    case 'Chat':
      return 'Chat';
    case 'Explore':
      return 'Explore';
    case 'Profile':
      return 'Profile';
  }
}
