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

  const backgroundColor = '#E5E5EA';

  return (
    <div className="flex items-center justify-between gap-4 whitespace-nowrap">
      <span
        className="text-[16px]"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          color: '#0A84FF',
        }}
      >
        Сортировать по:
      </span>

      <div className="flex gap-4">
        {/* Левая кнопка (с кругами) */}
        <div className="relative" ref={dateDropdownRef}>
          <button
            className="min-w-[180px] h-[40px] flex items-center justify-center border border-gray-300 rounded-md transition-all px-[22px] py-[11px]"
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            type="button"
            style={{ backgroundColor }}
          >
            <div className="flex items-center gap-[5px]">
              <img
                src="/iconamoon-arrow-up-1-thin.svg"
                alt="arrow-up"
                className="w-4 h-4 flex-shrink-0"
              />
              <span
                className="text-[14px]"
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
            <div
              className="absolute top-full mt-1 right-0 border border-gray-200 rounded-md shadow-lg z-50 w-52"
              style={{ backgroundColor }}
            >
              {sortOptions.map((option) => {
                const isSelected = sortBy === option.key;
                return (
                  <div
                    key={option.key}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                    onClick={() => {
                      setSortBy(option.key);
                      setIsDateDropdownOpen(false);
                    }}
                  >
                    {/* Внешний круг: 18x18, фон цвета кнопки, белая или синяя обводка */}
                    <span
                      className="mr-2 flex items-center justify-center rounded-full"
                      style={{
                        width: '18px',
                        height: '18px',
                        backgroundColor,
                        border: isSelected ? '1px solid #0A84FF' : '1px solid #FFFFFF',
                        boxSizing: 'border-box',
                      }}
                    >
                      {/* Внутренний синий круг, если выбран */}
                      {isSelected && (
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#0A84FF',
                            borderRadius: '50%',
                          }}
                        />
                      )}
                    </span>
                    {option.label}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Правая кнопка (с чекбоксами) */}
        <div className="relative" ref={categoryDropdownRef}>
          <button
            className="min-w-[200px] h-[40px] flex items-center justify-center border border-gray-300 rounded-md transition-all px-[22px] py-[11px]"
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            type="button"
            style={{ backgroundColor }}
          >
            <div className="flex items-center gap-[5px]">
              <img
                src="/iconamoon-arrow-up-1-thin.svg"
                alt="arrow-up"
                className="w-4 h-4"
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
              <FaChevronDown
                className={`text-blue-500 w-4 h-4 transition-transform duration-200 ${
                  isCategoryDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>
          {isCategoryDropdownOpen && (
            <div
              className="absolute top-full mt-1 right-0 border border-gray-200 rounded-md shadow-lg z-50 w-52 max-h-64 overflow-auto"
              style={{ backgroundColor }}
            >
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <div
                    key={category}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                    onClick={() => toggleCategory(category)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mr-2"
                      readOnly
                    />
                    {category}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortControls;
