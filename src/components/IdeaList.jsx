import React, { useState, useEffect } from 'react';
import { getIdeas } from '../api';
import IdeaCard from './IdeaCard';

const categoryMap = [
  { id: 0, label: 'Срочно' },
  { id: 1, label: 'Бюджет' },
  { id: 2, label: 'Развитие' },
  { id: 3, label: 'Дизайн/Брендинг' },
  { id: 4, label: 'Эксперимент' },
  { id: 5, label: 'Маркетинг' },
  { id: 6, label: 'Производство' },
];

const IdeaList = ({ sortBy, selectedCategories, activeTab }) => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const data = await getIdeas();

        let filtered = data;

        // ✅ Фильтрация по активному табу (StatusID)
        if (activeTab !== '3') { // "3" - это "Все идеи"
          const statusID = parseInt(activeTab, 10);
          filtered = filtered.filter(idea => idea.StatusID === statusID);
        }

        // ✅ Фильтрация по выбранным категориям
        if (selectedCategories.length > 0) {
          const selectedIds = categoryMap
              .filter(c => selectedCategories.includes(c.label))
              .map(c => c.id);
          filtered = filtered.filter(idea => selectedIds.includes(idea.CategoryID));
        }

        // ✅ Сортировка
        if (sortBy === 'likes') {
          filtered.sort((a, b) => b.LikeCount - a.LikeCount);
        } else if (sortBy === 'dislikes') {
          filtered.sort((a, b) => b.DislikeCount - a.DislikeCount);
        } else if (sortBy === 'date') {
          filtered.sort((a, b) => new Date(b.CreationDate) - new Date(a.CreationDate));
        }

        setIdeas(filtered);
      } catch (err) {
        if (err.status === 401) {
          setError('Войдите в аккаунт');
        } else {
          setError('Не удалось загрузить идеи');
        }
        console.error('Error fetching ideas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [sortBy, selectedCategories, activeTab]);

  if (loading) {
    return (
        <div className="flex flex-col px-4 min-h-[2000px]">
          <div className="flex justify-center items-center my-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
    );
  }

  if (error) return <div className="text-center my-6 text-red-500">{error}</div>;
  if (!ideas.length) return <div className="text-center my-6 text-gray-500">Идеи не найдены</div>;

  return (
      <div className="flex flex-col px-4">
        {ideas.map((idea, index) => (
            <div key={index} className={index !== ideas.length - 1 ? 'mb-0.5' : ''}>
              <IdeaCard idea={idea} />
            </div>
        ))}
      </div>
  );
};

export default IdeaList;
