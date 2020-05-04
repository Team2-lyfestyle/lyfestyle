import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Image } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import dbCaller from '../util/firebase_queries';
import FriendService from '../util/FriendService';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


let friendService = new FriendService();

const ExploreScreen = ({navigation}) => {
  let [data, setData] = React.useState({});
  let [listData, setListData] = React.useState([]);
  let [dataIsLoaded, setDataIsLoaded] = React.useState(false);
  let [searchText, setSearchText] = React.useState('');
  let [refreshing, setRefreshing] = React.useState(true);

  const loadData = async () => {
    // For now, just get a list of users
    setRefreshing(true);
    let users = await dbCaller.getAllUsers();
    setData(users);
    setRefreshing(false);
  };

  const convertUsersDataToArray = (users) => {
    let usersArr = [];
    let thisUser = users[dbCaller.getCurrentUserId()];
    for (let user of Object.keys(users)) {
      if (user !== dbCaller.getCurrentUserId()) {
        users[user].key = user;
        users[user].isFriend = thisUser.friends && user in thisUser.friends ? true : false;
        users[user].friendRequestSent = thisUser.friendRequestsSent && user in thisUser.friendRequestsSent? true : false;
        usersArr.push(users[user]);
      }
    }
    return usersArr;
  };

  const getListData = () => {
    let usersArr = convertUsersDataToArray(data);
    usersArr = usersArr.filter( user => {
      if (!user.name) {
        console.log('User with no name:', user);
        return false;
      }
      return user.name.match(new RegExp(`${searchText}`, 'i'));
    });
    return usersArr;
  }

  const renderImage = (media) => {
    if(media) return (<Image source={{uri:media}} style={styles.profileImage}/>)
    else return <Ionicons name="ios-contact" size={100} />
  }

  const renderUser = ({ item }) => (
    <View /*style={{borderColor: 'black', borderWidth: 1}}*/>
      <View style={{margin: 20, backgroundColor: 'white', borderRadius: 5}}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{marginLeft: 20}}>{item.name}</Text> 
          <TouchableOpacity
            style={{marginRight: 20}}
          >
            <Ionicons name="ios-more" size={32} /> 
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {renderImage(item.media)}
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
          <TouchableOpacity
            style={{flex: 1, alignItems: 'center'}}
          >
            <Ionicons name="ios-eye" size={40} />
            <Text>View Profile</Text>
          </TouchableOpacity>
          {
          item.isFriend ? 
            <TouchableOpacity
              style={{flex: 1, alignItems: 'center'}}
            >
              <Ionicons name="ios-checkmark-circle" size={40} />
              <Text>Added</Text>
            </TouchableOpacity>
            : 
            item.friendRequestSent ?
              <TouchableOpacity
                style={{flex: 1, alignItems: 'center'}}
              >
                <Ionicons name="ios-checkmark" size={40} />
                <Text>Friend Request Sent</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity
                style={{flex: 1, alignItems: 'center'}}
                onPress={() => {
                  friendService.sendFriendRequest(item.key);
                }}
              >
                <Ionicons name="ios-person-add" size={40} />
                <Text>Add Friend</Text>
              </TouchableOpacity>
          }
        </View>
      </View>
    </View>
  );

  
  React.useEffect(() => {
    dbCaller.listenForUserChanges( () => {
      loadData();
    });
    loadData();
  }, []);
  
  /*
  // Focus listener
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      dbCaller.listenForUserChanges( () => {
        loadData();
      });
    });
    // Return unsubscribe for cleanup
    return unsubscribe;
  }, [navigation]);
  
  
  // Blur listener
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', async () => {
      dbCaller.stopListenForUserChanges();
    });
    // Return unsubscribe for cleanup
    return unsubscribe;
  }, [navigation]);
  */



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>
      <View style={{height: 80, borderColor: '#204051', borderBottomWidth: 1}}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
          <TextInput
            placeholder="Search"
            placeholderTextColor="#222222"
            fontSize="30"
            style={styles.filterInput}
            autoCapitalize='none'
            onChangeText={text => {
              setSearchText(text);
            }}
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Friends', {friendService: friendService});
            }}
          >
            <Text style={{fontSize: 24}}>Friends</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList 
        //onRefresh={}
        style={{flex: 1}}
        data={getListData()}
        renderItem={renderUser}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData}/>}
      />
    </View>
  )
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
  filterInput: {
    borderRadius: 100,
    backgroundColor: '#406081',
    borderBottomColor: '#8A8F9E',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 20,
    paddingLeft: 30,
    height: 50,
    width: '60%',
    alignSelf: 'center',
    fontSize: 20,
    color: '#EEEEEE'
  },
  profileImage: {
    width: wp('35%'),
    height: hp('16%'),
    borderRadius: 100,
    shadowColor: '#202020',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
},
});

export default ExploreScreen;
