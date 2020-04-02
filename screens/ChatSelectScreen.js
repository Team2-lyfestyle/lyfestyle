import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    ActivityIndicator,
    FlatList
} from 'react-native';
import Modal from 'react-native-modal';
import { TextInput } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';
import chatStorage from '../util/ChatStorage';
import ChatServiceContext from '../constants/ChatServiceContext';
import FriendService from '../util/FriendService';

function renderHead({ names, timestamp }) {

}

function renderLastMessage({ message }) {

}

function renderPicture({ pics }) {

}

const sortByDate = (a, b) => (
  a.timestamp.getTime() - b.timestamp.getTime()
);


export default function ChatSelectScreen({ navigation }) {
  /*
    const [listData, setListData] = useState(
    Array(20)
      .fill('')
      .map((_, i) => ({ key: `${i}`, text: `item #${i}` }))
  );
  */

  let chatService = React.useContext(ChatServiceContext);

  chatService.addNewMsgListener(async function() {
    console.log('New message!');
  });

  let [chatSessions, setChatSessions] = React.useState({});
  let [chatSessionsLoaded, setChatSessionsLoaded] = React.useState(false);
  let [searchText, setSearchText] = React.useState("");
  let [composeText, setComposeText] = React.useState("");
  let [isComposeModalVisible, setIsComposeModalVisible] = React.useState(false);
  let [composeSuggestions, setComposeSuggestions] = React.useState([]);
  let [composeAdd, setComposeAdd] = React.useState({});


  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    // TODO: Add modal popup to ensure user wants to actually delete this data

    closeRow(rowMap, rowKey);

    const newData = [...listData];
    const prevIndex = listData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
  };

  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
  };

  const renderItem = (rowData, rowMap) => (
    /*
    rowData.item is an object of the form: 
    {
      name: ["name"]
      picture: ["url"]
      lastMessage: "last message"
      timestamp: "ios 8601 time"
    }
    */
    <TouchableHighlight
      onPress={() => {
        console.log('You touched me');
        navigation.navigate('Chat', { chatSessionId: rowData.key });
      }}
      style={styles.rowFront}
      underlayColor={'#AAA'}
    >
      <View>

      </View>
      <View>
        <Text>I am {rowData.item.text} in a SwipeListView</Text>
      </View>
    </TouchableHighlight>
  );

  const renderHiddenItem = (rowData, rowMap) => (
    <View style={styles.rowBack}>
      <Text>Left</Text>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => closeRow(rowMap, rowData.item.key)}
      >
        <Text style={styles.backTextWhite}>Close</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(rowMap, rowData.item.key)}
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const getListData = () => {
    return chatService.convertChatSessionsToOrderedArr(chatSessions);
  }

  const loadMessages = async () => {
    /*
      First, download any new messages from firebase and store it in ChatStorage
      Then, download the chat sessions from ChatStorage
    */
    let newChatSessions = await chatStorage.getChatSessions();
    setChatSessions(newChatSessions);
    setChatSessionsLoaded(true);
  }

  // Use dummy data for friends list for now
  const friends = [ {uid: '1', name: 'John'}, {uid: '2', name: 'Jane'} ];
  const getSuggestions = async (text) => {
    let suggestions = friends;
    if (text) {
      suggestions = suggestions.filter( item => (
        item.name.match(new RegExp(`${text}`, 'i'))
      ));
    }
    return suggestions;
  }

  // Adds user to composeAdd if not selected, removes if already selected
  const composeSelectUser = (user) => {
    // Need to deep copy composeAdd
    let newComposeAdd = JSON.parse(JSON.stringify(composeAdd)); 
    if (user.uid in composeAdd) {
      delete newComposeAdd[user.uid];
      setComposeAdd(newComposeAdd);
    }
    else {
      setComposeAdd({
        ...composeAdd,
        [user.uid]: user
      });
    }
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log('ChatSelect screen focused');
      loadMessages();
    });
    // Return unsubscribe for cleanup
    return unsubscribe;
  }, [navigation]);


  return (
    <View style={styles.container}>
      <View><Text>Chats</Text></View>
      <TextInput
        style={styles.input}
        autoCapitalize='none'
        onChangeText={text => setSearchText(text)}
      />
      <TouchableOpacity
        onPress={() => { 
          setIsComposeModalVisible(true);
        }}
      >
        <Text>New Message</Text>
      </TouchableOpacity>

      {
        !chatSessionsLoaded ? 
        (
          <ActivityIndicator></ActivityIndicator>
        ) :
        (
          <SwipeListView
            data={getListData()}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={75}
            rightOpenValue={-150}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            onRowDidOpen={onRowDidOpen}
            disableLeftSwipe={true}
          />
        )
      }

      <Modal 
        isVisible={isComposeModalVisible}
        onModalShow={() => { 
          // Show friends list
          getSuggestions().then( (suggestions) => {
            setComposeSuggestions(suggestions);
          })
          /*
          friendService.getFriendsListAsArray().then( friends => 
            dispatch({ type: 'COMPOSE_SUGGESTIONS', composeSuggestions: friends })
          );
          */
        }}
        onModalHide={() => {
          // Remove add suggestions
          setComposeAdd({});
        }}
      >
        <View style={{backgroundColor: 'pink'}}>
          <TouchableHighlight onPress={() => setIsComposeModalVisible(false)}>
            <Text>Cancel</Text>
          </TouchableHighlight>
          <TouchableHighlight 
            onPress={() => {
              setIsComposeModalVisible(false);
              chatService.doesChatSessionExistWithMembers(Object.keys(composeAdd)).then( 
                result => {
                  if (result) {
                    navigation.navigate('Chat', { chatSessionId: result})
                  }
                  else {
                    // Create new chat session
                    console.log('Creating new chat session');
                  }
                }
              )
              .catch(
                err => {console.log('Error creating chat session:', err)}
              );
            }}
          >
            <Text>Confirm</Text>
          </TouchableHighlight>

          <TextInput 
            style={styles.input}
            autoCapitalize='none'
            onChangeText={text => {
              getSuggestions(text).then( (suggestions) => { 
                setComposeSuggestions(suggestions);
              });
            }}
          />

          <View>
            <Text>People you will add</Text>
            {
            Object.keys(composeAdd).map( (uid) => (
              <TouchableOpacity key={uid} onPress={() => composeSelectUser(composeAdd[uid])}>
                <Text>{composeAdd[uid].name}</Text>
              </TouchableOpacity>
            ))
            }
          </View>

          <View>
            <Text>People you can add</Text>
            <FlatList
              data={composeSuggestions}
              renderItem={ ( {item} ) => (
                <TouchableOpacity
                  onPress={() => {
                    composeSelectUser(item);
                  }}
                  style={{marginLeft: item.uid in composeAdd ? 10 : 0}}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.uid}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    input: {
      borderBottomColor: '#8A8F9E',
      borderBottomWidth: StyleSheet.hairlineWidth,
      height: 40,
      fontSize: 15,
      color: 'white'
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 75,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
});
