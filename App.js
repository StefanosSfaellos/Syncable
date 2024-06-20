import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainScreen from './screens/MainScreen';
import OptionsScreen from './screens/OptionsScreen';
import SetlistsScreen from './screens/SetlistsScreen';
import SongsScreen from './screens/SongsScreen';
import SetlistDetail from './screens/SetlistDetail'; // Import SetlistDetail screen

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main tab navigator containing Home, Setlists, Songs, and Options screens
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Main') {
            iconName = 'home-outline';
          } else if (route.name === 'Options') {
            iconName = 'settings-outline';
          } else if (route.name === 'Setlists') {
            iconName = 'albums-outline';
          } else if (route.name === 'Songs') {
            iconName = 'musical-notes-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'gray',
        inactiveTintColor: '#cecece',
        style: {
          backgroundColor: 'white',
        },
        labelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen name="Main" component={MainScreen} />
      <Tab.Screen name="Setlists" component={SetlistsScreen} />
      <Tab.Screen name="Songs" component={SongsScreen} />
      <Tab.Screen name="Options" component={OptionsScreen} />
    </Tab.Navigator>
  );
}

// Stack navigator for the entire app
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeTabs}
          options={{ headerShown: false }} // Hide header for the main tabs
        />
        <Stack.Screen name="SetlistDetail" component={SetlistDetail} />
        {/* Add more screens here as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';
// import MainScreen from './screens/MainScreen';
// import OptionsScreen from './screens/OptionsScreen';
// import SetlistDetail from './screens/SetlistDetail';
// import { Feather } from '@expo/vector-icons';

// const Tab = createBottomTabNavigator();

// function App() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         screenOptions={({ route }) => ({
//           tabBarIcon: ({ color, size }) => {
//             let iconName;

//             if (route.name === 'Main') {
//               iconName = 'home-outline';
//             } else if (route.name === 'Options') {
//               iconName = 'settings-outline';
//             }

//             return <Ionicons name={iconName} size={size} color={color} />;
//           },
//           tabBarActiveTintColor: 'gray', // Color of the active tab
//           tabBarInactiveTintColor: '#cecece', // Color of the inactive tab
//           tabBarStyle: {
//             marginTop: '10px',
//             backgroundColor: 'white', // Background color of the tab bar
//           },
//           tabBarLabelStyle: {
//             fontSize: 14,
//             fontWeight: 'bold',
//           },
//         })}
//       >
//         <Tab.Screen name="Main" component={MainScreen} />
//         <Tab.Screen name="Options" component={OptionsScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;


// import React, { useState } from 'react';
// import { View, StyleSheet, Button, Modal, TextInput, Text, TouchableOpacity } from 'react-native';
// import axios from 'axios';

// const App = () => {
//   const [buttons, setButtons] = useState([
//     { id: 1, name: 'Button 1' },
//     { id: 2, name: 'Button 2' },
//     { id: 3, name: 'Button 3' },
//     { id: 4, name: 'Button 4' },
//     { id: 5, name: 'Button 5' },
//   ]);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedButton, setSelectedButton] = useState(null);
//   const [newButtonName, setNewButtonName] = useState('');

//   const sendMIDIMessage = (id) => {
//     const midiMessage = [0x90, 0x3C + id, 0x7F]; // Example MIDI message
//     axios.post('http://192.168.167.16:3000/send-midi', {
//       status: midiMessage[0],
//       data1: midiMessage[1],
//       data2: midiMessage[2]
//     })
//     .then(() => {
//       console.log('MIDI message sent');
//     })
//     .catch((error) => {
//       console.error('Error sending MIDI message:', error);
//     });
//   };

//   const openRenameModal = (button) => {
//     setSelectedButton(button);
//     setNewButtonName(button.name);
//     setModalVisible(true);
//   };

//   const handleRename = () => {
//     setButtons((prevButtons) =>
//       prevButtons.map((button) =>
//         button.id === selectedButton.id ? { ...button, name: newButtonName } : button
//       )
//     );
//     setModalVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       {buttons.map((button) => (
//         <View key={button.id} style={styles.buttonWrapper}>
//           <TouchableOpacity style={styles.midiButton} onPress={() => sendMIDIMessage(button.id)}>
//             <Text style={styles.buttonText}>{button.name}</Text>
//           </TouchableOpacity>
//           <Button title="Rename" onPress={() => openRenameModal(button)} />
//         </View>
//       ))}
//       {selectedButton && (
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalView}>
//               <Text>Rename {selectedButton.name}</Text>
//               <TextInput
//                 style={styles.input}
//                 value={newButtonName}
//                 onChangeText={setNewButtonName}
//               />
//               <Button title="Save" onPress={handleRename} />
//               <Button title="Cancel" onPress={() => setModalVisible(false)} />
//             </View>
//           </View>
//         </Modal>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//   },
//   buttonWrapper: {
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   midiButton: {
//     width: '100%',
//     padding: 20,
//     backgroundColor: '#007bff',
//     borderRadius: 5,
//     marginBottom: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontSize: 18,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalView: {
//     width: '100%',
//     padding: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingLeft: 8,
//   },
// });

// export default App;
