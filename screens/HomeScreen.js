import React from 'react';
import { Text, StyleSheet, View, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

posts = [
  {
    id: '1',
    name: 'Monica K',
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    timestamp: 1569109273726,
    avatar: require('../assets/dummyImages/tempAvatar.jpg'),
    image: require('../assets/dummyImages/tempImage1.jpg')
  },
  {
    id: '2',
    name: 'Brandon K',
    text:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    timestamp: 1569109273726,
    avatar: require('../assets/dummyImages/tempAvatar.jpg'),
    image: require('../assets/dummyImages/tempImage2.jpg')
  },
  {
    id: '3',
    name: 'Israel P',
    text:
      'Amet mattis vulputate enim nulla aliquet porttitor lacus luctus. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant.',
    timestamp: 1569109273726,
    avatar: require('../assets/dummyImages/tempAvatar.jpg'),
    image: require('../assets/dummyImages/tempImage3.jpg')
  },
  {
    id: '4',
    name: 'Leo Y',
    text:
      'At varius vel pharetra vel turpis nunc eget lorem. Lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor. Adipiscing tristique risus nec feugiat in fermentum.',
    timestamp: 1569109273726,
    avatar: require('../assets/dummyImages/tempAvatar.jpg'),
    image: require('../assets/dummyImages/tempImage4.jpg')
  }
];

class HomeScreen extends React.Component {
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
              <Text style={styles.timestamp}>{post.timestamp}</Text>
            </View>
            <Ionicons name='ios-more' size={24} color='#73788B' />
          </View>
          <Text style={styles.post}> {post.text} </Text>
          <Image
            source={post.image}
            style={styles.postImage}
            resizeMode='cover'
          />
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home</Text>
        </View>

        <FlatList
          style={styles.feed}
          data={posts}
          renderItem={({ item }) => this.renderPost(item)}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEdF4'
  },
  header: {
    paddingTop: 64,
    paddingBottom: 16,
    backgroundColor: '#FFF',
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
    fontSize: 14,
    color: '#838899'
  },
  postImage: {
    width: undefined,
    height: 250,
    borderRadius: 15
  }
});
