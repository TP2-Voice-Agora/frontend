import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const SortControls = ({ sortBy, setSortBy, selectedCategories, setSelectedCategories }) => {
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const dateDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  const categories = [
    'Срочно',
    'Бюджет',
    'Развитие',
    'Дизайн/брендинг',
    'Эксперимент',
    'Маркетинг',
    'Производство',
  ];

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
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const sortOptions = [
    { key: 'likes', label: 'По лайкам' },
    { key: 'dislikes', label: 'По дизлайкам' },
    { key: 'date', label: 'По дате создания' },
  ];

  const selectedSortLabel =
    sortOptions.find((option) => option.key === sortBy)?.label || 'Сортировка';

  return (
    <div className="flex items-center justify-between px-6 flex-wrap gap-4">
      <span
        className="text-[16px] whitespace-nowrap"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          color: '#0A84FF',
        }}
      >
        Сортировать по:
      </span>

      <div className="flex flex-wrap gap-4">
        {/* Кнопка сортировки */}
        <div className="relative" ref={dateDropdownRef}>
          <button
            className="min-w-[200px] h-[40px] flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all px-[22px] py-[11px]"
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            type="button"
          >
            <div className="flex items-center gap-[5px]">
              <img
                src="/public/iconamoon-arrow-up-1-thin.svg"
                alt="arrow-up"
                className="w-4 h-4 flex-shrink-0"
              />
              <span
                className="text-[14px] whitespace-nowrap"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  color: '#0A84FF',
                }}
              >
                {selectedSortLabel}
              </span>
              <FaChevronDown
                className={`text-blue-500 w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                  isDateDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>
          {isDateDropdownOpen && (
            <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-52">
              {sortOptions.map((option) => (
                <div
                  key={option.key}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSortBy(option.key);
                    setIsDateDropdownOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={categoryDropdownRef}>
          <button
            className="min-w-[200px] h-[40px] flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all px-[22px] py-[11px]"
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            type="button"
          >
            <div className="flex items-center gap-[5px]">
              <img
                src="/public/iconamoon-arrow-up-1-thin.svg"
                alt="arrow-up"
                className="w-4 h-4"
              />
              <span
                className="text-[15px] whitespace-nowrap"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  color: '#0A84FF',
                }}
              >
                Категории
              </span>
              <FaChevronDown
                className={`text-blue-500 w-4 h-4 transition-transform duration-200 ${
                  isCategoryDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>
          {isCategoryDropdownOpen && (
            <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-52 max-h-64 overflow-auto">
              {categories.map((category) => (
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
                    readOnly
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
