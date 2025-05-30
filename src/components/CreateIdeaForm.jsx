import React, { useState } from 'react';
import { createIdea } from '../api';

const categories = [
  { id: 0, label: 'Срочно' },
  { id: 1, label: 'Бюджет' },
  { id: 2, label: 'Развитие' },
  { id: 3, label: 'Дизайн/Брендинг' },
  { id: 4, label: 'Эксперимент' },
  { id: 5, label: 'Маркетинг' },
  { id: 6, label: 'Производство' },
];

const CreateIdeaForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    text: '',
    author: '',
    category: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectOpen, setSelectOpen] = useState(false);

  const handleFocus = () => setSelectOpen(true);
  const handleBlur = () => setSelectOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.name.trim() === '' || formData.text.trim() === '') {
      setError('Пожалуйста, заполните название и текст идеи.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await createIdea(formData);
      onClose();
    } catch (err) {
      setError('Ошибка при создании идеи. Попробуйте снова позже.');
      console.error('Ошибка создания идеи:', err);
    } finally {
      setLoading(false);
    }
  };

  const arrowDown = `url("data:image/svg+xml,%3Csvg fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;
  const arrowUp = `url("data:image/svg+xml,%3Csvg fill='none' stroke='%232563EB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='18 15 12 9 6 15'%3E%3C/polyline%3E%3C/svg%3E")`;

  return (
    <>
      <style>{`
        .custom-select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 1rem;
          padding-right: 2.5rem;
          border-radius: 0.5rem;
          border: 1px solid #D1D5DB;
          outline: none;
          transition: background-image 0.2s ease;
          user-select: none;
        }
        .custom-select:focus {
          border-color: #D1D5DB;
          outline: none;
          box-shadow: none;
        }
      `}</style>

      <div
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <div
          className="bg-[#F2F2F7] rounded-lg shadow-lg w-full max-w-[775px] max-h-[90vh] p-6 flex flex-col"
          style={{ minWidth: '320px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Создать идею</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col flex-grow overflow-auto">
            <input
              type="text"
              placeholder="Название (5-6 слов)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
            />

            <textarea
              placeholder="Полный текст идеи"
              className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:outline-none focus:ring-0 focus:border-gray-300"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              required
              disabled={loading}
            />

            <select
              className="custom-select w-full p-3"
              value={formData.category !== null ? formData.category : ''}
              onChange={(e) => setFormData({ ...formData, category: Number(e.target.value) })}
              disabled={loading}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={{
                backgroundImage: selectOpen ? arrowUp : arrowDown,
              }}
            >
              <option value="">Выберите категорию</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>

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
    </>
  );
};

export default CreateIdeaForm;
