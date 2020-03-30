import React from 'react';
import { Text, StyleSheet, View, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment'
import { Button } from 'native-base';
import AuthContext from '../util/AuthContext'

// Dummy Data
posts = [
  {
    id: '1',
    name: 'Monica K',
    text: 'Look at my gym!',
    timestamp: 1584637200000,
    avatar: require('../assets/dummyImages/tempAvatar.jpg'),
    image: require('../assets/dummyImages/tempImage1.jpg')
  },
  {
    id: '2',
    name: 'Brandon K',
    text: 'Deadlifts today!',
    timestamp: 1584378000000,
    avatar: require('../assets/dummyImages/tempAvatar.jpg'),
    image: require('../assets/dummyImages/tempImage2.jpg')
  },
  {
    id: '3',
    name: 'Israel P',
    text: 'Gymming with a view!',
    timestamp: 1584032400000,
    avatar: require('../assets/dummyImages/tempAvatar.jpg'),
    image: require('../assets/dummyImages/tempImage3.jpg')
  },
  {
    id: '4',
    name: 'Leo Y',
    text: 'This is a LYFESTYLE!',
    timestamp: 1583859600000,
    avatar: require('../assets/dummyImages/tempAvatar.jpg'),
    image: require('../assets/dummyImages/tempImage4.jpg')
  }
];

export default function HomeScreen({ navigation }) {
  
  const {signOut} = React.useContext(AuthContext)

  renderPost = post => {
    return (
      <View style={styles.feedItem}>
        <Image source={post.avatar} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View>
              <Text style={styles.name}>{post.name}</Text>
              <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
            </View>
            <Ionicons name='ios-more' size={24} color='#73788B' />
          </View>
          <Text style={styles.post}> {post.text} </Text>
          <Image
            source={post.image}
            style={styles.postImage}
            resizeMode='cover'
          />
          <View style={{ flexDirection: 'row' }}>
            <Ionicons name='ios-heart-empty' size={25} color='#000' style={{ marginRight: 15, marginTop: 10 }} />
            <Ionicons></Ionicons>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home </Text>
      </View>
      <Button onPress={() => { signOut() }}>
        <Text>LogOut</Text>
      </Button>
      <FlatList
        style={styles.feed}
        data={posts}
        renderItem={({ item }) => renderPost(item)}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEdF4'
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
    zIndex: 10
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500'
  },
  feed: {
    marginHorizontal: 16
  },
  feedItem: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 8,
    flexDirection: 'row',
    marginVertical: 8
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 15
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: '#454D65'
  },
  timestamp: {
    fontSize: 11,
    color: '#C4C6CE',
    marginTop: 4
  },
  post: {
    marginTop: 15,
    marginBottom: 5,
    fontSize: 14,
    color: '#838899'
  },
  postImage: {
    width: undefined,
    height: 250,
    borderRadius: 15
  }
});
