import { API_ENDPOINTS } from '../config/api';
import { get, post, del } from './api';

// Get all favorites
export const getFavorites = async () => {
  return await get(API_ENDPOINTS.FAVORITES);
};

// Add to favorites
export const addFavorite = async (itemId) => {
  return await post(API_ENDPOINTS.FAVORITE_BY_ID(itemId));
};

// Remove from favorites
export const removeFavorite = async (itemId) => {
  return await del(API_ENDPOINTS.FAVORITE_BY_ID(itemId));
};

// Check if item is favorited
export const checkFavorite = async (itemId) => {
  return await get(API_ENDPOINTS.FAVORITE_CHECK(itemId));
};
