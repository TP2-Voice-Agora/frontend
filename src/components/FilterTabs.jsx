const FilterTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: '3', label: 'Все идеи', color: '#0A84FF' },
    { id: '1', label: 'Одобренные идеи', color: '#70C170' },
    { id: '2', label: 'Отклоненные идеи', color: '#FF6B6B' },
    { id: '0', label: 'Нейтральные идеи', color: '#D1D1D1' }
  ];

  return (
    <div className="flex space-x-4 max-w-full min-w-0">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="min-w-[150px] h-[40px] rounded-md text-[15px] flex items-center justify-center transition-all duration-200 whitespace-nowrap flex-shrink-0"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              backgroundColor: isActive ? tab.color : '#FFFFFF',
              color: isActive ? '#FFFFFF' : '#000000',
              border: `1px solid ${tab.color}`
            }}
            type="button"
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;