import React, { Component } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';

export default class Chat extends Component {
  
  componentDidMount() {
    // I put this in componentDidMount because of a warning in react 16+ https://reactjs.org/blog/2020/02/26/react-v16.13.0.html#warnings-for-some-updates-during-render
    this.props.navigation.setOptions({ title: this.props.route.params.name });
  }

  render() {
    // props from navigator
    let { name, backgroundColor } = this.props.route.params;
    
    return (
      <View style={ [styles.containter, {backgroundColor: backgroundColor}] }>
        <Text style={ styles.text }>Hello { name }</Text>
      </View>
    )
  }
}

const styles =  StyleSheet.create({
  containter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFF'
  }
});