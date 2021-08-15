import React, { Component } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';

export default class Chat extends Component {
  
  componentDidMount() {
    this.props.navigation.setOptions({ title: this.props.route.params.name });
  }

  render() {
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