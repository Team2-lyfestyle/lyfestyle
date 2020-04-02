import { AsyncStorage } from 'react-native';

const asyncStorage = {
  setItem: async (key, value) => {
    try {
      if (!(typeof value === "string" || value instanceof String)) {
        value = JSON.stringify(value);
      }
      console.log(`Setting ${key}: ${value}`);
      await AsyncStorage.setItem(key, value);
      return true;
    }
    catch (err) {
      console.log(`Error setting ${key}: ${value}`, err);
      throw err;
    }
  },

  getItem: async (key) => {
    try {
      console.log(`Getting value from ${key}`);
      let value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }
      else {
        // No value set at key
        console.log(`No value set at ${key}`);
        return null;
      }
    }
    catch (err) {
      console.log(`Error getting ${key}`, err);
      throw err;
    }
  },
}

export default asyncStorage;