import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getIdeaByUID } from '../api';

const IdeaDetail = () => {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const data = await getIdeaByUID(id);
        setIdea(data.idea);
      } catch (err) {
        setError('Не удалось загрузить идею');
      } finally {
        setLoading(false);
      }
    };
    fetchIdea();
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!idea) return <div>Идея не найдена</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">{idea.name}</h1>
      <p>{idea.text}</p>
      {/* Добавьте сюда остальные компоненты или информацию */}
    </div>
  );
};

export default IdeaDetail;