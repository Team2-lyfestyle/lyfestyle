import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Animated,
  Easing,
  RefreshControl,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import dbCaller from '../util/DatabaseCaller';
import fbqueries from '../util/firebase_queries';
import { GiftedChat } from 'react-native-gifted-chat';
import chatStorage from '../util/ChatStorage';
import ChatService from '../util/ChatService';
import ChatServiceContext from '../constants/ChatServiceContext';

function getChatUpdate() {
  return [
    {
      _id: 1,
      text: 'Hello',
      createdAt: new Date(),
      user: { _id: 2 }
    },
    {
      _id: 2,
      text: 'World',
      createdAt: new Date(),
      user: { _id: 2 }
    },
  ]
}

/*
navigation parameters:
  'chatSessionId'
*/
export default class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.chatSessionId = this.props.chatSessionId;

    // remember to bind class methods
    this.getMessages = this.getMessages.bind(this); 
    this.deleteLocalMessages = this.deleteLocalMessages.bind(this);
    
    this.messageCount = 0;    // Variable used to assign _id to messages

    this.state = {
      messages: [],
      dataIsLoaded: false,
    }

  }

  async componentDidMount() {
    let currentUser = dbCaller.getCurrentUser();
    
    this.thisUser = {
      _id: 1,
      name: currentUser.name,
      avatar: 'https://placeimg.com/140/140/any', // placeholder for actual avatar
      username: currentUser.uid
    }
    
    // Initialize otherUsers object
    this.otherUsers = {};
    let users = [], chatSession = await chatStorage.getChatSession(this.chatSessionId);
    for (let member in chatSession.members) {
      users.push(fbqueries.getUserById(member));
    }
    users = await Promise.all(users);
    for (let user in users) {
      this.otherUsers[user.uid] = {
        _id: user.uid,
        name: user.name,
        avatar: 'https://placeimg.com/140/140/any',
        username: user.username
      }
    }

    // Load messages
    let messages = await chatStorage.getMessages(this.chatSessionId);
    this.setState({
      messages: messages,
      dataIsLoaded: true
    });
  }

  componentWillUnmount() {

  }

  onSend(messages = []) {
    // First, append new message to GiftedChat
    console.log(messages);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    // Then, send to firebase
    ChatService.sendNewMessage(this.chatSessionId, messages[0]);
  }

  getMessages() {
    request = {
      username: this.thisUser.username,
      token: this.thisUser.token,
      from: this.otherUser.username,
    }
    
  }

  deleteLocalMessages() {
    this.setState({
      messages: [],
    });
    this.messageCount = 0;
  }

  render() {
    if (!this.state.dateIsLoaded) {
      return (
        <SafeAreaView style={{flex: 1}}>
          <Text>Loading</Text>
          <ActivityIndicator />
        </SafeAreaView>
      )
    }
    else {
      return (
        <View style={ { flex: 1 } }>
          <GiftedChat 
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)} 
            user={this.thisUser}
          />
        </View>
      );
    }
  }
}