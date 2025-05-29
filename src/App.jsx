import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import FilterTabs from './components/FilterTabs';
import SortControls from './components/SortControls';
import IdeaList from './components/IdeaList'; // импортируем IdeaList
import IdeaDetail from './components/IdeaDetail';
import CreateIdeaForm from './components/CreateIdeaForm';
import LoginForm from './components/LoginForm';
import UserProfile from './components/UserProfile';
import RegisterForm from './components/Register';

function App() {
  const [showLoginForm, setShowLoginForm] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('date');
  const [selectedCategories, setSelectedCategories] = React.useState([]);

  // Главная страница с идеями
  const MainPage = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <SortControls
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </div>
      <IdeaList />
    </div>
  );

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-6 py-4">
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
              {/* Главная страница с списком идей */}
              <Route path="/" element={<MainPage />} />

              {/* Страница создания идеи (защищенная) */}
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreateIdeaForm />
                  </ProtectedRoute>
                }
              />

              {/* Страница детали идеи */}
              <Route path="/idea/:id" element={<IdeaDetail />} />
            </Routes>
            {showLoginForm && <LoginForm onClose={() => setShowLoginForm(false)} />}
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;