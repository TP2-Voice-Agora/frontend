import React from 'react';

const CategoryTag = ({ category }) => {
  const getTagColor = () => {
    switch (category.toLowerCase()) {
      case 'срочно':
        return 'bg-red-500';
      case 'бюджет':
        return 'bg-green-500';
      case 'развитие':
        return 'bg-blue-500';
      case 'дизайн':
        return 'bg-purple-500';
      case 'эксперимент':
        return 'bg-yellow-500';
      case 'маркетинг':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <span className={`${getTagColor()} text-white text-sm px-3 py-1 rounded-full mr-2 mb-2`}>
      {category}
    </span>
  );
};

export default CategoryTag