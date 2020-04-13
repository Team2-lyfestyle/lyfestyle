import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
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
      <ScrollView style = {{paddingTop: 8}, {alignSelf: 'center'}}>
        <View>
          <Text style = {styles.muscleTitle}>Abdominals</Text>
        </View>
        <FlatList
          style = {styles.muscleContainer}
          data = {exerciseData['abdominals']}
          renderItem = { renderExercise }
        />
        <Text style = {styles.muscleTitle}>Adductors</Text>
        <FlatList
          style = {styles.muscleContainer}
          data = {exerciseData['adductors']}
          renderItem = { renderExercise }
        />
        <Text style = {styles.muscleTitle}>Quadriceps</Text>
        <FlatList
          style = {styles.muscleContainer}
          data = {exerciseData['quadriceps']}
          renderItem = { renderExercise }
        />
        <Text style = {styles.muscleTitle}>Biceps</Text>
        <FlatList
          style = {styles.muscleContainer}
          data = {exerciseData['biceps']}
          renderItem = { renderExercise }
        />
      </ScrollView>
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
    // marginLeft: 16,
    // width: wp('91%'),
    // height: hp('3%'),
    // justifyContent: 'center',
    // alignSelf: 'center',
    // backgroundColor: 'blue',
    marginBottom: 5,
    // borderRadius: 5,
    fontSize: 16,
    fontWeight: '500',
  },
  muscleContainer: {
    // flex: 1,
    width: wp('91%'),
    height: hp('30%'),
    // marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 5,
    backgroundColor: 'white',
   }, 
});
