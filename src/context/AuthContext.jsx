import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserByUID, login } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (uid) => {
    try {
      const userData = await getUserByUID(uid);
      setUser(userData);
    } catch (err) {
      console.error('Ошибка получения данных пользователя:', err);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      const uid = localStorage.getItem('userUID');
      if (token && uid) {
        setIsAuthenticated(true);
        await fetchUser(uid);
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const {token, uid} = await login(email, password);
      localStorage.setItem('authToken', token);
      localStorage.setItem('userUID', uid);
      console.log("Logged in:", uid);
      setIsAuthenticated(true);
      await fetchUser(uid);
    } catch (err) {
      console.error('Ошибка при логине:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login: handleLogin, logout }}>
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