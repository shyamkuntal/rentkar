import { Platform } from 'react-native';

// Automatically use correct URL based on platform
const getApiBaseUrl = () => {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'android') {
      // Android emulator: use 10.0.2.2 to access host machine's localhost
      return 'http://10.0.2.2:8080/api';
    } else {
      // iOS simulator: localhost works fine
      return 'http://localhost:8080/api';
    }
  } else {
    // Production mode: use your production API URL
    return 'https://your-production-api.com/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  // Auth
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  GET_ME: `${API_BASE_URL}/auth/me`,

  // Items
  ITEMS: `${API_BASE_URL}/items`,
  ITEM_BY_ID: (id) => `${API_BASE_URL}/items/${id}`,
  MY_LISTINGS: `${API_BASE_URL}/items/my/listings`,

  // Bookings
  BOOKINGS: `${API_BASE_URL}/bookings`,
  BOOKING_BY_ID: (id) => `${API_BASE_URL}/bookings/${id}`,

  // Chats
  CHATS: `${API_BASE_URL}/chats`,
  CHAT_MESSAGES: (id) => `${API_BASE_URL}/chats/${id}/messages`,
  SEND_MESSAGE: `${API_BASE_URL}/chats/messages`,

  // Favorites
  FAVORITES: `${API_BASE_URL}/favorites`,
  FAVORITE_BY_ID: (id) => `${API_BASE_URL}/favorites/${id}`,
  FAVORITE_CHECK: (id) => `${API_BASE_URL}/favorites/${id}/check`,

  // Users
  USER_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
};

export default API_BASE_URL;
