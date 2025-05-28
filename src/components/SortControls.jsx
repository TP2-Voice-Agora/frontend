import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const SortControls = ({ sortBy, setSortBy, selectedCategories, setSelectedCategories }) => {
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  
  const categories = ['Срочно', 'Бюджет', 'Развитие', 'Дизайн/брендинг', 'Эксперимент', 'Маркетинг', 'Производство'];

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="text-gray-600">Сортировать по:</div>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <button 
            className="sort-button"
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
          >
            <span className="mr-2 text-blue-500">
              <FaChevronDown className="inline-block mr-1" />
              Дата создания
            </span>
          </button>
          {isDateDropdownOpen && (
            <div className="absolute top-10 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-40">
              <div 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSortBy('date');
                  setIsDateDropdownOpen(false);
                }}
              >
                По дате создания
              </div>
              <div 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSortBy('popularity');
                  setIsDateDropdownOpen(false);
                }}
              >
                По популярности
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button 
            className="sort-button"
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
          >
            <span className="mr-2 text-blue-500">
              <FaChevronDown className="inline-block mr-1" />
              Категории
            </span>
          </button>
          {isCategoryDropdownOpen && (
            <div className="absolute top-10 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-48">
              {categories.map(category => (
                <div 
                  key={category}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => toggleCategory(category)}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(category)} 
                    onChange={() => {}} 
                    className="mr-2"
                  />
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortControls;