import { Platform } from 'react-native';
import { getToken } from './api';

// Automatically use correct WebSocket URL based on platform
const getWsUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'ws://10.0.2.2:8080/ws';
    } else {
      return 'ws://localhost:8080/ws';
    }
  } else {
    return 'wss://rentkar-w7j0.onrender.com/ws'; // Use wss:// for production
  }
};

const WS_URL = getWsUrl();

class SocketService {
  ws = null;
  messageCallbacks = [];
  typingCallbacks = [];
  notificationCallbacks = []; // For global notifications (badge updates)
  bookingNotificationCallbacks = []; // For booking-specific notifications
  reconnectAttempts = 0;
  maxReconnectAttempts = 5;
  isConnecting = false;

  connect = async () => {
    // Prevent duplicate connections
    if (this.isConnecting) {
      console.log('WebSocket connection already in progress');
      return Promise.resolve(this.ws);
    }

    const token = await getToken();

    if (!token) {
      console.error('No token available for WebSocket connection');
      return Promise.reject('No token');
    }

    // If already connected, return immediately
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return Promise.resolve(this.ws);
    }

    this.isConnecting = true;

    // Add token as query parameter for authentication
    const wsUrl = `${WS_URL}?token=${token}`;

    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        resolve(this.ws);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
        reject(error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.attemptReconnect();
      };
    });
  };

  isConnected = () => {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  };

  attemptReconnect = async () => {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
    }
  };

  disconnect = () => {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageCallbacks = [];
    this.typingCallbacks = [];
    this.notificationCallbacks = [];
    this.bookingNotificationCallbacks = [];
  };

  send = (data) => {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
    }
  };

  handleMessage = (data) => {
    switch (data.type) {
      case 'new_message':
        // Message in an active chat room
        this.messageCallbacks.forEach(callback => callback(data.message));
        break;
      case 'user_typing':
        this.typingCallbacks.forEach(callback => callback(data));
        break;
      case 'new_chat_notification':
        // New chat notification (for badge updates)
        console.log('Received chat notification:', data);
        this.notificationCallbacks.forEach(callback => callback(data));
        break;
      case 'booking_notification':
        // Booking notification (new request, status change)
        console.log('Received booking notification:', data);
        this.bookingNotificationCallbacks.forEach(callback => callback(data));
        this.notificationCallbacks.forEach(callback => callback(data)); // Also trigger general notification
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  // Join a chat room
  joinChat = (chatId) => {
    this.send({ type: 'join_chat', chatId });
  };

  // Leave a chat room
  leaveChat = (chatId) => {
    this.send({ type: 'leave_chat', chatId });
  };

  // Send message
  sendMessage = (chatId, content) => {
    this.send({
      type: 'send_message',
      chatId,
      content
    });
  };

  // Listen for new messages (in active chat room)
  onMessage = (callback) => {
    this.messageCallbacks.push(callback);
  };

  // Remove message listener
  offMessage = (callback) => {
    this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
  };

  // Listen for typing indicator
  onTyping = (callback) => {
    this.typingCallbacks.push(callback);
  };

  // Send typing indicator
  sendTyping = (chatId, isTyping) => {
    this.send({
      type: 'typing',
      chatId,
      isTyping
    });
  };

  // Listen for global notifications (chat and booking)
  onNotification = (callback) => {
    this.notificationCallbacks.push(callback);
    return () => {
      this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
    };
  };

  // Listen for booking-specific notifications
  onBookingNotification = (callback) => {
    this.bookingNotificationCallbacks.push(callback);
    return () => {
      this.bookingNotificationCallbacks = this.bookingNotificationCallbacks.filter(cb => cb !== callback);
    };
  };

  // Remove notification listener
  offNotification = (callback) => {
    this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
  };

  // Get WebSocket instance
  getSocket = () => this.ws;
}

export default new SocketService();

