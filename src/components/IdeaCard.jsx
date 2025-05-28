import React from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { voteForIdea } from '../api';
import CategoryTag from './CategoryTag';

const IdeaCard = ({ idea }) => {
  const navigate = useNavigate();
  const [isVoting, setIsVoting] = React.useState(false);

  const handleVote = async (e, voteType) => {
    e.stopPropagation();
    if (isVoting) return;
    
    setIsVoting(true);
    try {
      await voteForIdea(idea.id, voteType);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div 
      className="bg-white rounded-lg p-6 mb-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={() => navigate(`/idea/${idea.id}`)}
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">IDEA {idea.id}</h2>
        <span className="text-sm text-gray-500">{formatDate(idea.createdAt)}</span>
      </div>
      
      <p className="text-gray-700 mb-4">{idea.summary}</p>
      
      <div className="flex flex-wrap mb-4">
        {idea.categories?.map(category => (
          <CategoryTag key={category} category={category} />
        ))}
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 ${isVoting ? 'opacity-50' : ''}`}
          onClick={(e) => handleVote(e, 'up')}
          disabled={isVoting}
        >
          <FaThumbsUp className="text-green-500" />
          <span className="text-gray-700">{idea.upVotes || 0}</span>
        </button>
        <button 
          className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 ${isVoting ? 'opacity-50' : ''}`}
          onClick={(e) => handleVote(e, 'down')}
          disabled={isVoting}
        >
          <FaThumbsDown className="text-red-500" />
          <span className="text-gray-700">{idea.downVotes || 0}</span>
        </button>
      </div>
    </div>
  );
};

export default IdeaCard