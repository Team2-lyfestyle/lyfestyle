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
import dbCaller from '../util/DatabaseCaller';



// https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}



function RenderHead({ members, lastMessageAt }) {
  return (
    <Text>Dont work</Text>
  );
  const weekdayToName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  let membersArr = [];
  for (let member of Object.keys(members)) {
    membersArr.push(members[member].name);
  }
  let displayMembers = membersArr.join(', ');

  // Get datetime to display
  let now = new Date();
  let timeSince = now - lastMessageAt;
  let displayTime = '';
  // If been at least a week since lastMessageAt
  if (timeSince > 7 * 8.64 * 10**7) { 
    displayTime = `${lastMessageAt.getMonth()}/${lastMessageAt.getDay()}/${lastMessageAt.getFullYear().slice(2, 4)}`
  }
  // If on different days
  else if (lastMessageAt.getDay() - now.getDay() !== 0) { 
    displayTime = weekdayToName[lastMessageAt.getDay()];
  }
  else {
    displayTime = formatAMPM(lastMessageAt);
  }

  return (
    <View>
      <View>
        <Text>
          {displayMembers}
        </Text>
      </View>
      <View>
        <Text>{displayTime}</Text>
      </View>
    </View>
  );
}

function RenderLastMessage({ lastMessageText }) {
  return (
    <View>
      <Text>
        {lastMessageText}
      </Text>
    </View>
  );
}

function RenderPicture({ pics }) {
  return (
    <View>
      <Text>
        Avatars
      </Text>
    </View>
  );
}

const sortByDate = (a, b) => (
  a.timestamp.getTime() - b.timestamp.getTime()
);


export default function ChatSelectScreen({ navigation }) {

  let chatService = React.useContext(ChatServiceContext);
  let friendService = new FriendService();

  let [chatSessions, setChatSessions] = React.useState({});
  let [chatSessionsLoaded, setChatSessionsLoaded] = React.useState(false);
  let [searchText, setSearchText] = React.useState("");
  let [composeText, setComposeText] = React.useState("");     // Text used in compose new message input, to filter out ppl
  let [isComposeModalVisible, setIsComposeModalVisible] = React.useState(false);
  let [composeSuggestions, setComposeSuggestions] = React.useState([]);
  let [composeAdd, setComposeAdd] = React.useState({});       // Users to add to new chat session


  React.useEffect( () => {
    console.log('mounting chatselectscreen');
    chatService.addNewMsgListener(async function() {
      console.log('New message!');
      loadMessages();
    });
  }, []);


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

  const renderItem = (rowData, rowMap) => {
    /*
      rowData.item is an object of the form: 
      {
        key: chatSessionId
        members: { members object }
        lastMessageText: "last message"
        lastMessageAt: "ios 8601 time"
      }
    */
   let chatSession = {
     ...rowData.item
   };
   delete chatSession.key;
    return (
      <TouchableHighlight
        onPress={() => {
          console.log('You touched me', rowData.item.key);
          navigation.navigate('Chat', { chatSessionId: rowData.item.key });
        }}
        style={styles.rowFront}
        underlayColor={'#AAA'}
      >
        <View>
          <RenderPicture {...chatSession} style={ {width: '20%', height: '100%'} } />
          <View>
            <RenderHead />
            <RenderLastMessage {...chatSession}/>
          </View>
        </View>
      </TouchableHighlight>
    )
  };

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
    let sessions = chatService.convertChatSessionsToOrderedArr(chatSessions);
    console.log('Got sessions', sessions);
    return sessions;
  }

  const loadMessages = async () => {
    /*
      First, download any new messages from firebase and store it in ChatStorage
      Then, download the chat sessions from ChatStorage
    */
    let newChatSessions = await chatService.getChatSessions(true);

    //console.log('Chat sessions:', newChatSessions);
    setChatSessions(newChatSessions);
    setChatSessionsLoaded(true);
  }

  const getSuggestions = async (text) => {
    let suggestions = await friendService.getFriendsListAsArray();
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

  // Focus listener
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      // console.log('ChatSelect screen focused');
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
          chatStorage.clearChatData();
        }}
      >
        <Text>Delete local chat data</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => { 
          //chatService.test();
        }}
      >
        <Text></Text>
      </TouchableOpacity>
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
            disableRightSwipe={true}
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
              // Do nothing if nobody was added
              if (Object.keys(composeAdd).length === 0) {
                return;
              }

              setIsComposeModalVisible(false);
              let members = Object.keys(composeAdd);
              members.push(dbCaller.getCurrentUser().uid);
              console.log('Testing members:', members);
              chatService.doesChatSessionExistWithMembers(members).then( 
                result => {
                  if (result) {
                    console.log('Chat session exists with id:', result);
                    navigation.navigate('Chat', { chatSessionId: result})
                  }
                  else {
                    // Create new chat session
                    // First, convert members array to an object
                    let membersObj = {}
                    for (let member of members) {
                      membersObj[member] = true;
                    }
                    navigation.navigate('Chat', { chatSessionId: '', members: membersObj});
                  }
                }
              )
              .catch(
                err => {console.log('Error:', err)}
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
      borderRadius: 10,
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
