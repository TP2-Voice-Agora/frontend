import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center py-3">
      <div 
        className="logo font-bold text-lg uppercase tracking-wide bg-gray-100 px-4 py-2 rounded cursor-pointer"
        onClick={() => navigate('/')}
      >
        LOGO
      </div>
      <div className="flex space-x-3">
        <button 
          className="bg-primary text-white font-medium px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          onClick={() => navigate('/create')}
        >
          Создать идею
        </button>
        <button className="border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded hover:bg-gray-50 transition-colors">
          Профиль
        </button>
      </div>
    </header>
  );
};

export default Header;