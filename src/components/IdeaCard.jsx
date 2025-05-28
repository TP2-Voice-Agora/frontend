import React from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import CategoryTag from './CategoryTag';

const IdeaCard = ({ idea, handleVote }) => {
  const getCardStyle = () => {
    if (idea.id === 2) return 'bg-green-200';
    if (idea.id === 3) return 'bg-red-300';
    return 'bg-gray-50';
  };

  // Format date to DD.MM.YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  };

  return (
    <div className={`idea-card ${getCardStyle()}`}>
      <h2 className="text-xl font-bold mb-2">IDEA {idea.id}</h2>
      
      <div className="flex flex-wrap mb-4">
        {idea.categories.map(category => (
          <CategoryTag key={category} category={category} />
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="vote-button text-green-500"
            onClick={() => handleVote(idea.id, 'up')}
          >
            <FaThumbsUp className="mr-1" /> {idea.upVotes}
          </button>
          <button 
            className="vote-button text-red-500"
            onClick={() => handleVote(idea.id, 'down')}
          >
            <FaThumbsDown className="mr-1" /> {idea.downVotes}
          </button>
        </div>
        <div className="text-gray-500 text-sm">{formatDate(idea.date)}</div>
      </div>
    </div>
  );
};

export default IdeaCard;