import React, { useState, useEffect } from 'react';
import { createIdea, getCategories, getStatuses } from '../api';

const CreateIdeaForm = ({ onClose }) => {
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
      onClose();
    } catch (error) {
      setError('Failed to create idea. Please try again.');
      console.error('Error creating idea:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50"
      onClick={onClose} 
    >
      <div
        className="bg-[#F2F2F7] rounded-lg shadow-lg w-full max-w-[775px] max-h-[90vh] p-6 flex flex-col"
        style={{ minWidth: '320px' }}
        onClick={e => e.stopPropagation()} 
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Создать идею</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col flex-grow overflow-auto">
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
              className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              value={formData.text}
              onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              required
              disabled={loading}
            />
          </div>

          <div className="flex justify-center space-x-3 mt-auto">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white rounded-2xl px-6 py-3 hover:bg-blue-600 transition-colors"
              style={{ minWidth: '120px' }}
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-[#C0C0C0] text-white rounded-2xl px-6 py-3 hover:bg-gray-400 transition-colors"
              style={{ minWidth: '120px' }}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIdeaForm;
