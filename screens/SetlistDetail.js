import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SetlistDetail = ({ route }) => {
  const { setlist } = route.params;
  const [songs, setSongs] = useState([]);
  const [availableSongs, setAvailableSongs] = useState([]);

  useEffect(() => {
    // Load setlist songs and all available songs from AsyncStorage
    const loadSongs = async () => {
      try {
        const setlistSongs = await AsyncStorage.getItem(`@setlist_${setlist.id}`);
        const availableSongsJson = await AsyncStorage.getItem('@songs');

        const storedSetlistSongs = setlistSongs != null ? JSON.parse(setlistSongs) : [];
        const storedAvailableSongs = availableSongsJson != null ? JSON.parse(availableSongsJson) : [];

        setSongs(storedSetlistSongs);
        setAvailableSongs(storedAvailableSongs.filter(song => !storedSetlistSongs.find(s => s.id === song.id)));
      } catch (error) {
        console.error('Error loading songs from AsyncStorage:', error);
      }
    };

    loadSongs();
  }, [setlist.id]);

  useEffect(() => {
    // Save setlist songs to AsyncStorage whenever it changes
    const saveSongs = async () => {
      try {
        await AsyncStorage.setItem(`@setlist_${setlist.id}`, JSON.stringify(songs));
      } catch (error) {
        console.error('Error saving setlist songs to AsyncStorage:', error);
      }
    };

    saveSongs();
  }, [songs, setlist.id]);

  const addSongToSetlist = (song) => {
    const updatedSetlistSongs = [...songs, song];
    const updatedAvailableSongs = availableSongs.filter(s => s.id !== song.id);

    setSongs(updatedSetlistSongs);
    setAvailableSongs(updatedAvailableSongs);
  };

  const removeSongFromSetlist = (songId) => {
    const updatedSetlistSongs = songs.filter(s => s.id !== songId);
    const songToRemove = songs.find(s => s.id === songId);

    if (songToRemove) {
      const updatedAvailableSongs = [...availableSongs, songToRemove];
      setAvailableSongs(updatedAvailableSongs);
    }

    setSongs(updatedSetlistSongs);
  };

  const renderSongItem = ({ item }) => (
    <View style={styles.songItem}>
      <Text>{item.name}</Text>
      <Button title="Remove" onPress={() => removeSongFromSetlist(item.id)} />
    </View>
  );

  const renderAvailableSongItem = ({ item }) => (
    <View style={styles.songItem}>
      <Text>{item.name}</Text>
      <Button title="Add" onPress={() => addSongToSetlist(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{setlist.name}</Text>
      <Text style={styles.subtitle}>Setlist Songs:</Text>
      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No songs added to setlist.</Text>}
      />
      <Text style={styles.subtitle}>Available Songs:</Text>
      <FlatList
        data={availableSongs}
        renderItem={renderAvailableSongItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No available songs.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  songItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SetlistDetail;
