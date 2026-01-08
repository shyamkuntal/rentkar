import { API_ENDPOINTS } from '../config/api';
import { get, post } from './api';

// Get all chats
export const getChats = async () => {
  return await get(API_ENDPOINTS.CHATS);
};

// Create chat
export const createChat = async (itemId, participantId) => {
  return await post(API_ENDPOINTS.CHATS, { itemId, participantId });
};

// Get messages for a chat
export const getMessages = async (chatId) => {
  return await get(API_ENDPOINTS.CHAT_MESSAGES(chatId));
};

// Send message (HTTP fallback, Socket.IO will be primary)
export const sendMessage = async (chatId, content) => {
  return await post(API_ENDPOINTS.SEND_MESSAGE, { chatId, content });
};
