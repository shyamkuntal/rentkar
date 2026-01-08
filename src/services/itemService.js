import { API_ENDPOINTS } from '../config/api';
import { get, post, put, del } from './api';

// Get all items
export const getItems = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const url = queryParams ? `${API_ENDPOINTS.ITEMS}?${queryParams}` : API_ENDPOINTS.ITEMS;
  return await get(url);
};

// Get single item
export const getItemById = async (id) => {
  return await get(API_ENDPOINTS.ITEM_BY_ID(id));
};

// Create item
export const createItem = async (itemData) => {
  return await post(API_ENDPOINTS.ITEMS, itemData);
};

// Update item
export const updateItem = async (id, itemData) => {
  return await put(API_ENDPOINTS.ITEM_BY_ID(id), itemData);
};

// Delete item
export const deleteItem = async (id) => {
  return await del(API_ENDPOINTS.ITEM_BY_ID(id));
};

// Get my listings
export const getMyListings = async () => {
  return await get(API_ENDPOINTS.MY_LISTINGS);
};

// Get items by owner ID
export const getItemsByOwner = async (ownerId) => {
  const url = `${API_ENDPOINTS.ITEMS}?ownerId=${ownerId}`;
  return await get(url);
};
