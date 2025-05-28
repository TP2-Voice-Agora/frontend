import React from 'react';

const FilterTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'all', label: 'Все идеи', color: 'var(--light-themegrey)' },
    { id: 'approved', label: 'Одобренные идеи', color: 'var(--light-themepuregreen)' },
    { id: 'rejected', label: 'Отклоненные идеи', color: 'var(--light-themepurered)' },
    { id: 'neutral', label: 'Нейтральные идеи', color: 'var(--light-themeblue)' },
  ];

  return (
    <div className="flex" style={{ columnGap: '100px' }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`w-[150px] h-[40px] rounded-md text-[15px] font-normal transition-all duration-200 border
                      flex items-center justify-center`}
          style={{
            fontFamily: 'Inter, sans-serif',
            backgroundColor: activeTab === tab.id ? tab.color : 'white',
            color: activeTab === tab.id ? 'white' : 'black',
            borderColor: activeTab === tab.id ? tab.color : 'var(--border)',
          }}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
