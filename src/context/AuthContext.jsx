import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      setUser({ role: 'admin' });
      // You could also fetch user data here
    }
    setLoading(false);
  }, []);

  const login = (token) => {
  localStorage.setItem('authToken', token);
  // Обновите состояние
  setIsAuthenticated(true);
  // Можно дополнительно получать и сохранять данные пользователя
};

const logout = () => {
  localStorage.removeItem('authToken');
  setIsAuthenticated(false);
  setUser(null);
};

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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