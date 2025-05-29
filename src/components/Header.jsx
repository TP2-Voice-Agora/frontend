import { useAuth } from '../context/AuthContext';

const Header = ({ onProfileClick, onCreateIdeaClick }) => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleCreateIdeaClick = () => {
    if (!isAuthenticated) {
      onProfileClick();
    } else {
      onCreateIdeaClick();
    }
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      onProfileClick();
    } else if (user) {
      // Навигация по user профилю
      window.location.href = `/user/${user.UID}`;
    } else {
      console.warn('User is authenticated but user object is null');
    }
  };

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-[#F2F2F7]">
      <div
        className="bg-white text-black px-8 py-3 rounded-lg font-semibold cursor-pointer shadow-sm"
        onClick={() => window.location.href = '/'}
      >
        LOGO
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          onClick={handleCreateIdeaClick}
        >
          Создать идею
        </button>

        <button
          className={`px-6 py-2 rounded-lg font-medium ${
            isAuthenticated
              ? 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
              : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
          }`}
          onClick={handleProfileClick}
        >
          {isAuthenticated ? 'Профиль' : 'Войти'}
        </button>

        {isAuthenticated && (
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
            onClick={logout}
          >
            Выйти
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
