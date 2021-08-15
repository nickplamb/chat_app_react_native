import React, { Component } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import 'react-native-gesture-handler';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Start from './components/Start';
import Chat from './components/Chat';

// Create the navigator
const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen name="Start" component={ Start } />
          <Stack.Screen name="Chat" component={ Chat } />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'center',
  },
});