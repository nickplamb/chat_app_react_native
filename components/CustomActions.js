import React, { Component } from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import firestore from 'firebase';
import 'firebase/firestore';

export default class CustomActions extends Component {
  constructor(props) {
    super(props);
  }

  onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length -1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async buttonIndex => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return this.pickImage();
          case 1:
            console.log('user wants to take a photo');
            return this.takePhoto();
          case 2:
            console.log('user wants to get their location');
            return;
          default:
            return;
        }
      },
    );
  };

  /*
  *
  *
  * Functions for picking an image from media library and taking a picture.
  */
  // user picks an image from their media library
  pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (granted) {
      let chosenImage = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [1,1],
        allowsEditing: true,
      })
        .catch(error => console.log(error));

      if(!chosenImage.cancelled) {
        const imageUrl = await this.uploadImage(chosenImage.uri)
        this.props.onSend({ image: imageUrl })
      };
    };
  };
  
  // user can take a picture
  takePhoto = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraPermission.granted || !mediaPermission.granted) {
      alert('You have not given permission to use the camera or media library. Please allow permissions in your phones permissions settings.')
      return;
    };

    let newImage = await ImagePicker.launchCameraAsync({
      aspect: [1,1],
      allowsEditing: true,
    })
      .catch(error => console.log(error));

    if(!newImage.cancelled) {
      const imageUrl = await this.uploadImage(newImage.uri)
      this.props.onSend({ image: imageUrl });
    };
  };

  uploadImage = async (uri) => {
    const imageBlob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(error) {
        console.log(error);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const imageUriAsArray = uri.split('/');
    const imageName = imageUriAsArray[imageUriAsArray.length - 1];

    const storageReference = firebase.storage().ref().child(`images/${imageName}`);
    const snapshot = await storageReference.put(imageBlob);

    imageBlob.close();

    return await snapshot.ref.getDownloadURL();
  }

  render() {
    return(
      <TouchableOpacity style={ [styles.container] } onPress={ this.onActionPress }>
        <View style={ [styles.wrapper, this.props.wrapperStyle] }>
          <Text style={ [styles.iconText, this.props.iconTextStyle] }>+</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2, 
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};