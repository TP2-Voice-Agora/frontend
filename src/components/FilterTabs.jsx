import React from 'react';

const FilterTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'all', label: 'Все идеи' },
    { id: 'approved', label: 'Одобренные идеи' },
    { id: 'rejected', label: 'Отклоненные идеи' },
    { id: 'neutral', label: 'Нейтральные идеи' }
  ];

  return (
    <div className="flex space-x-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
            activeTab === tab.id 
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;