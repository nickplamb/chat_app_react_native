import React, { Component } from 'react';
import { Button, Text, View, StyleSheet, TextInput, ImageBackground, Pressable } from 'react-native';

import backgroundImage from '../assets/background_image.png';

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '' }; 
  }

  render() {
    return (
      <View style={ styles.containter }>
        <ImageBackground source={ backgroundImage } resizeMode='cover' style={ styles.imageBackground } >
          <Text style={ styles.title } >Chat App</Text>
          <View style={ styles.inputContainer}>
            <View style={ styles.innerInputContainer }>
              <TextInput 
                style={ styles.nameInput } 
                placeholder="Your name"
                onChangeText={ (text) => this.setState({ name: text }) }
              />
              <View style={ styles.backgroundColorContainer }>
                <Text style={ styles.backgroundColorText }>Choose Background Color:</Text>
                <View style={ styles.colorSelectorContainer }>
                  <Pressable style={ [styles.backgroundColorCircles, {backgroundColor: '#090C08'}] }></Pressable>
                  <Pressable style={ [styles.backgroundColorCircles, {backgroundColor: '#474056'}] }></Pressable>
                  <Pressable style={ [styles.backgroundColorCircles, {backgroundColor: '#8A95A5'}] }></Pressable>
                  <Pressable style={ [styles.backgroundColorCircles, {backgroundColor: '#B9C6AE'}] }></Pressable>
                </View>
              </View>
              <Pressable
                style={ styles.goChatButton }
                onPress={ () => this.props.navigation.navigate('Chat', { name: this.state.name }) }
              >
                <Text style={ styles.buttonText}>Start Chatting</Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles =  StyleSheet.create({
  containter: {
    flex: 1,
    width: '100%',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: '#FFF',
    margin: 80,
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '88%',
    height: '40%',
    backgroundColor: 'white',
    margin: 50,
  },
  innerInputContainer: {
    justifyContent: 'space-between',
    // backgroundColor: 'red',
    width: '88%',
    height: '88%',
  },
  nameInput: {
    padding: 15,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
    height: 50,
    borderColor: 'grey',
    borderWidth: 1,
  },
  backgroundColorContainer: {
    // backgroundColor: 'orange',
  },
  backgroundColorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100,
  },
  colorSelectorContainer: {
    flexDirection: 'row'
  },
  backgroundColorCircles: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 8,
  },
  goChatButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    backgroundColor: '#757083',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    }
});