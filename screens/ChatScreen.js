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
import { GiftedChat } from 'react-native-gifted-chat';

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
  'name': String, required. Name of person being chatted with
  'username': String, required. Username of person being chatted with

*/
export default class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    // remember to bind class methods
    this.getMessages = this.getMessages.bind(this); 
    this.deleteLocalMessages = this.deleteLocalMessages.bind(this);
    
    this.headerTitle = this.props.navigation.getParam('name', 'Finder')
    this.messageCount = 0;    // Variable used to assign _id to messages

    this.state = {
      messages: [],
      componentHasLoaded: false,
    }

    this.otherUser = {
      _id: 2,
      name: this.props.navigation.getParam('name', '?'),
      avatar: 'https://placeimg.com/140/140/any',
      username: this.props.navigation.getParam('username', '?'),
    }
  }

  async componentDidMount() {
    
    /*
    this.thisUser = {
      _id: 1,
      name: tok.user.name,
      avatar: 'https://placeimg.com/140/140/any', // placeholder for actual avatar
      username: tok.user.username,
      token: tok.token,
    */
    
  }

  componentWillUnmount() {

  }

  onSend(messages = []) {
    // First, append new message to GiftedChat
    console.log(messages);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));


    // Send to api
    message = messages[0];    
    api.sendMessage({
      to: this.otherUser.username,
      from: this.thisUser.username,
      text: message.text,
      createdAt: new Date(),
      token: this.thisUser.token,
    }).then( (response) => {
      console.log(response);
    }).catch( (error) => {
      console.log('Error sending message');
      console.log(error);
    })
  }

  getMessages() {
    request = {
      username: this.thisUser.username,
      token: this.thisUser.token,
      from: this.otherUser.username,
    }
    
  }

  deleteLocalMessages() {
    ChatStorage.removeMessages(this.otherUser.username);
    this.setState({
      messages: [],
    });
    this.messageCount = 0;
  }

  render() {
    if (!this.state.componentHasLoaded) {
      return (
        <SafeAreaView style={{flex: 1}}>
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