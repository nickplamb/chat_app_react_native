import React, { Component } from 'react';
import { KeyboardAvoidingView, Platform, View, StyleSheet } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    }
  }

  componentDidMount() {
    let name = this.props.route.params.name
    // I put this in componentDidMount because of a warning in react 16+ https://reactjs.org/blog/2020/02/26/react-v16.13.0.html#warnings-for-some-updates-during-render
    this.props.navigation.setOptions({ title: name });
    this.setState({
      messages: [
        {
          _id: 1,
          text: `Hello ${name}!`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: `${name} just joined the chat`,
          createdAt: new Date(),
          system: true,
        },
        {
          _id: 3,
          text: 'Hello Developers',
          createdAt: new Date(),
          user: {
            _id: 5,
            name: 'React',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ]
    })
  }

  onSend(messages = []){
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderBubble(props) {
    return(
      <Bubble
        { ...props }
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
          left: {
            backgroundColor: '#abc'
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
            renderBubble={this.renderBubble.bind(this)}
            messages={this.state.messages}
            onSend={ messages => this.onSend(messages) }
            user={{
              _id: 1,
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