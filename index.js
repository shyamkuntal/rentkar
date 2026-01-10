/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// Handle background and quit state messages
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Background message received:', remoteMessage);
  // You can handle background data here if needed
  // The notification will be displayed automatically by Firebase
});

AppRegistry.registerComponent(appName, () => App);

