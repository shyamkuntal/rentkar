import { API_ENDPOINTS } from '../config/api';
import { get, post, del } from './api';

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

// Send message
export const sendMessage = async (chatId, content) => {
  return await post(API_ENDPOINTS.SEND_MESSAGE, { chatId, content });
};

// Delete chat
export const deleteChat = async (chatId) => {
  return await del(API_ENDPOINTS.CHAT_BY_ID(chatId));
};

// Get unread count
export const getUnreadCount = async () => {
    return await get(API_ENDPOINTS.UNREAD_COUNT);
};
