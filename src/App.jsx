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
  const [showCreateIdeaModal, setShowCreateIdeaModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('date');
  const [selectedCategories, setSelectedCategories] = React.useState([]);

  const isSpecialPage = ['/register'].includes(location.pathname) ||
    location.pathname.startsWith('/idea/') || location.pathname.startsWith('/user/');

  const MainPage = () => (
    <div className="flex flex-col flex-grow min-h-0">
      <div className="flex items-center justify-between px-6 py-2 shrink-0">
        <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <SortControls
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </div>
      <div className="mt-5 flex-grow min-h-0 overflow-auto px-6">
        <IdeaList />
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col min-h-screen bg-[#F2F2F7]`}>
      <div className={!isSpecialPage ? 'container mx-auto flex flex-col flex-grow min-h-0' : 'flex flex-col flex-grow min-h-0'}>
        <Header
          onProfileClick={() => setShowLoginForm(true)}
          onCreateIdeaClick={() => setShowCreateIdeaModal(true)}
        />
        <div className="flex-grow flex flex-col min-h-0">
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
            <Route path="/idea/:id" element={<IdeaDetail />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </div>

        {/* Модалки рендерим отдельно */}
        {showLoginForm && <LoginForm onClose={() => setShowLoginForm(false)} />}
        {showCreateIdeaModal && <CreateIdeaForm onClose={() => setShowCreateIdeaModal(false)} />}
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
