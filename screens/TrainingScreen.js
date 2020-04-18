import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import exerciseData from "../assets/data/exercisesV2.json"


const TrainingScreen = () => {

  renderExercise = ( {item} ) => {
    return (
      <View>
        <Text>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style = {styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Training</Text>
      </View>
      {/* <Text>{ exerciseData['abdominals'] }</Text> */}

      <ScrollView showsVerticalScrollIndicator = {false} style = {{alignSelf: 'center'}}>
        <View style = {styles.muscleGroup}>
          {/* <LinearGradient
            colors={['rgba(0, 254, 212, 1)', 'rgba(32, 64, 81, 1)']}
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: hp('7%'),
            }}
          /> */}
          <Text style = {styles.muscleGroupTitle}>Upper Body</Text>
        </View>
        <Text style = {styles.muscleTitle}>Biceps</Text>
        <FlatList
          style = {styles.muscleContainer}
          data = {exerciseData['biceps']}
          renderItem = { renderExercise }
        />
        <Text style = {styles.muscleTitle}>Chest</Text>
        <FlatList
          style = {styles.muscleContainer}
          data = {exerciseData['chest']}
          renderItem = { renderExercise }
        />

        <View style = {styles.muscleGroup}>
        {/* <LinearGradient
            colors={['rgba(0, 254, 212, 1)', 'rgba(32, 64, 81, 1)']}
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: hp('7%'),
            }}
          /> */}
          <Text style = {styles.muscleGroupTitle}>Core</Text>
        </View>
        <View>
          <Text style = {styles.muscleTitle}>Abdominals</Text>
        </View>
        <FlatList
          style = {styles.muscleContainer}
          data = {exerciseData['abdominals']}
          renderItem = { renderExercise }
        />

        <View style = {styles.muscleGroup}>
          <Text style = {styles.muscleGroupTitle}>Lower Body</Text>
        </View>
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
  muscleGroup: {
    width: wp('91%'),
    height: hp('7%'),
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#204051',
    borderRadius: 5,
  },
  muscleGroupTitle: {
    fontWeight: '500',
    fontSize: 20,
    color: '#00FED4'
  },
  muscleTitle: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '500',
  },
  muscleContainer: {
    width: wp('91%'),
    height: hp('30%'),
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: 'white',
   }, 
});
