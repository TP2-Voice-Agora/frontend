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
          className={`px-4 py-2 rounded-md transition-all duration-200 ${
            activeTab === tab.id 
              ? 'tab-active'
              : 'tab-inactive hover:bg-gray-50'
          } ${tab.id === 'rejected' ? 'text-red-500' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;