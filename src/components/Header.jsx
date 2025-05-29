import { useAuth } from '../context/AuthContext';

const Header = ({ onProfileClick }) => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="flex justify-between items-center py-4 mb-6">
      {/* логотип */}
      <div className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>LOGO</div>
      <div className="flex items-center space-x-3">
        {isAuthenticated ? (
          <>
            <span className="text-gray-700">Привет, {user?.name || 'Пользователь'}</span>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Выйти
            </button>
          </>
        ) : (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={onProfileClick}
          >
            Войти
          </button>
        )}
      </div>
    </header>
  );
};
export default Header;