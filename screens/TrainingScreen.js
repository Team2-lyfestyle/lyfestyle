import React from 'react'
import { View, Text, StyleSheet} from 'react-native'

const TrainingScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>TRAINING SCREEN</Text>
        </View>
    )
}

export default TrainingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEdF4'
  },
  text:{
      color: "#fff"
  }
});
