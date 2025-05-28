import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createIdea, getCategories, getStatuses } from '../api';

const CreateIdeaForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    text: '',
    author: '',
    category: 0,
    status: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, statusesData] = await Promise.all([
          getCategories(),
          getStatuses()
        ]);
        setCategories(categoriesData);
        setStatuses(statusesData);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError('Failed to load form data');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createIdea(formData);
      navigate('/');
    } catch (error) {
      setError('Failed to create idea. Please try again.');
      console.error('Error creating idea:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Создать идею</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Название
            <span className="text-xs text-gray-400 ml-1">(5-6 слов)</span>
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Полный текст идеи
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.text}
            onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
            required
            disabled={loading}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Отмена
          </button>
          <button
            type="submit"
            className={`px-6 py-2 bg-blue-500 text-white rounded-lg transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Создание...' : 'Добавить'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateIdeaForm