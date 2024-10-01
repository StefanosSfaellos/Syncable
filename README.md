**Syncable**

Overview

Syncable is a React Native application designed to facilitate the sending of MIDI messages through a user-friendly interface. Users can configure MIDI settings, including IP address and port, and send MIDI messages by interacting with buttons on the main screen. The app also includes functionality for selecting and managing setlists and songs.
Features

  Send MIDI Messages: Send custom MIDI messages by pressing buttons on the main screen.
  Configure IP Address and Port: Set and save the IP address and port number to direct where the MIDI messages should be sent.
  Dark Mode: Toggle dark mode for a better user experience in low-light conditions.
  Setlist and Song Management: Select setlists and manage songs within those setlists.

**Installation**

To run this app locally, follow these steps:

Clone the Repository:

  git clone https://github.com/StefanosSfaellos/midi-controller-app.git
  cd midi-controller-app

Install Dependencies:
  npm install

Run the App:
  npm start

For iOS:
  npx react-native run-ios

For Android:
  npx react-native run-android

Usage

  Configure Settings:
      Open the Options Screen.
      Enter the IP address and port number for the MIDI server.
      Toggle dark mode if desired.
      Save the settings.

  Select a Setlist:
      Navigate to the main screen.
      Use the dropdown menu to select a setlist.
      The corresponding songs for the selected setlist will be displayed as buttons.

  Send MIDI Messages:
      Press the song buttons to send the corresponding MIDI messages.
      Use the play and stop buttons to send predefined MIDI messages.

Code Structure

  MainScreen.js: Handles the main functionality of sending MIDI messages and selecting setlists.
  OptionsScreen.js: Allows users to configure IP address, port, and toggle dark mode.
  App.js: Sets up navigation between different screens of the app.


**server.js**: 

  const express = require('express');
  const midi = require('midi');
  const cors = require('cors');
  
  // Create a new Express application
  const app = express();
  const port = 3000;
  
  app.use(cors());
  app.use(express.json());
  
  // Set up a new input and output instance
  const input = new midi.Input();
  const output = new midi.Output();
  
  // Open the first available input and output ports
  input.openPort(0);
  output.openPort(0);
  
  // Route to send MIDI messages
  app.post('/send-midi', (req, res) => {
    const { status, data1, data2 } = req.body;
    output.sendMessage([status, data1, data2]);
    res.send('MIDI message sent');
  });
  
  // Route to receive MIDI messages
  app.get('/receive-midi', (req, res) => {
    input.on('message', (deltaTime, message) => {
      res.json({ deltaTime, message });
    });
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`MIDI controller server listening at http://localhost:${port}`);
  });
