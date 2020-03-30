import React from 'react'
import { View, Text, FlatList } from 'react-native'
import exercises from '../assets/data/exercises.json';
const TrainingScreen = () => {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <Text>Exercise Name!</Text>
        <FlatList
          data={exercises}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View>
              <Text>{item.name} && {item.muscleGroup}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
}

export default TrainingScreen
