import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { TouchableOpacity, ListFooterComponent } from 'react-native-gesture-handler';
import exerciseData from "../assets/data/exercisesV2.json"


const TrainingScreen = () => {

  renderExercise = ( {item} ) => {
    return (
      <Text>{item.name}</Text>
    );
  };

  return (
    <View style = {styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Training</Text>
      </View>
      {/* <Text>{ exerciseData['abdominals'] }</Text> */}
      <Text style = {styles.muscleTitle}>Abdominals</Text>
      <FlatList
        style = {styles.muscleContainer}
        data = {exerciseData['abdominals']}
        renderItem = { this.renderExercise }
        // numColumns={numColumns}
      />
      <Text style = {styles.muscleTitle}>Adductors</Text>
      <FlatList
        style = {styles.muscleContainer}
        data = {exerciseData['adductors']}
        renderItem = { this.renderExercise }
        // numColumns={numColumns}
      />
      <Text style = {styles.muscleTitle}>Quadriceps</Text>
      <FlatList
        style = {styles.muscleContainer}
        data = {exerciseData['quadriceps']}
        renderItem = { this.renderExercise }
        // numColumns={numColumns}
      />
    </View>
  );
};

export default TrainingScreen;

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
    zIndex: 10
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500'
  },
  muscleTitle: {
    marginLeft: 16,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '500',
  },
  muscleContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  }, 
});
