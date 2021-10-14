# Chat-App

This is a chat app built with React Native, React Navigator, and the Gifted Chat. I used Expo and and Android SDK emulator for development.

## Purpose

This app was created to learn React Native, mobile development, and webSockets for real time data.

## Libraries used

* React Native
* React Navigator
* Gifted Chat
* AsyncStorage
* Firebase
* Netinfo
* Expo (for development)
* Android SDK (for development)

## Requirements

* Node v14.17.4 or above
* expo-cli
* An android emulator or iOS simulator, or a smartphone with the Expo app.

## Getting Started

Clone and Install the Chat App

```console
git clone https://github.com/nickplamb/chat-app.git
cd chat-app/
npm install
```

### Install Expo

Expo tools are used for development and testing and allow the app to be run locally

```console
npm install expo-cli --global
```

* Install the Expo app on a smartphone for testing. This app can be found in either the Play Store or App Store.

### iOS Development

To run an iOS simulator you must have a Mac computer and install XCode, which can be found in the App Store.
Once XCode is installed open the preferences and select "Components" and install a simulator from the list.

### Android Development

To set up an Android emulator you can use the emulator that comes with Android Studio.

Expo has a great [guide](https://docs.expo.dev/workflow/android-studio-emulator/) for setting this up in their docs. The [Android Developer docs](https://developer.android.com/studio/run/emulator) also have a lot of helpful guides and information if you get stuck.

### Setting up the Database

This app uses the WebSocket Protocol with Cloud Firestore for its real time database.

* Create the DB and collection
  * Sign into [Google Firebase](https://firebase.google.com/), click on "Go to console" and click "Create Project". Name the project whatever you like.
  * Once this is done, click on "Build" in the sidebar and then "Firestore Database" and then click "Create Database".
  * Create the database in production mode or test mode, depending on your needs (test mode has no security outside of the database reference key). Select an appropriate region for your apps users.
  * Create a collection in the newly created DB. At the top of **components/Chat.js**, just below the imports, set the **databaseCollectionName** to the name of your new collection.

    ```javascript
    const databaseCollectionName = "your collection name here"
    ```

* Connect the app to your DB
  * Click the gear icon to open your "Project Settings", navigate to the "General" tab and under the "Your apps" section select "Firestore for Web" (</> icon.).
  * Copy the config object

    ```javascript
    const firebaseConfig = {...}
    ```

  * This is the config that allows the chat app to connect to your database. Use this to replace the firebaseConfig object at the top of **components/Chat.js**, just below the imports.

* DB Authentication
  * In order for the users to see which messages are theirs they must be authenticated by the app. For development purposes **anonymous** authentication will work just fine, but you may select another option and configure it yourself.
  * From the "Build" section of sidebar in the Firebase console select "Authentication". Select "Get started".
  * Under the "Sign-in method" tab select "Anonymous" from the "Native providers" column. Click save.
    * If a different authentication method is desired, the logic in the **componentDidMount** method of **components/Chat.js** will have to be customized for that authentication method.

### Start the App

```console
npm start
```

This will start up Expo's development server which will allow you to run the app from the web browser, iOS simulator, Android emulator, or from a smartphone using the Expo app and the QR code provided by the dev server.

### Remove Expo warning "Animated.event now requires a second argument for options"

This is an optional step and only removes a [warning](https://github.com/FaridSafi/react-native-gifted-chat/issues/1924) thrown by Expo due to a change in one of its dependencies.

There is currently a [Pull request](https://github.com/FaridSafi/react-native-gifted-chat/pull/2078) to fix this minor issue but until it is merged this workaround can be used.

* navigate to **node_modules/react-native-gifted-chat/lib/MessageImage.js** and change the import for "react-native-lightbox" to "react-native-lightbox-v2".
