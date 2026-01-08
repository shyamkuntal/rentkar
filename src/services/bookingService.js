import { API_ENDPOINTS } from '../config/api';
import { get, post, patch } from './api';

// Get all bookings
export const getMyBookings = async () => {
  return await get(API_ENDPOINTS.BOOKINGS);
};

// Get booking by ID
export const getBookingById = async (id) => {
  return await get(API_ENDPOINTS.BOOKING_BY_ID(id));
};

// Create booking
export const createBooking = async (bookingData) => {
  return await post(API_ENDPOINTS.BOOKINGS, bookingData);
};

// Update booking status
export const updateBookingStatus = async (id, status) => {
  return await patch(API_ENDPOINTS.BOOKING_BY_ID(id), { status });
};

// Get owner bookings (requests)
export const getOwnerBookings = async () => {
  return await get(API_ENDPOINTS.OWNER_BOOKINGS);
};

// Get count of pending booking requests for the owner
export const getPendingRequestsCount = async () => {
  return await get(API_ENDPOINTS.PENDING_REQUESTS_COUNT);
};
