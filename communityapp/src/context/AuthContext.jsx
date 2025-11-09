import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('collegeAppToken'));
  const [isLoading, setIsLoading] = useState(true);

  const setAuthToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('collegeAppToken', newToken);
    } else {
      localStorage.removeItem('collegeAppToken');
    }
    setToken(newToken);
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
  };

  const loadUser = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await getMe();
      setUser(response.data.user); // Assuming API returns { user: {...} }
    } catch (error) {
      console.error('Failed to fetch user', error);
      logout(); // Token is invalid or expired
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setAuthToken, logout, isLoading }}>
      {isLoading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };