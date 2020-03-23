import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default class PostScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text> POST </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
