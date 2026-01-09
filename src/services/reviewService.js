import { API_ENDPOINTS } from '../config/api';
import { get, post } from './api';

// Create a review
export const createReview = async (bookingId, targetType, targetId, rating, comment) => {
  return await post(API_ENDPOINTS.REVIEWS, {
    bookingId,
    targetType,
    targetId,
    rating,
    comment,
  });
};

// Get reviews for an item
export const getItemReviews = async (itemId) => {
  return await get(API_ENDPOINTS.ITEM_REVIEWS(itemId));
};

// Get reviews for a user
export const getUserReviews = async (userId) => {
  return await get(API_ENDPOINTS.USER_REVIEWS(userId));
};

// Get reviews for a booking (to check if user already reviewed)
export const getBookingReviews = async (bookingId) => {
  return await get(API_ENDPOINTS.BOOKING_REVIEWS(bookingId));
};
