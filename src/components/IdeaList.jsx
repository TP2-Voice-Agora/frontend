import React, { useState, useEffect } from 'react';
import { getIdeas } from '../api';
import IdeaCard from './IdeaCard';

const IdeaList = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const data = await getIdeas();
        setIdeas(data);
      } catch (err) {
        setError('Не удалось загрузить идеи');
        console.error('Error fetching ideas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  if (loading) {
    return (
        <div className="flex justify-center items-center my-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="text-center my-6 text-red-500">{error}</div>
    );
  }

  if (ideas.length === 0) {
    return (
        <div className="text-center my-6 text-gray-500">Идеи не найдены</div>
    );
  }

  return (
      <div className="flex flex-col px-4">
        {ideas.map((idea, index) => (
            <div key={idea.ideaUID} className={index !== ideas.length - 1 ? 'mb-0.5' : ''}>
              <IdeaCard idea={idea} />
            </div>
        ))}
      </div>
  );
};

export default IdeaList;
