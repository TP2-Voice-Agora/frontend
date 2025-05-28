import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onProfileClick }) => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center py-4 mb-6">
      <div 
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate('/')}
      >
        LOGO
      </div>
      <div className="flex space-x-3">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={() => navigate('/create')}
        >
          Создать идею
        </button>
        <button 
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          onClick={onProfileClick}
        >
          Профиль
        </button>
      </div>
    </header>
  );
};

export default Header;