import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import FilterTabs from './components/FilterTabs';
import SortControls from './components/SortControls';
import IdeaList from './components/IdeaList';
import IdeaDetail from './components/IdeaDetail';
import CreateIdeaForm from './components/CreateIdeaForm';
import LoginForm from './components/LoginForm';
import UserProfile from './components/UserProfile';
import RegisterForm from './components/Register';

const AppContent = () => {
  const location = useLocation();
  const [showLoginForm, setShowLoginForm] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('date');
  const [selectedCategories, setSelectedCategories] = React.useState([]);

  const isSpecialPage = ['/create', '/register'].includes(location.pathname) ||
    location.pathname.startsWith('/idea/') || location.pathname.startsWith('/user/');

  const MainPage = () => (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center justify-between px-[5px] py-[5px]"
        style={{ backgroundColor: '#F2F2F7' }}
      >
        <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <SortControls
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </div>
      <div className="mt-[20px]">
        <IdeaList />
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${!isSpecialPage ? 'bg-gray-50' : ''}`}>
      <div className={!isSpecialPage ? 'container mx-auto' : ''}>
        <Header onProfileClick={() => setShowLoginForm(true)} />
        <Routes>
          <Route path="/user/:uid" element={<UserProfile />} />
          <Route
            path="/register"
            element={
              <ProtectedRoute adminOnly={true}>
                <RegisterForm />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<MainPage />} />
          <Route path="/create" element={<CreateIdeaForm />} />
          <Route path="/idea/:id" element={<IdeaDetail />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
        {showLoginForm && <LoginForm onClose={() => setShowLoginForm(false)} />}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
