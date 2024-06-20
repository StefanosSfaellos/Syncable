**MIDI Controller App**

Overview

The MIDI Controller App is a React Native application designed to facilitate the sending of MIDI messages through a user-friendly interface. Users can configure MIDI settings, including IP address and port, and send MIDI messages by interacting with buttons on the main screen. The app also includes functionality for selecting and managing setlists and songs.
Features

  Send MIDI Messages: Send custom MIDI messages by pressing buttons on the main screen.
  Configure IP Address and Port: Set and save the IP address and port number to direct where the MIDI messages should be sent.
  Dark Mode: Toggle dark mode for a better user experience in low-light conditions.
  Setlist and Song Management: Select setlists and manage songs within those setlists.

**Installation**

To run this app locally, follow these steps:

Clone the Repository:

  git clone https://github.com/your-username/midi-controller-app.git
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
