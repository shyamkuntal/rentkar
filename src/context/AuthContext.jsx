import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../services/authService';
import { saveToken, removeToken, getToken } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await loginUser({ email, password });

      if (response.token) {
        await saveToken(response.token);
        setUserToken(response.token);
        setUser(response.user);
        return { success: true };
      }
      return { success: false, error: 'No token received' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await registerUser(userData);

      if (response.token) {
        await saveToken(response.token);
        setUserToken(response.token);
        setUser(response.user);
        return { success: true };
      }
      return { success: false, error: 'No token received' };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await removeToken();
      setUserToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is logged in
  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();

      if (token) {
        setUserToken(token);
        // Fetch user data
        try {
          const response = await getCurrentUser();
          setUser(response.user);
        } catch (error) {
          // Token might be invalid, clear it
          await removeToken();
          setUserToken(null);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('isLoggedIn error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{
      login,
      register,
      logout,
      isLoading,
      userToken,
      user,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
