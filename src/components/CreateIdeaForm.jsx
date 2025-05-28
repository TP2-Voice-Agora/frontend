import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateIdeaForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    categories: []
  });

  const categories = ['Срочно', 'Бюджет', 'Креатив', 'Долгосрочное', 'Эксперимент', 'Перспективное'];

  const toggleCategory = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Создать идею</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">
            Основной смысл
            <span className="text-xs text-gray-400 ml-1">(5-6 слов)</span>
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={formData.summary}
            onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">
            Полный текст идеи...
          </label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md h-32"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                type="button"
                className={`px-4 py-2 rounded-full text-sm ${
                  formData.categories.includes(category)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700"
            onClick={() => navigate('/')}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Добавить
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateIdeaForm;