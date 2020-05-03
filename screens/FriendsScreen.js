import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Tab, Tabs } from 'native-base';
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import dbCaller from '../util/firebase_queries';

const FriendsScreen = (props) => {
  let [friendsList, setFriendsList] = React.useState([]);
  let [friendRequestsRcvd, setFriendRequestsRcvd] = React.useState([]);
  let [friendRequestsSent, setFriendRequestsSent] = React.useState([]);

  const loadData = async () => {
    let friendsList = await props.route.params.friendService.getFriendsListAsArray();
    let friendRequestsRcvd = await props.route.params.friendService.getFriendRequestsRcvd();
    let friendRequestsSent = await props.route.params.friendService.getFriendRequestsSent();
    setFriendsList(friendsList);
    setFriendRequestsRcvd(friendRequestsRcvd);
    setFriendRequestsSent(friendRequestsSent);
  };

  React.useEffect(() => {
    let callback = () => { loadData(); };
    dbCaller.listenForUserChanges(callback);
    loadData();
    return () => {
      dbCaller.stopListenForUserChanges(callback);
    }
  }, []);

  const renderItem = ({ item, buttons }) => {
    //console.log('render item:', item);
    return (
      <View style={{backgroundColor: '#EFEdF4'}}>
        <View style={{flex: 1, margin: 15, height: 80, borderRadius: 8,
              backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{fontSize: 20, marginLeft: 20}}>
            {item.name}
          </Text>
          {buttons.map( button => (
            <TouchableOpacity
              style={{backgroundColor: '#406081', marginRight: 20, borderRadius: 10}}
              key={button.buttonName}
              onPress={() => {button.onPress(item.uid)}}
            >
              <Text style={{color: '#00FED4', margin: 15, fontSize: 18}}>{button.buttonName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  };

  const friendsButtons = [{buttonName: 'Remove', onPress: (uid) => {props.route.params.friendService.removeFriend(uid); loadData();}}];
  const sentButtons = [{buttonName: 'Delete', onPress: (uid) => {props.route.params.friendService.deleteSentFriendRequest(uid); loadData();}}];
  const receivedButtons = [{buttonName: 'Accept', onPress: (uid) => {props.route.params.friendService.acceptFriendRequest(uid); loadData();}},
                           {buttonName: 'Deny', onPress: (uid) => {props.route.params.friendService.deleteRcvdFriendRequest(uid); loadData();}}];
  return (
    <View style={styles.container}>
      <Tabs>
        <Tab heading="Friends">
          <FlatList
            style={styles.flatList}
            data={friendsList}
            renderItem={({item}) => renderItem({item: item, buttons: friendsButtons}) }
            keyExtractor={(item) => item.uid}
          />
        </Tab>
        <Tab heading="Sent">
          <FlatList
            style={styles.flatList}
            data={friendRequestsSent}
            renderItem={({item}) => renderItem({item: item, buttons: sentButtons}) }
            keyExtractor={(item) => item.uid}
          />
        </Tab>
        <Tab heading="Received">
          <FlatList
            style={styles.flatList}
            data={friendRequestsRcvd}
            renderItem={({item}) => renderItem({item: item, buttons: receivedButtons}) }
            keyExtractor={(item) => item.uid}
          />
        </Tab>
      </Tabs>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEdF4',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#204051',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EbECf4',
    shadowColor: '#454D65',
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white'
  },
  flatList: {
    flex: 1,
    backgroundColor: '#EFEdF4'
  }
});

export default FriendsScreen;
