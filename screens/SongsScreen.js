import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';

const STORAGE_KEY = '@songs';

const SongsScreen = () => {
  const [songs, setSongs] = useState([]);
  const [newSongName, setNewSongName] = useState('');

  useEffect(() => {
    // Load songs from AsyncStorage when component mounts
    const loadSongs = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        const storedSongs = jsonValue != null ? JSON.parse(jsonValue) : [];
        setSongs(storedSongs);
      } catch (error) {
        console.error('Error loading songs from AsyncStorage:', error);
      }
    };

    loadSongs();
  }, []);

  useEffect(() => {
    // Save songs to AsyncStorage whenever it changes
    const saveSongs = async () => {
      try {
        const jsonValue = JSON.stringify(songs);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      } catch (error) {
        console.error('Error saving songs to AsyncStorage:', error);
      }
    };

    saveSongs();
  }, [songs]);

  const addSong = () => {
    if (newSongName.trim() !== '') {
      setSongs([...songs, { id: Date.now().toString(), name: newSongName }]);
      setNewSongName('');
    }
  };

  const deleteSong = (songId) => {
    const updatedSongs = songs.filter(song => song.id !== songId);
    setSongs(updatedSongs);
  };

  const renameSong = (songId, newName) => {
    const updatedSongs = songs.map(song => {
      if (song.id === songId) {
        return { ...song, name: newName };
      }
      return song;
    });
    setSongs(updatedSongs);
  };

  const renderLeftActions = () => (
    <View style={styles.renameButtonContainer}>
      <Button title="Rename" onPress={() => console.log('Rename pressed')} color="white" />
    </View>
  );

  const renderRightActions = (songId) => (
    <View style={styles.deleteButtonContainer}>
      <Button title="Delete" onPress={() => deleteSong(songId)} color="white" />
    </View>
  );

  const renderItem = ({ item }) => (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={() => renderRightActions(item.id)}
      overshootRight={false}
      overshootLeft={false}
    >
      <View style={styles.songItem}>
        <TextInput
          style={{ flex: 1, marginRight: 10, borderBottomWidth: 1, borderColor: '#ccc' }}
          value={item.name}
          onChangeText={(text) => renameSong(item.id, text)}
        />
      </View>
    </Swipeable>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TextInput
          style={{ flex: 1, height: 40, marginRight: 10, padding: 5 }}
          value={newSongName}
          onChangeText={setNewSongName}
          placeholder="Enter song name"
        />
        <Button onPress={addSong} title="Add Song" />
      </View>
      <FlatList
        data={songs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>No songs added yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  renameButtonContainer: {
    backgroundColor: '#66ccff',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
    marginTop: 5,
  },
  deleteButtonContainer: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
    marginTop: 5,
  },
  songItem: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  setlistName: {
    fontSize: 16,
  },
});

export default SongsScreen;
