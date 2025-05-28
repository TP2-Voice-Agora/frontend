import React, { useState, useEffect } from 'react';
import IdeaCard from './IdeaCard';
import { getIdeas } from '../api';

const IdeaList = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const data = await getIdeas();
        if (data == null){

        }
        setIdeas(data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch ideas. Please try again later.');
        console.error('Error fetching ideas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  if (loading) {
    return (
      <div className="my-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!ideas.length) {
    return (
      <div className="my-6 text-center text-gray-500">
        No ideas found.
      </div>
    );
  }

  return (
    <div className="my-6">
      {ideas.map(idea => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </div>
  );
};

export default IdeaList;