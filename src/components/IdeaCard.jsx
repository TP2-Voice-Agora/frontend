import React from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { likeIdea, dislikeIdea } from '../api';
import CategoryTag from './CategoryTag';

const IdeaCard = ({ idea }) => {
  const navigate = useNavigate();
  const [isVoting, setIsVoting] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(idea.LikeCount || 0);
  const [dislikeCount, setDislikeCount] = React.useState(idea.DislikeCount || 0);

  const handleVote = async (e, voteType) => {
    e.stopPropagation();
    if (isVoting) return;

    setIsVoting(true);
    try {
      if (voteType === 'up') {
        setLikeCount((prev) => prev + 1);
        await likeIdea(idea.IdeaUID);
      } else {
        setDislikeCount((prev) => prev + 1);
        await dislikeIdea(idea.IdeaUID);
      }
    } catch (error) {
      console.error('Error voting:', error);
      if (voteType === 'up') {
        setLikeCount((prev) => prev - 1);
      } else {
        setDislikeCount((prev) => prev - 1);
      }
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
      <div
          className="bg-white rounded-lg p-6 mb-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
          onClick={() => navigate(`/idea/${idea.IdeaUID}`)}
      >
        <h2 className="text-xl font-bold mb-4">{idea.Name}</h2>

        <div className="flex flex-wrap mb-12">
          {idea.categories?.map(category => (
              <CategoryTag key={category} category={category}/>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <button
              className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 ${isVoting ? 'opacity-50' : ''}`}
              onClick={(e) => handleVote(e, 'up')}
              disabled={isVoting}
          >
            <FaThumbsUp className="text-green-500"/>
            <span className="text-gray-700">{likeCount}</span>
          </button>
          <button
              className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 ${isVoting ? 'opacity-50' : ''}`}
              onClick={(e) => handleVote(e, 'down')}
              disabled={isVoting}
          >
            <FaThumbsDown className="text-red-500"/>
            <span className="text-gray-700">{dislikeCount}</span>
          </button>
        </div>

        <div className="absolute bottom-4 right-4 text-sm text-gray-500">
          {formatDate(idea.CreationDate)}
        </div>
      </div>
  );
};

export default IdeaCard;
