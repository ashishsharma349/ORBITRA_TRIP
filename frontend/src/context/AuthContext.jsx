import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';
import { setAccessToken, getAccessToken, clearAccessToken } from '../utils/tokenStorage';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAccessToken();

      if (token) {
        try {
          const data = await authApi.getMe();
          setUser(data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to restore session via access token:', error);
        }
      } else {
        try {
          const response = await axiosInstance.post('/api/auth/refresh');
          const { accessToken } = response.data;
          setAccessToken(accessToken);
          
          const profile = await authApi.getMe();
          setUser(profile.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.log('No active session found.');
        }
      }
      setLoading(false);
    };

    initializeAuth();

    const handleAuthLogout = () => {
      clearAccessToken();
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    };

    window.addEventListener('auth-logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, []);

  const signup = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.signup(email, password);
      setAccessToken(data.accessToken);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      clearAccessToken();
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      setAccessToken(data.accessToken);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      clearAccessToken();
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      clearAccessToken();
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
