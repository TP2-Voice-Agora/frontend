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

// Обертка для основного контента, чтобы использовать useLocation
const AppContent = () => {
    const location = useLocation();
    const [showLoginForm, setShowLoginForm] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('all');
    const [sortBy, setSortBy] = React.useState('date');
    const [selectedCategories, setSelectedCategories] = React.useState([]);

    // Определяем, является ли текущая страница страницей деталей идеи
    // или страницей создания идеи (чтобы для них не применять глобальный контейнер)
    const isIdeaDetailPage = location.pathname.startsWith('/idea/');
    const isCreateIdeaPage = location.pathname === '/create';
    const isUserProfilePage = location.pathname.startsWith('/user/'); // Добавим для профиля, если ему тоже нужен свой макет
    const isRegisterPage = location.pathname === '/register';
    const isMainPage = location.pathname.startsWith('/');


    // Страницы, которые должны занимать всю ширину и управлять своим фоном/контейнером
    const fullWidthPages = isIdeaDetailPage || isCreateIdeaPage || isUserProfilePage || isRegisterPage || isMainPage;


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

    // Определяем классы для корневого div (управляет фоном всего приложения)
    // Если это одна из "fullWidthPages", не задаем фон здесь, так как страница сама его задаст.
    // В противном случае используем bg-gray-50.
    const rootDivClasses = `min-h-screen ${!fullWidthPages ? 'bg-gray-50' : ''}`;

    // Классы для контейнера, в котором будет Header и Routes.
    // Для "fullWidthPages" этот контейнер не должен иметь `container mx-auto`,
    // чтобы страницы могли растягиваться на всю ширину.
    // Padding `px-6 py-4` можно оставить для Header, если он нужен всем страницам.
    // Либо, если Header тоже должен быть full-width на этих страницах, этот div можно сделать проще.
    const mainContentWrapperClasses = !fullWidthPages ? "container mx-auto " : "";


    return (
        <div className={rootDivClasses}>
            <div className={mainContentWrapperClasses}>
                <Header onProfileClick={() => setShowLoginForm(true)} />
                {/* Для страниц, которые не fullWidth, можно добавить еще один div с container mx-auto здесь,
            если Header должен быть full-width, а контент под ним - в контейнере.
            Но текущий подход предполагает, что Header всегда в `mainContentWrapperClasses`.
        */}
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
                    <Route
                        path="/create"
                        element={
                                <CreateIdeaForm />

                        }
                    />
                    <Route path="/idea/:id" element={<IdeaDetail />} />
                    <Route path="/profile" element={<UserProfile />} />
                </Routes>
                {showLoginForm && <LoginForm onClose={() => setShowLoginForm(false)} />}
            </div>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent /> {/* Выносим контент, чтобы использовать useLocation */}
            </Router>
        </AuthProvider>
    );
}

export default App;