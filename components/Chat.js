import React, { Component } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';

export default class Chat extends Component {
  
  componentDidMount() {
    this.props.navigation.setOptions({ title: this.props.route.params.name });
  }

  render() {
    let name = this.props.route.params.name;
    
    return (
      <View style={ styles.containter }>
        <Text>Hello { name }</Text>
      </View>
    )
  }
}

const styles =  StyleSheet.create({
  containter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});