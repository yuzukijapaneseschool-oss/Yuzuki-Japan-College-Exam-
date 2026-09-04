import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('yuzuki_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('yuzuki_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data.user);
          localStorage.setItem('yuzuki_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    }
    verifyAuth();
  }, [token]);

  const login = async (identifier, password) => {
    const res = await authAPI.login(identifier, password);
    const { token: newToken, user: userData } = res.data;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('yuzuki_token', newToken);
    localStorage.setItem('yuzuki_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('yuzuki_token');
    localStorage.removeItem('yuzuki_user');
  };

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data.user);
      localStorage.setItem('yuzuki_user', JSON.stringify(res.data.user));
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};