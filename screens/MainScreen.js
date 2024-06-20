import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, useWindowDimensions, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

const MainScreen = () => {
  const [buttons, setButtons] = useState([]);
  const [setlists, setSetlists] = useState([]);
  const [selectedSetlist, setSelectedSetlist] = useState(null);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [loading, setLoading] = useState(true);
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('');

  useEffect(() => {
    const loadSetlists = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@setlists');
        const storedSetlists = jsonValue ? JSON.parse(jsonValue) : [];
        setSetlists(storedSetlists);
        setLoading(false);
      } catch (error) {
        console.error('Error loading setlists from AsyncStorage:', error);
      }
    };

    loadSetlists();
  }, []);

  useEffect(() => {
    const loadIpAddress = async () => {
      try {
        const storedIp = await AsyncStorage.getItem('@ip_address');
        const storedPort = await AsyncStorage.getItem('@port'); // Load Port from AsyncStorage
        if (storedIp !== null) {
          setIpAddress(storedIp);
        }
        if (storedPort !== null) {
          setPort(storedPort); // Set Port state
        }
      } catch (error) {
        console.error('Error loading IP address from AsyncStorage:', error);
      }
    };

    loadIpAddress();
  }, []);
  
  const sendMIDIMessage = (id) => {
    const midiMessage = [0x90, 0x3C + id, 0x7F]; // Example MIDI message
    axios.post(`http://${ipAddress}:${port}/send-midi`, {
      status: midiMessage[0],
      data1: midiMessage[1],
      data2: midiMessage[2]
    })
    .then(() => {
      console.log('MIDI message sent');
    })
    .catch((error) => {
      console.error('Error sending MIDI message:', error);
    });
  };

  const handleSetlistSelect = async (setlistId) => {
    const selected = setlists.find((setlist) => setlist.id === setlistId);
    if (selected) {
      setSelectedSetlist(selected);
      try {
        const storedSongs = await AsyncStorage.getItem(`@setlist_${setlistId}`);
        const parsedSongs = storedSongs ? JSON.parse(storedSongs) : [];
        setButtons(parsedSongs);
      } catch (error) {
        console.error('Error loading songs from AsyncStorage:', error);
        setButtons([]);
      }
    } else {
      setSelectedSetlist(null);
      setButtons([]);
    }
  };

  const renderSongButton = ({ item }) => (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity style={styles.midiButton} onPress={() => sendMIDIMessage(item.id)}>
        <Text style={styles.buttonText}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>
      <View style={[styles.fullWidthButton, styles.buttonWrapper]}>
        <TouchableOpacity style={[styles.fullWidthButton, styles.playButton]} onPress={() => sendMIDIMessage(1)}>
          <Ionicons name="play-outline" size={36} color="white" />
        </TouchableOpacity>      
        <TouchableOpacity style={[styles.fullWidthButton, styles.stopButton]} onPress={() => sendMIDIMessage(2)}>
          <Ionicons name="stop-outline" size={36} color="white" />
        </TouchableOpacity>
      </View>
      <RNPickerSelect
        onValueChange={handleSetlistSelect}
        items={setlists.map(setlist => ({ label: setlist.name, value: setlist.id }))}
        placeholder={{ label: 'Select a setlist...', value: null }}
        style={pickerSelectStyles}
      />
      {selectedSetlist ? (
        <FlatList
          style={styles.songlist}
          data={buttons}
          renderItem={renderSongButton}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.placeholderText}></Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  containerLandscape: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  songlist: {
    marginTop: '5%',
    width: '100%',
  },
  fullWidthButton: {
    flexDirection: 'row',
    width: '50%',
    padding: 20,
    borderRadius: 5,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    height: '100%',
    backgroundColor: '#32a852',
  },
  stopButton: {
    height: '100%',
    backgroundColor: 'red',
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: 10,
  },
  midiButton: {
    width: '100%',
    padding: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  noSongsText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 18,
    marginTop: 20,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: 'gray',
    marginBottom: '10px',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    width: '100%',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    width: '100%',
  },
});

export default MainScreen;
