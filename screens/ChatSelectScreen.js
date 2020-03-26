import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    ActivityIndicator
} from 'react-native';
import { Container, Header, Content, Tab, Tabs } from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';
import chatStorage from '../util/ChatStorage';
import ChatServiceContext from '../constants/ChatServiceContext';

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

  chatService.newMsgEmitter.on('newMessage', async function() {
    console.log();
    dispatch( {action: 'LOAD_START'} );
    let newSessions = await chatService.getChatSessions();
    dispatch( {action: 'LOAD_FIN', chatSessions: newSessions} );
  });

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'LOAD_START':
          return {
            chatSessions: { ...prevState.chatSessions },
            chatSessionsLoaded: false,
            searchText: prevState.searchText
          }
        case 'LOAD_FIN':
          return {
            ...action.chatSessions,
            chatSessionsLoaded: true,
            searchText: prevState.searchText
          }
        case 'DELETE':
          let chatId = action.chatId;
          let newState = {
            ...prevState
          };
          delete newState.chatId;
          chatStorage.deleteChatSession(chatId);
          return newState;
      }
    },
    {
      chatSessions: {},
      chatSessionsLoaded: false,
      searchText: "",            // Text held in search text entry at top of the screen
    }
  );


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
    return chatService.getChatSessionsAsOrderedArr();
  }

  const loadMessages = async () => {
    /*
      First, download any new messages from firebase and store it in ChatStorage
      Then, download the chat sessions from ChatStorage
    */
    let chatSessions = await ChatStorage.getChatSessions();
    dispatch({ type: 'LOAD', chatSessions: chatSessions });
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log('ChatSelect screen focused');
      let messages = chatService.getChatSessions();
    });
    // Return unsubscribe for cleanup
    return unsubscribe;
  }, [navigation]);


  if (state.chatSessionsLoaded) {
    return (
      <View style={styles.container}>
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
      </View>
    );
  }
  else {
    return (
      <View style={styles.container}>
        <ActivityIndicator></ActivityIndicator>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
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
