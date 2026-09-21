import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('campusconnect_token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch current user details on load
  const loadUser = async () => {
    const savedToken = localStorage.getItem('campusconnect_token');
    if (!savedToken) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get('/auth/me');
      if (data.success && data.user) {
        setUser(data.user);
        setProfile(data.user.profile || null);
      }
    } catch (err) {
      console.error('Failed to authenticate stored token:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('campusconnect_token', data.token);
        setToken(data.token);
        setUser(data.user);
        setProfile(data.user.profile || null);
        return { success: true, user: data.user };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const googleLogin = async (googlePayload) => {
    try {
      const { data } = await api.post('/auth/google', googlePayload);
      if (data.success) {
        localStorage.setItem('campusconnect_token', data.token);
        setToken(data.token);
        setUser(data.user);
        setProfile(data.user.profile || null);
        return { success: true, user: data.user };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      if (data.success) {
        localStorage.setItem('campusconnect_token', data.token);
        setToken(data.token);
        setUser(data.user);
        await loadUser();
        return { success: true, user: data.user };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('campusconnect_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user && user.role === 'student') {
      try {
        const { data } = await api.get('/students/me');
        if (data.success && data.profile) {
          setProfile(data.profile);
        }
      } catch (e) {
        console.error('Profile refresh failed', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        isAuthenticated: Boolean(user),
        login,
        googleLogin,
        register,
        logout,
        refreshProfile,
        loadUser,
      }}
    >
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
