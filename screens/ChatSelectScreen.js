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
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';
import chatStorage from '../util/ChatStorage';
import ChatServiceContext from '../constants/ChatServiceContext';
import FriendService from '../util/FriendService';
import dbCaller from '../util/firebase_queries';



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
  /*return (
    <Text>Dont work</Text>
  );*/
  const weekdayToName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  console.log('members:', members, 'lastMessageAt:', lastMessageAt);

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
  if (timeSince > (7 * 8.64 * 10**7) && lastMessageAt) { 
    displayTime = `${lastMessageAt.getMonth()}/${lastMessageAt.getDay()}/${lastMessageAt.getFullYear().toString().slice(2, 4)}`
  }
  // If on different days
  else if (timeSince > (8.64 * 10**7) || lastMessageAt.getDay() - now.getDay() !== 0) { 
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

function RenderPicture({ pics, members }) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{width: '75%', height: '75%', borderRadius: 100, borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}>
        <Ionicons name={Object.keys(members).length > 2 ? "ios-contacts" : "ios-contact"} size={65} />
      </View>
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
  let [isOptionsModalVisible, setIsOptionsModalVisible] = React.useState(false);
  let [modalMarginTop, setModalMarginTop] = React.useState(120);


  React.useEffect( () => {
    console.log('mounting chatselectscreen');
    chatService.addNewMsgListener(async function() {
      //console.log('New message from chat select screen');
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
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
          <RenderPicture {...chatSession} />
          <View style={{flex: 4}}>
            <RenderHead {...chatSession}/>
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
        onPress={async () => {
          //deleteRow(rowMap, rowData.item.key);
          await chatService.deleteChatSession(rowData.item.key);
          loadMessages();
        }}
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const getListData = () => {
    let sessions = chatService.convertChatSessionsToOrderedArr(chatSessions);
    console.log('Chat select screen: Got sessions', sessions);
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
      <View style={{height: 60}}></View>

      <View style={{height: 60, width: '100%'}}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
          <View>
            <Text style={{fontSize: 45, fontWeight: '500', color: '#EEEEEE'}}>Messages</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => { 
              setIsComposeModalVisible(true);
            }}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="ios-add" size={32} color="#00FED4" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => { 
              setIsOptionsModalVisible(true);
            }}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="ios-more" size={32} color="#00FED4" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        placeholder="Search"
        placeholderTextColor="#222222"
        fontSize="30"
        style={styles.chatFilterInput}
        autoCapitalize='none'
        onChangeText={text => setSearchText(text)}
        autoCorrect={false}
      />

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
        isVisible={isOptionsModalVisible}
        style={{margin: 0, justifyContent: 'flex-end'}}
      >
        <View style={{height: 200, width: '100%', backgroundColor: '#204051'}}>
          <View style={{flex: 1, justifyContent: 'space-around', alignItems: 'center'}}>
            <TouchableHighlight onPress={() => {
                setIsOptionsModalVisible(false);
                chatStorage.clearChatData();
              }}
              style={styles.optionsButton} //{{width: 100, height: 50, backgroundColor: 'white', borderRadius: 100}}>
            >
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.optionsButtonText}>Delete local chat sessions</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => {
                setIsOptionsModalVisible(false);
              }}
              style={styles.optionsButton} //{{width: 100, height: 50, backgroundColor: 'white', borderRadius: 100}}>
            >
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.optionsButtonText}>Cancel</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <Modal 
        isVisible={isComposeModalVisible}
        avoidKeyboard={true}
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
          setModalMarginTop(120);
        }}
        onSwipeComplete={() => {
          setIsComposeModalVisible(false);
        }}
        swipeDirection={['down']}
        onBackdropPress={() => setIsComposeModalVisible(false)}
        propagateSwipe={true}
        style={{margin: 0, width: '100%', height: 400}}
      >
        <View style={{flex: 1, marginTop: modalMarginTop, overflow: 'hidden', 
          borderTopLeftRadius: 25, borderTopRightRadius: 25, backgroundColor: '#204051'}}
        >
          <View style={{alignSelf: 'center', backgroundColor: 'black', borderRadius: 100, height: 3, width: '60%', marginTop: 10}}></View>
          <Text style={{color: '#EEEEEE', height: 50, fontSize: 30, marginTop: 20, alignSelf: 'center', fontWeight: '500'}}>
            New Message
          </Text>
          <View style={{width: '100%', height: 60}}>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
              <TouchableHighlight 
                style={styles.composeButton}
                onPress={() => {
                  // Do nothing if nobody was added
                  if (Object.keys(composeAdd).length === 0) {
                    return;
                  }

                  setIsComposeModalVisible(false);
                  let members = Object.keys(composeAdd);
                  members.push(dbCaller.getCurrentUserId());
                  //console.log('Testing members:', members);
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
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={styles.composeButtonText}>Confirm</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => setIsComposeModalVisible(false)}
                style={styles.composeButton} //{{width: 100, height: 50, backgroundColor: 'white', borderRadius: 100}}>
              >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={styles.composeButtonText}>Cancel</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>

          <TextInput 
            style={styles.composeInput}
            autoCapitalize='none'
            autoCorrect={false}
            onFocus={() => {
              setModalMarginTop(-20);
            }}
            onBlur={() => {
              setModalMarginTop(120);
            }}
            onChangeText={text => {
              getSuggestions(text).then( (suggestions) => { 
                setComposeSuggestions(suggestions);
              });
            }}
          />

          <View style={{width: '100%', height: 100}}>
            <View style={{marginTop: 5, flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', flexWrap: 'wrap'}}>
              {
              Object.keys(composeAdd).map( (uid) => (
                <TouchableOpacity key={uid} onPress={() => composeSelectUser(composeAdd[uid])}
                  style={{backgroundColor: '#406081', padding: 15, borderRadius: 100}}>
                  <Text>{composeAdd[uid].name}</Text>
                </TouchableOpacity>
              ))
              }
            </View>
          </View>

          <View 
            style={{height: 1, width: '100%', alignSelf: 'center', borderRadius: 1, borderWidth: 1,
            backgroundColor: '#204051', borderStyle: 'dashed', borderColor: 'grey'}}>
          </View>

          <FlatList
            style={{flex: 1}}
            data={composeSuggestions}
            renderItem={ ( {item} ) => (
              <TouchableOpacity
                onPress={() => {
                  composeSelectUser(item);
                }}
                style={{width: '100%', height: 70,
                        marginLeft: item.uid in composeAdd ? 10 : 0}}
              >
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  {item.uid in composeAdd && 
                  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Ionicons style={{marginTop: -15}} name="ios-checkmark" size={100} color="#00FED4" />
                  </View>}
                  <View style={{flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                    <Text style={{marginLeft: 40, fontSize: 20, fontWeight: '500', color: '#EEEEEE'}}>{item.name}</Text>
                  </View>
                </View>
                <View 
                  style={{height: 1, width: '80%', alignSelf: 'center', borderRadius: 1,
                  backgroundColor: '#406081'}}>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.uid}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#204051',
      flex: 1,
    },
    button: {
      width: 35,
      height: 35,
      backgroundColor: '#406081',
      //borderColor: '#102031',
      borderRadius: 100
    },
    buttonText: {
      //textAlignVertical: 'center',
      //marginVertical: 'auto',
      //textAlign: 'center',
      fontWeight: '800',
      fontSize: 18,
      color: '#00FED4'
    },
    composeButton: {
      width: 100,
      height: 50,
      backgroundColor: '#406081',
      //borderColor: '#102031',
      borderRadius: 100
    },
    composeButtonText: {
      //textAlignVertical: 'center',
      //marginVertical: 'auto',
      //textAlign: 'center',
      fontWeight: '800',
      fontSize: 18,
      color: '#00FED4'
    },
    optionsButton: {
      width: '80%',
      height: 50,
      backgroundColor: '#406081',
      //borderColor: '#102031',
      borderRadius: 100,
    },
    optionsButtonText: {
      //textAlignVertical: 'center',
      //marginVertical: 'auto',
      //textAlign: 'center',
      fontWeight: '800',
      fontSize: 18,
      color: '#00FED4'
    },
    chatFilterInput: {
      borderRadius: 100,
      backgroundColor: '#406081',
      borderBottomColor: '#8A8F9E',
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginVertical: 20,
      paddingLeft: 30,
      height: 50,
      width: '90%',
      alignSelf: 'center',
      fontSize: 20,
      color: '#EEEEEE'
    },
    composeInput: {
      borderRadius: 100,
      backgroundColor: '#406081',
      borderBottomColor: '#8A8F9E',
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginTop: 20,
      paddingLeft: 30,
      height: 50,
      width: '90%',
      alignSelf: 'center',
      fontSize: 20,
      color: '#EEEEEE'
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 85,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        height: 85
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
