import React, { Component } from 'react';
import { KeyboardAvoidingView, Platform, View, StyleSheet, Text } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from 'firebase';
import 'firebase/firestore';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: '',
    }

    const firebaseConfig = {
      apiKey: "AIzaSyCV3EFBY9Qir3KZsoScbqDQc2SpcJbwEFc",
      authDomain: "chat-app-d5e57.firebaseapp.com",
      projectId: "chat-app-d5e57",
      storageBucket: "chat-app-d5e57.appspot.com",
      messagingSenderId: "84291303167",
      appId: "1:84291303167:web:fcc3d29b3ad5c6514a7eca",
      measurementId: "G-W0PPFEK4WE"
    };

    // Initialize Firebase
    if(!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      // firebase.analytics(); 
    }
    
    // reference to messages collection on firebase
    this.referenceMessages = firebase.firestore().collection('messages');
  };

  
  componentDidMount() {
    let name = this.props.route.params.name
    // I put this in componentDidMount because of a warning in react 16+ https://reactjs.org/blog/2020/02/26/react-v16.13.0.html#warnings-for-some-updates-during-render
    this.props.navigation.setOptions({ title: name });
    
    this.getMessages();
    
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
      // if the user has not been registered, register them.
      if (!user) {
        await firebase.auth().signInAnonymously();
      }

      this.setState({
        uid: user.uid,
      });
      
      // listen for changes to the messages collection
      this.unsubscribeMessages = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
    });
  };
  
  componentWillUnmount() {
    // unsubscribe both listeners
    this.unsubscribeMessages();
    this.authUnsubscribe();
  };

  async getMessages() {
    let messages = '';
    try{
      messages = await AsyncStorage.getItems('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch(error) {
      console.log(error.message);
    }
  };

  onCollectionUpdate = querySnapshot => {
    const messages = [];
    querySnapshot.forEach(doc => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });

    // sort messages by createdAt date
    messages.sort((a, b) => b.createdAt - a.createdAt);

    this.setState({
      messages: messages,
    });
  };

  // set new message to state.
  addMessage(message = []){
    this.setState(previousState => ({
      message: GiftedChat.append(previousState.messages, message),
    }), () => {
      this.saveMessages();
    });
    // send new message to firebase
    this.referenceMessages.add(message[0])
  };

  // Save messages that are in state.
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch(error) {
      console.log(error.message);
    }
  };

  // Delete all messages. For development.
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      });
    } catch(error) {
      console.log(error.message);
    };
  };

  renderBubble(props) {
    return(
      <Bubble
        { ...props }
        wrapperStyle={{
          right: {
            backgroundColor: '#D9B26A',
          },
          left: {
            backgroundColor: '#FFF'
          }
        }}
      />
    )
  }

  render() {
    // props from navigator
    let { name, backgroundColor } = this.props.route.params;
    
    return (
        <View style={ styles.containter }>
          <GiftedChat
            renderBubble={ this.renderBubble.bind(this) }
            messages={ this.state.messages }
            onSend={ message => this.addMessage(message) }
            user={{
              _id: this.state.uid,
              name: name,
              avatar: 'https://placeimg.com/140/140/any',
            }} 
            messagesContainerStyle={{ backgroundColor: backgroundColor }}
          />
          {/* Prevents input feild from being hidden by keyboard on some android devices */}
          { Platform.os === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
        </View>
    )
  }
}

const styles =  StyleSheet.create({
  containter: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  text: {
    color: '#FFF'
  }
});
