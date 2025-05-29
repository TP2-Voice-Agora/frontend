import React, { useState } from 'react';
import { register } from '../api';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: '',
    password: '',
    positionID: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await register(formData);
      setMessage('Регистрация прошла успешно');
    } catch (err) {
      setError('Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Регистрация</h2>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      {message && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="name"
          placeholder="Имя"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="surname"
          placeholder="Фамилия"
          value={formData.surname}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="positionID"
          value={formData.positionID}
          onChange={(e) => setFormData(prev => ({ ...prev, positionID: parseInt(e.target.value) }))}
          className="w-full p-2 border rounded"
        >
          <option value={0}>Должность 0</option>
          <option value={1}>Должность 1</option>
          {/* хуй знает че по должности*/}
        </select>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Регистрация...' : 'Зарегистрировать'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;