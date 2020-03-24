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
  'chatSessionId'
*/
export default class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    // remember to bind class methods
    this.getMessages = this.getMessages.bind(this); 
    this.deleteLocalMessages = this.deleteLocalMessages.bind(this);
    
    this.messageCount = 0;    // Variable used to assign _id to messages

    this.state = {
      messages: [],
      dataIsLoaded: false,
    }

    this.otherUser = {
      _id: 2,
      name: "",
      avatar: 'https://placeimg.com/140/140/any',
      username: "",
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
    if (!this.state.componentHasLoaded) {
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