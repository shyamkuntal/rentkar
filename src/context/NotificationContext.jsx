import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import socketService from '../services/socketService';
import pushNotificationService from '../services/pushNotificationService';
import { getPendingRequestsCount } from '../services/bookingService';
import { getUnreadCount } from '../services/chatService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [navigationRef, setNavigationRef] = useState(null);

  // Fetch initial counts from API
  const refreshCounts = useCallback(async () => {
    try {
      const [chatResponse, bookingResponse] = await Promise.all([
        getUnreadCount(),
        getPendingRequestsCount()
      ]);
      setUnreadChatCount(chatResponse.count || 0);
      setPendingBookingsCount(bookingResponse.count || 0);
    } catch (error) {
      console.log('Error fetching notification counts:', error);
    }
  }, []);

  // Create notification channel for Android
  const createNotificationChannel = async () => {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
    }
  };

  // Display local notification in system tray (like WhatsApp)
  const displayLocalNotification = async (title, body, data) => {
    try {
      await notifee.displayNotification({
        title,
        body,
        data,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          sound: 'default',
        },
        ios: {
          sound: 'default',
        },
      });
    } catch (error) {
      console.log('Error displaying notification:', error);
    }
  };

  // Handle foreground push notification - show in system tray, not Alert
  const handleForegroundNotification = useCallback(async (remoteMessage) => {
    const { notification, data } = remoteMessage;

    // Show notification in system notification panel (like WhatsApp)
    if (notification?.title) {
      await displayLocalNotification(notification.title, notification.body, data);
    }

    // Also update badge counts
    refreshCounts();
  }, [refreshCounts]);

  // Initialize WebSocket connection and FCM
  useEffect(() => {
    const initSocket = async () => {
      try {
        await socketService.connect();
        setIsSocketConnected(true);
      } catch (error) {
        console.log('Socket connection failed:', error);
        setIsSocketConnected(false);
      }
    };

    const initFCM = async () => {
      try {
        // Create notification channel for Android
        await createNotificationChannel();

        // Register FCM token
        await pushNotificationService.registerToken();

        // Setup foreground handler
        const unsubscribeForeground = pushNotificationService.setupForegroundHandler(
          handleForegroundNotification
        );

        // Setup token refresh listener
        const unsubscribeTokenRefresh = pushNotificationService.setupTokenRefreshListener();

        // Setup notification opened listener (when app in background)
        const unsubscribeOpened = pushNotificationService.setupNotificationOpenedListener((remoteMessage) => {
          console.log('Notification opened:', remoteMessage);
          // Handle navigation here
        });

        // Check if app was opened from a notification
        const initialNotification = await pushNotificationService.getInitialNotification();
        if (initialNotification) {
          console.log('App opened from notification:', initialNotification);
          // Handle navigation to appropriate screen
        }

        return () => {
          unsubscribeForeground();
          unsubscribeTokenRefresh();
          unsubscribeOpened();
        };
      } catch (error) {
        console.log('FCM initialization failed:', error);
      }
    };

    initSocket();
    initFCM();
    refreshCounts();

    // Listen for chat notifications
    const unsubscribeChat = socketService.onNotification(async (data) => {
      if (data.type === 'new_chat_notification') {
        setUnreadChatCount(prev => prev + 1);
        
        // Show notification if we're not currently in this chat
        // (basic check, can be improved with current route check)
        await displayLocalNotification(
            data.senderName || 'New Message',
            data.content || 'You have a new message',
            data
        );
      }
    });

    // Listen for booking notifications
    const unsubscribeBooking = socketService.onBookingNotification(async (data) => {
      console.log('Booking notification received:', data);
      
      if (data.action === 'new_request') {
        setPendingBookingsCount(prev => prev + 1);
        await displayLocalNotification(
            'New Booking Request',
            `You have a new request for ${data.itemTitle || 'your item'}`,
            data
        );
      } else if (data.action === 'confirmed') {
        refreshCounts();
        await displayLocalNotification(
            'Booking Confirmed!',
            `Your booking for ${data.itemTitle || 'item'} has been accepted.`,
            data
        );
      } else if (data.action === 'rejected') {
        refreshCounts();
        await displayLocalNotification(
            'Booking Rejected',
            `Your booking request for ${data.itemTitle || 'item'} was declined.`,
            data
        );
      } else if (data.action === 'cancelled') {
        refreshCounts();
        await displayLocalNotification(
            'Booking Cancelled',
            `The booking for ${data.itemTitle || 'item'} was cancelled.`,
            data
        );
      }
    });

    return () => {
      unsubscribeChat();
      unsubscribeBooking();
    };
  }, [refreshCounts, handleForegroundNotification]);

  // Mark chat as read (reset count)
  const markChatAsRead = useCallback((chatId) => {
    // Could implement per-chat tracking, for now just refresh counts
    refreshCounts();
  }, [refreshCounts]);

  // When user views bookings tab
  const markBookingsViewed = useCallback(() => {
    // Refresh to get accurate count after viewing
    refreshCounts();
  }, [refreshCounts]);

  const value = {
    unreadChatCount,
    pendingBookingsCount,
    isSocketConnected,
    refreshCounts,
    markChatAsRead,
    markBookingsViewed,
    // Expose setters for when user reads a chat or views bookings
    setUnreadChatCount,
    setPendingBookingsCount,
    setNavigationRef,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;

