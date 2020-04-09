import React, { useState } from 'react';
import { View, Text, FlatLis, StyleSheet, Button } from 'react-native';
import exercises from '../assets/data/exercises.json';
import { TouchableOpacity, FlatList, ListFooterComponent } from 'react-native-gesture-handler';

//Arrow Function

const numColumns = 2;

const TrainingScreen = () => {

  //React Hook States
  const [back, setBack] = useState([
    { name: 'Middle Back', key: '1' },
    { name: 'Lats', key: '2' },
    { name: 'Lower Back', key: '3' },
    { name: 'Upper Back', key: '4' }
  ]);
  // let backMuscle = [
  //   { id: '1', name: 'Middle Back', },
  //   { id: '2', name: '' },
  // ]
  const [legs, setLegs] = useState([
    { name: 'Abductors', key: '1' },
    { name: 'Adductors', key: '2' },
    { name: 'Calves', key: '3' },
    { name: 'Hamstrings', key: '4' },
    { name: 'Quadriceps', key: '5' }
  ]);

  // renderPost = post => {
  //   <View>
  //     <View style = {styles.muscleTitle}>
  //       <Text style = {{fontSize: 25}}>Back</Text>
  //     </View>
  //     <View style = {styles.muscleContainer}>
        
  //     </View>
  //   </View>
  // }

  return (
    <View style = {styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Training</Text>
      </View>

      {/* <FlatList
        style = {styles.muscleContainer}
        numColumns = {numColumns} */}
      {/* /> */}   

      <View style = {styles.muscleTitle}>
        <Text style = {{fontSize: 25}}>Back</Text>
      </View>
      <FlatList
          style={styles.muscleContainer}
          data={back}
          renderItem={({ item }) => (
            <View style = {styles.box} >
              <Text style={{ fontSize: 30 }}>{item.name}</Text>
            </View>
          )}
        />
      
      <View style = {styles.muscleTitle}>
        <Text style = {{fontSize: 25}}>Legs</Text>
      </View>
      <FlatList
        // horizontal
        style={styles.muscleContainer}
        data={legs}
        renderItem={({ item }) => (
          <View style = {styles.box}>
            <Text style={{ fontSize: 30}}>{item.name}</Text>
          </View>
        )}
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
    marginLeft: 20,
    marginTop: 8,
    marginBottom: 5
  },
  muscleContainer: {
    //Flex one makes muscle container take up more volume of page.
    //If we want to make it take up less volume, specify width and height
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 8, 
    backgroundColor: 'white',
  }, 
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 342,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 20
  },
});
