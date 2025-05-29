// components/LoginForm.jsx
import React, { useState } from 'react';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';

const LoginForm = ({ onClose }) => {
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = await login(email, password);
      // Обновляем контекст
      authLogin(token);
      onClose();
    } catch (err) {
      setError('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[400px] relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          {/* иконка закрытия */}
          ✖
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-center">Войти в аккаунт</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-full"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-full"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;