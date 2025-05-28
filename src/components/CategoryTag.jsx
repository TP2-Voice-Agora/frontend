import React from 'react';

const CategoryTag = ({ category }) => {
  const getTagColor = () => {
    switch (category) {
      case 'Срочно':
        return 'bg-blue-500';
      case 'Бюджет':
        return 'bg-blue-700';
      case 'Развитие':
        return 'bg-blue-600';
      case 'Дизайн/брендинг':
        return 'bg-violet-500';
      case 'Эксперимент':
        return 'bg-indigo-500';
      case 'Перспективно':
        return 'bg-teal-500';
      case 'Маркетинг':
        return 'bg-emerald-600';
      case 'Производство':
        return 'bg-blue-300';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <span className={`tag ${getTagColor()}`}>
      {category}
    </span>
  );
};

export default CategoryTag;