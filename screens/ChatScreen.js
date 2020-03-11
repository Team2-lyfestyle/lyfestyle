/*
import React from 'react'
import { View, Text } from 'react-native'

const ChatScreen = () => {
    return (
        <View>
            <Text>CHAT</Text>
        </View>
    )
}

export default ChatScreen;
*/

import React, {useState, useEffect, useCallback} from 'react';
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
import Header from '../components/Header';
import ScreenContainer from '../components/ScreenContainer';
import api from '../utils/apiCaller';
import token from '../utils/tokenFunctions';
import ChatStorage from '../utils/chatStorage';

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
    tok = await token.getToken();
    console.log(tok);
    this.thisUser = {
      _id: 1,
      name: tok.user.name,
      avatar: 'https://placeimg.com/140/140/any', // placeholder for actual avatar
      username: tok.user.username,
      token: tok.token,
    }
  
    // save and load previous messages
    oldMessages = await ChatStorage.getMessages(this.otherUser.username);
    oldMessages.reverse();                      // Need to reverse messages for some reason
    this.messageCount = oldMessages.length;     // Update messageCount to match number of old messages
    this.setState({
      messages: oldMessages,
      componentHasLoaded: true,
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

    // Next, save messages
    ChatStorage.appendMessages(this.otherUser.username, messages);

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
    api.getMessages(request).then( (newMessages) => {
      if (newMessages.length > 0) { // If there are new messages
        // Add _id and user properties to each new message
        for (let i = 0; i < newMessages.length; i++) {
          this.messageCount++;
          newMessages[i]._id = this.messageCount;
          newMessages[i].user = this.otherUser;
        }
        // Messages could be received out of order, so sort by their createdAt Dates
        // The most recent message should be at the end
        newMessages.sort(function(a, b) {
          return (new Date(b.createdAt) - new Date(a.createdAt));
        });
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, newMessages)
        }));

        // Finally, append newMessages to local storage
        ChatStorage.appendMessages(this.otherUser.username, newMessages);
      }
    })
  }

  deleteLocalMessages() {
    ChatStorage.removeMessages(this.otherUser.username);
    this.setState({
      messages: [],
    });
    this.messageCount = 0;
  }
  
  renderChatFooter(props) {
    return (
      <View style={{width: '100%', height: 50, backgroundColor: 'white'}} />
    );
  }

  render() {
    if (!this.state.componentHasLoaded) {
      return (
        <SafeAreaView style={{flex: 1}}>
          <Header title={this.headerTitle} back={true}/>
          <ActivityIndicator />
        </SafeAreaView>
      )
    }
    else {
      return (
        <ScreenContainer>
          <Header title={this.headerTitle} back={true} actions={[
                  //{name: 'Get New Messages', action: this.getMessages}, 
                  {name: 'Delete messages', action: this.deleteLocalMessages, iconName: Platform.OS === 'ios' ? 'ios-remove-circle' : 'md-remove-circle'}
                  //{name: 'Listen for messages', action: this.listenForMessages},
                  //{name: 'Stop listening for messages', action: this.stopListenForMessages},
          ]}/>
          <GiftedChat 
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)} 
            user={this.thisUser}
            renderQuickReplies={this.renderChatFooter}
          />
        </ScreenContainer>
      );
    }
  }
}