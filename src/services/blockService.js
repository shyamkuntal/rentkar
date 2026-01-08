import { API_ENDPOINTS } from '../config/api';
import { post, del } from './api';

// Block user
export const blockUser = async (userId) => {
  return await post(API_ENDPOINTS.BLOCK_USER(userId), {});
};

// Unblock user
export const unblockUser = async (userId) => {
  return await del(API_ENDPOINTS.BLOCK_USER(userId));
};

// Report user/item
// targetType: 'user' or 'item'
export const reportEntity = async (reportedId, targetType, reason, description) => {
  return await post(API_ENDPOINTS.REPORTS, { reportedId, targetType, reason, description });
};
