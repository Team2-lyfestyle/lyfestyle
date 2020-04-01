import React, { useState } from 'react';
import { View, Text, FlatLis, StyleSheet, Button } from 'react-native';
import exercises from '../assets/data/exercises.json';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';

const TrainingScreen = () => {
  const [back, setBack] = useState([
    { name: 'Middle Back', key: '1' },
    { name: 'Lats', key: '2' },
    { name: 'Lower Back', key: '3' },
    { name: 'Upper Back', key: '4' }
  ]);
  const [legs, setLegs] = useState([
    { name: 'Abductors', key: '1' },
    { name: 'Adductors', key: '2' },
    { name: 'Calves', key: '3' },
    { name: 'Hamstrings', key: '4' },
    { name: 'Quadriceps', key: '5' }
  ]);

  return (
    <View style={{ flex: 3, flexDirection: 'column' }}>
      <Text>Back!</Text>
      <FlatList
      horizontal
        style={styles.container}
        data={back}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}
      />
      <Text>Legs!</Text>
      <FlatList
        style={styles.container}
        data={legs}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
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

  },
  text: {
    color: '#000',
    margin: 600
  }
});
