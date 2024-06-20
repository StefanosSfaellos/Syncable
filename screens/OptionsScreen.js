import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Switch, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OptionsScreen = () => {
  const navigation = useNavigation();

  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Load settings from AsyncStorage on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedIp = await AsyncStorage.getItem('@ip_address');
        const storedPort = await AsyncStorage.getItem('@port');
        const storedDarkMode = await AsyncStorage.getItem('@dark_mode');

        if (storedIp !== null) {
          setIpAddress(storedIp);
        }

        if (storedPort !== null) {
          setPort(storedPort);
        }

        if (storedDarkMode !== null) {
          setDarkMode(JSON.parse(storedDarkMode));
        }
      } catch (error) {
        console.error('Error loading settings from AsyncStorage:', error);
      }
    };

    loadSettings();
  }, []);

  // Save IP address to AsyncStorage
  const saveIpAddress = async () => {
    try {
      await AsyncStorage.setItem('@ip_address', ipAddress);
      alert('IP address saved successfully!');
    } catch (error) {
      console.error('Error saving IP address:', error);
    }
  };
  // Save Port to AsyncStorage
  const savePort = async () => {
    try {
      await AsyncStorage.setItem('@port', port);
      alert('Port saved successfully!');
    } catch (error) {
      console.error('Error saving Port:', error);
    }
  };

  // Toggle dark mode state and save to AsyncStorage
  const toggleDarkMode = async () => {
    try {
      const newDarkMode = !darkMode;
      setDarkMode(newDarkMode);
      await AsyncStorage.setItem('@dark_mode', JSON.stringify(newDarkMode));
    } catch (error) {
      console.error('Error toggling dark mode:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.topRow}>
        <Text style={styles.darkModeLabel}>Dark Mode:</Text>
        <Switch
          style={styles.darkModeSwitch}
          value={darkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={darkMode ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
      </View> */}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={ipAddress}
          onChangeText={setIpAddress}
          placeholder="Enter IP Address"
          keyboardType="numeric" // Adjust keyboard type as needed
        />
        <Button onPress={saveIpAddress} title="Save" />
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={port}
          onChangeText={setPort}
          placeholder="Enter Port Number"
          keyboardType="numeric" // Adjust keyboard type as needed
        />
        <Button onPress={savePort} title="Save" />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  darkModeLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  darkModeSwitch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

export default OptionsScreen;
