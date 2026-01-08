import { API_ENDPOINTS } from '../config/api';
import { get, put } from './api';

// Get user by ID
export const getUserById = async (id) => {
  return await get(API_ENDPOINTS.USER_BY_ID(id));
};

// Update profile
export const updateProfile = async (profileData) => {
  return await put(API_ENDPOINTS.UPDATE_PROFILE, profileData);
};
