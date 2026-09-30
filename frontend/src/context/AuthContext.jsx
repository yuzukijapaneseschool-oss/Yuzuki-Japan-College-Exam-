import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('yuzuki_user') || localStorage.getItem('yuzuki_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem('yuzuki_token') || localStorage.getItem('yuzuki_token');
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data.user);
          sessionStorage.setItem('yuzuki_user', JSON.stringify(res.data.user));
          try {
            localStorage.setItem('yuzuki_user', JSON.stringify(res.data.user));
          } catch (e) {}
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    }
    verifyAuth();
  }, [token]);

  const setAuthData = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    sessionStorage.setItem('yuzuki_token', newToken);
    sessionStorage.setItem('yuzuki_user', JSON.stringify(userData));
    try {
      localStorage.setItem('yuzuki_token', newToken);
      localStorage.setItem('yuzuki_user', JSON.stringify(userData));
    } catch (e) {}
  };

  const login = async (identifier, password) => {
    const res = await authAPI.login(identifier, password);
    const { token: newToken, user: userData } = res.data;
    setAuthData(newToken, userData);
    return userData;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('yuzuki_token');
    sessionStorage.removeItem('yuzuki_user');
    try {
      localStorage.removeItem('yuzuki_token');
      localStorage.removeItem('yuzuki_user');
    } catch (e) {}
  };

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data.user);
      sessionStorage.setItem('yuzuki_user', JSON.stringify(res.data.user));
      try {
        localStorage.setItem('yuzuki_user', JSON.stringify(res.data.user));
      } catch (e) {}
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser, setAuthData }}>
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