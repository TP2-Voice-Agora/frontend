import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const SortControls = ({ sortBy, setSortBy, selectedCategories, setSelectedCategories }) => {
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const dateDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  const categories = ['Срочно', 'Бюджет', 'Развитие', 'Дизайн/брендинг', 'Эксперимент', 'Маркетинг', 'Производство'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setIsDateDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="flex items-center justify-between px-[100px]">
      <span
        className="text-[16px]"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          color: '#0A84FF',
          marginRight: '30px',
        }}
      >
        Сортировать по:
      </span>

      <div className="flex space-x-[100px]">
        <div className="relative" ref={dateDropdownRef}>
          <button
            className="w-[200px] h-[40px] flex items-center justify-center bg-white border border-gray-200 rounded-md hover:bg-gray-50"
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
          >
            <div className="flex items-center space-x-[5px]">
              <img
                src="/icons/iconamoon-arrow-up-1-thin.svg"
                alt="arrow-up"
                className="w-[18px] h-[18px]"
              />
              <span
                className="text-[15px]"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  color: '#0A84FF',
                }}
              >
                Дата создания
              </span>
              <FaChevronDown className="text-blue-500 w-[18px] h-[18px]" />
            </div>
          </button>
          {isDateDropdownOpen && (
            <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-40">
              <div
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSortBy('date');
                  setIsDateDropdownOpen(false);
                }}
              >
                По дате создания
              </div>
              <div
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
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

        <div className="relative" ref={categoryDropdownRef}>
          <button
            className="w-[200px] h-[40px] flex items-center justify-center bg-white border border-gray-200 rounded-md hover:bg-gray-50"
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
          >
            <div className="flex items-center space-x-[5px]">
              <img
                src="/icons/iconamoon-arrow-up-1-thin.svg"
                alt="arrow-up"
                className="w-[18px] h-[18px]"
              />
              <span
                className="text-[15px]"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  color: '#0A84FF',
                }}
              >
                Категории
              </span>
              <FaChevronDown className="text-blue-500 w-[18px] h-[18px]" />
            </div>
          </button>
          {isCategoryDropdownOpen && (
            <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-48">
              {categories.map(category => (
                <div
                  key={category}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
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
