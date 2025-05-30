import React from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { likeIdea, dislikeIdea } from '../api';

// Сопоставление ID и названий категорий
const categoryMap = {
  0: 'Срочно',
  1: 'Бюджет',
  2: 'Развитие',
  3: 'Дизайн/Брендинг',
  4: 'Эксперимент',
  5: 'Маркетинг',
  6: 'Производство'
};

const statusColorMap = {
  0: 'bg-white',
  1: 'bg-[#70C170]',
  2: 'bg-[#FF6B6B]'
};

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

  const categoryName = categoryMap[idea.CategoryID] || 'Неизвестно';
  const cardBackgroundClass = statusColorMap[idea.StatusID] || 'bg-white';

  // Цвет названия и даты в зависимости от статуса
  const textColor = idea.StatusID !== 0 ? 'text-white' : 'text-black';
  const dateColor = idea.StatusID !== 0 ? 'text-white' : 'text-gray-500';

  return (
      <div
          className={`${cardBackgroundClass} rounded-lg p-6 mb-4 shadow-lg hover:shadow-xl transition-all cursor-pointer relative`}
          onClick={() => navigate(`/idea/${idea.IdeaUID}`)}
      >
        <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>{idea.Name}</h2>

        <div className="pt-2">
          <div className="flex flex-wrap gap-2">
            {idea.categories?.map((category) => (
                <span
                    key={category}
                    className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium"
                >
              {category}
            </span>
            ))}
            {categoryName && (
                <span
                    key={idea.CategoryID}
                    className="bg-blue-700 text-blue-100 text-xs px-3 py-1 rounded-full font-medium"
                >
              {categoryName}
            </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-4">
          <button
              className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 ${isVoting ? 'opacity-50' : ''}`}
              onClick={(e) => handleVote(e, 'up')}
              disabled={isVoting}
          >
            <FaThumbsUp className="text-[#00FF00]" />
            <span className="text-gray-700">{likeCount}</span>
          </button>
          <button
              className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 ${isVoting ? 'opacity-50' : ''}`}
              onClick={(e) => handleVote(e, 'down')}
              disabled={isVoting}
          >
            <FaThumbsDown className="text-[#FF0000]" />
            <span className="text-gray-700">{dislikeCount}</span>
          </button>
        </div>

        <div className={`absolute bottom-4 right-4 text-sm ${dateColor}`}>
          {formatDate(idea.CreationDate)}
        </div>
      </div>
  );
};

export default IdeaCard;
