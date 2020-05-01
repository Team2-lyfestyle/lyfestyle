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
import dbCaller from '../util/DatabaseCaller';
import chatStorage from '../util/ChatStorage';
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
  'members'
*/

export default function ChatScreen(props) {
  let chatService = React.useContext(ChatServiceContext);

  let [thisUser, setThisUser] = React.useState({});
  let [chatSessionId, setChatSessionId] = React.useState(props.route.params.chatSessionId);
  let [messages, setMessages] = React.useState([]);
  let [dataIsLoaded, setDataIsLoaded] = React.useState(false);
  let [members, setMembers] = React.useState(props.route.params.members);


  let loadMessages = async () => {
    let messages = await chatService.getMessages(chatSessionId);
    messages = chatService.convertMessagesToOrderedArr(messages);
    setMessages(messages);
  };

  // Chat service
  React.useEffect( () => {
    const unsubscribe = chatService.addNewMsgListener( (chatSessions) => {
      //console.log('New message from Chat screen');
      if (chatSessions.indexOf(chatSessionId) >= 0) {
        loadMessages();
      }
    });
    chatService.readChatSession(chatSessionId);
    // Clear listener for cleanup
    return unsubscribe;
  }, []);

  // Initialize data on component mount
  React.useEffect( () => {
    async function initializeData() {
      let thisUser = {
        _id: dbCaller.getCurrentUserId(),
        name: (await dbCaller.getCurrentUser()).name,
      }

      // Initialize members
      let otherMembers = {};
      let users = [];

      // If no chat session id was passed, then a members object will be passed in route parameters
      if (props.route.params.chatSessionId === '') {
        for (let member of Object.keys(props.route.params.members)) {
          users.push(dbCaller.getUserById(member));
        }
        users = await Promise.all(users);
      }
      else {
        users = Object.keys( (await chatStorage.getChatSession(props.route.params.chatSessionId)).members );
      }

      // Initialize otherMembers object (contains metadata of each member in the chat session)
      for (let user of users) {
        otherMembers[user.uid] = {
          _id: user.uid,
          name: user.name,
          avatar: 'https://placeimg.com/140/140/any',
        }
      }

      // Load messages if returning to an existing chat session
      if (chatSessionId !== '') {
        await loadMessages();//await chatService.getMessages(chatSessionId, otherUsers);
      }

      setThisUser(thisUser);
      setMembers({
        ...otherMembers,
        [thisUser._id]: thisUser
      });
      setDataIsLoaded(true);
    }
    initializeData();
  }, []); // empty array runs this effect only on component mount


  // Focus listener
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      console.log('Chat screen focused');
      chatService.focusChatSession(chatSessionId);
    });
    // Return unsubscribe for cleanup
    return unsubscribe;
  }, [props.navigation]);

  // Blur listener
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('blur', async () => {
      console.log('Chat screen blurred');
      chatService.blurChatSession();
    });
    // Return unsubscribe for cleanup
    return unsubscribe;
  }, [props.navigation]);



  let onSend = async (messages = []) => {
    console.log('Sending messages:', messages);

    // If chat session has not been created, create it
    if (chatSessionId === "") {
      setMessages(previousMessages => 
        GiftedChat.append(previousMessages, messages)
      );
      let newChatSessionId = await chatService.createNewChatSession(Object.keys(members), messages[0].text);
      setChatSessionId(newChatSessionId);
    }
    // Else, chat session already exists
    else {
      setMessages(previousMessages => 
        GiftedChat.append(previousMessages, messages)
      );
      chatService.sendNewMessage(chatSessionId, messages[0].text);
    }
  }

  return (
    !dataIsLoaded ?  
      (
        <SafeAreaView style={{flex: 1}}>
          <Text>Loading</Text>
          <ActivityIndicator />
        </SafeAreaView>
      )
    :
      (
      <View style={ { flex: 1 } }>
        <GiftedChat 
          messages={messages}
          onSend={messages => onSend(messages)} 
          user={thisUser}
        />
      </View>
    )
  );
}
