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
