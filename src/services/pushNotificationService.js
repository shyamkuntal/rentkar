import messaging from '@react-native-firebase/messaging';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { post, getToken } from './api';
import { API_ENDPOINTS } from '../config/api';

const FCM_TOKEN_KEY = '@fcm_token';

class PushNotificationService {
  // Request notification permissions
  async requestPermission() {
    try {
      if (Platform.OS === 'android') {
        // Android 13+ requires explicit permission
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true; // Below Android 13, permission is granted at install
      } else {
        // iOS permission request
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        return enabled;
      }
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }

  // Get FCM token
  async getToken() {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  // Register FCM token with backend
  async registerToken() {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.log('Notification permission denied');
        return false;
      }

      const fcmToken = await this.getToken();
      if (!fcmToken) {
        console.log('Failed to get FCM token');
        return false;
      }

      // Check if we've already registered this token
      const storedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);
      if (storedToken === fcmToken) {
        console.log('FCM token already registered');
        return true;
      }

      // Check if user is logged in
      const authToken = await getToken();
      if (!authToken) {
        console.log('User not logged in, skipping FCM registration');
        return false;
      }

      // Send token to backend
      await post(API_ENDPOINTS.FCM_TOKEN, { fcmToken });
      
      // Store token locally
      await AsyncStorage.setItem(FCM_TOKEN_KEY, fcmToken);
      console.log('FCM token registered successfully');
      return true;
    } catch (error) {
      console.error('Error registering FCM token:', error);
      return false;
    }
  }

  // Setup token refresh listener
  setupTokenRefreshListener() {
    return messaging().onTokenRefresh(async (newToken) => {
      console.log('FCM Token refreshed:', newToken);
      try {
        const authToken = await getToken();
        if (authToken) {
          await post(API_ENDPOINTS.FCM_TOKEN, { fcmToken: newToken });
          await AsyncStorage.setItem(FCM_TOKEN_KEY, newToken);
        }
      } catch (error) {
        console.error('Error updating refreshed token:', error);
      }
    });
  }

  // Setup foreground message handler
  setupForegroundHandler(onMessage) {
    return messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message:', remoteMessage);
      
      // Show local notification for foreground messages
      if (onMessage) {
        onMessage(remoteMessage);
      }
    });
  }

  // Setup background/quit message handler (must be called in index.js)
  static setBackgroundHandler(handler) {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background message:', remoteMessage);
      if (handler) {
        handler(remoteMessage);
      }
    });
  }

  // Get initial notification (when app opened from notification)
  async getInitialNotification() {
    try {
      const remoteMessage = await messaging().getInitialNotification();
      if (remoteMessage) {
        console.log('App opened from notification:', remoteMessage);
        return remoteMessage;
      }
      return null;
    } catch (error) {
      console.error('Error getting initial notification:', error);
      return null;
    }
  }

  // Setup notification opened listener (when app in background)
  setupNotificationOpenedListener(onNotificationOpened) {
    return messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification opened app:', remoteMessage);
      if (onNotificationOpened) {
        onNotificationOpened(remoteMessage);
      }
    });
  }

  // Clear stored token on logout
  async clearToken() {
    try {
      await AsyncStorage.removeItem(FCM_TOKEN_KEY);
    } catch (error) {
      console.error('Error clearing FCM token:', error);
    }
  }
}

export default new PushNotificationService();
