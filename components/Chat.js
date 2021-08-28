import React, { Component } from 'react';
import { KeyboardAvoidingView, Platform, View, StyleSheet, Text } from 'react-native';
import { Bubble, InputToolbar, GiftedChat } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView, { Marker } from 'react-native-maps';

import firebase from 'firebase';
import 'firebase/firestore';

import CustomActions from './CustomActions';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      user: {
        _id: 0,
        name: '',
      },
      isOnline: null,
      backgroundColor: '',
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

  async componentDidMount() {
    // props from navigator
    let { name, backgroundColor } = this.props.route.params;
    this.setState({
      backgroundColor: backgroundColor,
    });

    // I put this in componentDidMount because of a warning in react 16+ https://reactjs.org/blog/2020/02/26/react-v16.13.0.html#warnings-for-some-updates-during-render
    this.props.navigation.setOptions({ title: name });

    NetInfo.fetch().then(connection => {
      if(connection.isConnected) {
        this.setState({ isOnline: true })
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
          // if the user has not been registered, register them.
          if (!user) {
            await firebase.auth().signInAnonymously();
          }

          this.setState({
            user: { 
              _id: user.uid,
              name: name,
             }
          });

          // set the user to local storage for offline use later
          try{
            await AsyncStorage.setItem('user', JSON.stringify(this.state.user));
          } catch(error) {
            console.log(error.message);
          }

          
          // listen for changes to the messages collection
          this.unsubscribeMessages = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
        });
      } else {
        this.setState({ 
          isOnline: false,
        });
        console.log('offline!!')
        this.getMessagesLocal();
      }
    });
  };

  componentWillUnmount() {
    // unsubscribe both listeners, listeners not created if the component is offline.
    if(this.state.isOnline) {
      this.unsubscribeMessages();
      this.authUnsubscribe();
    }
  };

  onCollectionUpdate = async (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach(doc => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image,
        location: data.location,
      });
    });

    // sort messages by createdAt date
    messages.sort((a, b) => b.createdAt - a.createdAt);

    this.setState({
      messages: messages,
    });

    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messages));
    } catch(error) {
      console.log(error.message);
    }
  };

  // set new message from user to state.
  addMessage(message = []){
    this.setState(previousState => ({
      message: GiftedChat.append(previousState.messages, message),
    }), () => {
      this.saveMessagesLocal();
    });
    // send new message to firebase
    this.referenceMessages.add(message[0])
  };

  /*
  *
  *
  * Functions for saving to mobile local storage with AsyncStorage
  */
  // retrieve messages from AsyncStorage
  async getMessagesLocal() {
    let messages, user;
    try{
      messages = await AsyncStorage.getItem('messages') || [];
      user = await AsyncStorage.getItem('user');
      this.setState({
        messages: JSON.parse(messages),
        user: JSON.parse(user),
      });
    } catch(error) {
      console.log(error.message);
    }
  };

  // Save messages that are in state with AsyncStorage.
  async saveMessagesLocal() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch(error) {
      console.log(error.message);
    }
  };

  // Delete all messages from local storage. For development.
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

  /*
  *
  *
  * Render props for Gifted Chat
  */
  // only render bottom toolbar if user is online
  renderInputToolbar(props) {
    if (!this.state.isOnline) {
      return;
    }
    return(
      <InputToolbar
        { ...props }
      />
    );
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
    );
  };

  renderCustomActions(props) {
    return <CustomActions { ...props } />;
  };

  renderCustomView(props) {
    const { currentMessage } = props;
    if(currentMessage.location) {
      return (
        <MapView 
          style={ styles.mapView }
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
            <Marker 
              coordinate={{
                latitude: currentMessage.location.latitude,
                longitude: currentMessage.location.longitude,
              }}
              title="I'm here!"
            />
          </MapView>
      );
    };
    return null;
  }

  render() {
    return (
        <View style={ styles.containter }>
          <GiftedChat
            renderBubble={ this.renderBubble.bind(this) }
            renderInputToolbar={ this.renderInputToolbar.bind(this) }
            renderActions={ this.renderCustomActions }
            renderCustomView={ this.renderCustomView }
            messages={ this.state.messages }
            onSend={ message => this.addMessage(message) }
            user={{
              _id: this.state.user._id,
              name: this.state.user.name,
              avatar: 'https://placeimg.com/140/140/any',
            }} 
            messagesContainerStyle={{ backgroundColor: this.state.backgroundColor }}
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
  },
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3
  },
});
