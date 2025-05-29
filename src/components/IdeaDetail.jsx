import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getIdeaByUID } from '../api'; // импортируем новую функцию
import CommentsSection from './CommentsSection'; // если есть компонент комментариев

const IdeaDetail = () => {
  const { id } = useParams(); // id — UID идеи
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const data = await getIdeaByUID(id);
        setIdea(data.idea);
        // Можно обработать commentReplies, если нужно
      } catch (err) {
        setError('Не удалось загрузить идею');
      } finally {
        setLoading(false);
      }
    };
    fetchIdea();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!idea) return <div className="text-center py-8">Идея не найдена</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-4">
      {/* Основная информация о идее */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold mb-4">{idea.name}</h1>
        <p className="mb-4">{idea.text}</p>
        {/* Доп. информация */}
      </div>
      
      {/* Комментарии и ответы */}
      <CommentsSection ideaUID={idea.ideaUID} />

      {/* Можно добавить другие компоненты или информацию */}
    </div>
  );
};

export default IdeaDetail;