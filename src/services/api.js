import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'userToken';

// Get stored token
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Save token
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

// Remove token
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Make authenticated API request
export const apiRequest = async (url, options = {}) => {
  try {
    const token = await getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// GET request
export const get = (url) => apiRequest(url, { method: 'GET' });

// POST request
export const post = (url, body) => 
  apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });

// PUT request
export const put = (url, body) =>
  apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

// PATCH request
export const patch = (url, body) =>
  apiRequest(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

// DELETE request
export const del = (url) =>
  apiRequest(url, { method: 'DELETE' });
