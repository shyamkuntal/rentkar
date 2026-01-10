import { API_ENDPOINTS } from '../config/api';
import { post, get } from './api';

// Register user
export const registerUser = async (userData) => {
  const response = await post(API_ENDPOINTS.REGISTER, userData);
  return response;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await post(API_ENDPOINTS.LOGIN, credentials);
  return response;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await get(API_ENDPOINTS.GET_ME);
  return response;
};

// Login with Google (sends Google user info to backend)
export const loginWithGoogleBackend = async (googleResult) => {
  const response = await post(API_ENDPOINTS.GOOGLE_LOGIN, {
    email: googleResult.user.email,
    name: googleResult.user.name,
    avatar: googleResult.user.avatar,
    googleId: googleResult.user.id,
  });
  return response;
};
