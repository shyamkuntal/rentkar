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
    return 'wss://your-production-api.com/ws'; // Use wss:// for production
  }
};

const WS_URL = getWsUrl();

class SocketService {
  ws = null;
  messageCallbacks = [];
  typingCallbacks = [];
  reconnectAttempts = 0;
  maxReconnectAttempts = 5;

  connect = async () => {
    const token = await getToken();

    if (!token) {
      console.error('No token available for WebSocket connection');
      return;
    }

    // Add token as query parameter for authentication
    const wsUrl = `${WS_URL}?token=${token}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
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
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect();
    };

    return this.ws;
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
        this.messageCallbacks.forEach(callback => callback(data.message));
        break;
      case 'user_typing':
        this.typingCallbacks.forEach(callback => callback(data));
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

  // Listen for new messages
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

  // Get WebSocket instance
  getSocket = () => this.ws;
}

export default new SocketService();
