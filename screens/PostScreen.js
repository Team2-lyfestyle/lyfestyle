import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class PostScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
         <Ionicons name="ios-arrow-round-back" size={30} color='#FFF'/>
          <Text style={styles.headerTitle}> POST </Text>
        </View>
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEdF4'
  },
  header: {
    flexDirection: 'row',
    paddingTop: 40,
    paddingBottom: 8,
    paddingHorizontal: 20,
    backgroundColor: '#204051',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EbECf4',
    shadowColor: '#454D65',
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: "#FFF"
  }
});
