import React, { useState, useEffect } from 'react';
import { createIdea, getCategories, getStatuses } from '../api';
import { useNavigate } from 'react-router-dom';

const CreateIdeaForm = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    text: '',
    author: '',
    category: 0,
    status: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка категорий и статусов при монтировании
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, sts] = await Promise.all([getCategories(), getStatuses()]);
        setCategories(cats);
        setStatuses(sts);
      } catch (err) {
        setError('Не удалось загрузить категории или статусы');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newIdea = await createIdea(formData);
      navigate(`/idea/${newIdea.ideaUID}`);
    } catch (err) {
      setError('Не удалось создать идею.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Создать новую идею</h2>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Название"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="text"
          placeholder="Описание"
          value={formData.text}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={4}
          required
        />
        <input
          name="author"
          placeholder="Автор"
          value={formData.author}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {/* Категории и статусы загружаются динамически */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>{status.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Создается...' : 'Создать'}
        </button>
      </form>
    </div>
  );
};

export default CreateIdeaForm;