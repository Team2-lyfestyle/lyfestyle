import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import exerciseData from "../assets/data/exercisesV2.json"


const TrainingScreen = () => {

  renderExercise = ( {item} ) => {
    return (
      <View>
        <Text style = {{padding: 5}}>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style = {styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Training</Text>
      </View>
      {/* <Text>{ exerciseData['abdominals'] }</Text> */}
      <ScrollView showsVerticalScrollIndicator = {false} contentContainerStyle={{alignItems: 'center'}}>
        {/* UPPER BODY  */}
          <View style = {styles.muscleGroup}>
            <Text style = {styles.muscleGroupTitle}>Upper Body</Text>
          </View>
          {/* <ScrollView horizontal = {true} showsHorizontalScrollIndicator = {false}> */}
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

          <Text style = {styles.muscleTitle}>Shoulders</Text>
          <FlatList
            style = {styles.muscleContainer}
            data = {exerciseData['shoulders']}
            renderItem = { renderExercise }
          />

          <Text style = {styles.muscleTitle}>Traps</Text>
          <FlatList
            style = {styles.muscleContainer}
            data = {exerciseData['traps']}
            renderItem = { renderExercise }
          />

          <Text style = {styles.muscleTitle}>Triceps</Text>
          <FlatList
            style = {styles.muscleContainer}
            data = {exerciseData['triceps']}
            renderItem = { renderExercise }
          /> 
        {/* </ScrollView> */}
        {/* CORE  */}
        <View style = {styles.muscleGroup}>
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
        {/* LOWER BODY  */}
        <View style = {styles.muscleGroup}>
          <Text style = {styles.muscleGroupTitle}>Lower Body</Text>
        </View>
        <Text style = {styles.muscleTitle}>Adductors</Text>
        <FlatList
          style = {styles.muscleContainer}
          data = {exerciseData['adductors']}
          renderItem = { renderExercise }
        />
        <Text style = {styles.muscleTitle}>Calves</Text>
        <FlatList
          style = {styles.muscleContainer}
          data = {exerciseData['calves']}
          renderItem = { renderExercise }
        />
        <Text style = {styles.muscleTitle}>Glutes</Text>
        <FlatList
          style = {styles.muscleContainer}
          data = {exerciseData['glutes']}
          renderItem = { renderExercise }
        />
        <Text style = {styles.muscleTitle}>Hamstrings</Text>
        <FlatList
          style = {styles.muscleContainer}
          data = {exerciseData['hamstrings']}
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
    width: wp('85%'),
    height: hp('20%'),
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: 'white',
    // paddingHorizontal: 10,
    // paddingVertical: 10
   }, 
});
