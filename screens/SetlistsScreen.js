import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';

const STORAGE_KEY = '@setlists';
const SONGS_STORAGE_KEY = '@songs';

const SetlistsScreen = ({ navigation }) => {
  const [setlists, setSetlists] = useState([]);
  const [newSetlistName, setNewSetlistName] = useState('');
  const [storedSongs, setStoredSongs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSetlist, setSelectedSetlist] = useState(null);
  const [newSetlistNameInput, setNewSetlistNameInput] = useState('');

  useEffect(() => {
    const loadSetlists = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        const storedSetlists = jsonValue != null ? JSON.parse(jsonValue) : [];
        setSetlists(storedSetlists);
      } catch (error) {
        console.error('Error loading setlists from AsyncStorage:', error);
      }
    };

    loadSetlists();
  }, []);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(SONGS_STORAGE_KEY);
        const storedSongs = jsonValue != null ? JSON.parse(jsonValue) : [];
        setStoredSongs(storedSongs);
      } catch (error) {
        console.error('Error loading songs from AsyncStorage:', error);
      }
    };

    loadSongs();
  }, []);

  const saveSetlists = async (updatedSetlists) => {
    try {
      const jsonValue = JSON.stringify(updatedSetlists);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving setlists to AsyncStorage:', error);
    }
  };

  const addSetlist = () => {
    if (newSetlistName.trim() !== '') {
      const updatedSetlists = [...setlists, { id: Date.now().toString(), name: newSetlistName, songs: [] }];
      setSetlists(updatedSetlists);
      saveSetlists(updatedSetlists);
      setNewSetlistName('');
    }
  };

  const deleteSetlist = (setId) => {
    const updatedSetlists = setlists.filter(setlist => setlist.id !== setId);
    setSetlists(updatedSetlists);
    saveSetlists(updatedSetlists);
  };

  const renameSetlist = (setId, newName) => {
    const updatedSetlists = setlists.map(setlist => {
      if (setlist.id === setId) {
        return { ...setlist, name: newName };
      }
      return setlist;
    });
    setSetlists(updatedSetlists);
    saveSetlists(updatedSetlists);
  };

  const handleLongPress = (setlist) => {
    setSelectedSetlist(setlist);
    setNewSetlistNameInput(setlist.name);
    setModalVisible(true);
  };

  const handleRename = () => {
    if (selectedSetlist && newSetlistNameInput.trim() !== '') {
      renameSetlist(selectedSetlist.id, newSetlistNameInput);
      setModalVisible(false);
      setSelectedSetlist(null);
      setNewSetlistNameInput('');
    }
  };

  const addSongToSetlist = (setId, songId) => {
    const updatedSetlists = setlists.map(setlist => {
      if (setlist.id === setId) {
        if (!setlist.songs.includes(songId)) {
          return { ...setlist, songs: [...setlist.songs, songId] };
        }
      }
      return setlist;
    });
    setSetlists(updatedSetlists);
    saveSetlists(updatedSetlists);
  };

  const navigateToSetlistDetail = (setlist) => {
    navigation.navigate('SetlistDetail', { setlist });
  };

  const renderItem = ({ item }) => {
    
    const renderRightActions = () => (
      <View style={styles.deleteButtonContainer}>
        <Button title="Delete" onPress={() => deleteSetlist(item.id)} color="white"/>
      </View>
    );

    return (
      <Swipeable
        renderLeftActions={false}
        renderRightActions={renderRightActions}
        overshootRight={false}
        overshootLeft={false}
      >
        <TouchableOpacity onPress={() => navigateToSetlistDetail(item)} onLongPress={() => handleLongPress(item)}>
          <View style={styles.setlistItem}>
            <Text style={styles.setlistName}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TextInput
          style={{ flex: 1, height: 40, marginRight: 10, padding: 5 }}
          value={newSetlistName}
          onChangeText={setNewSetlistName}
          placeholder="Enter setlist name"
        />
        <Button onPress={addSetlist} title="Add Setlist" />
      </View>
      <FlatList
        data={setlists}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>No setlists added yet.</Text>}
      />
      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text>Rename Setlist</Text>
              <TextInput
                style={styles.input}
                value={newSetlistNameInput}
                onChangeText={setNewSetlistNameInput}
              />
              <Button title="Save" onPress={handleRename} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  deleteButtonContainer: {
    backgroundColor: '#e84343',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  setlistItem: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  setlistName: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default SetlistsScreen;
