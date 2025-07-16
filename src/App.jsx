import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Collaboration from './pages/Collaboration';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Favorites from './pages/Favorites';
import ProjectForm from './components/ProjectForm';
import NotificationDropdown from './components/NotificationDropdown';

function AppContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        setUser({
          uid: firebaseUser.uid,
          avatarUrl: firebaseUser.photoURL || '/default-avatar.png',
          displayName: firebaseUser.displayName || 'Пользователь',
          email: firebaseUser.email,
        });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const hideNavbarPaths = ['/login', '/register'];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка приложения...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {!shouldHideNavbar && (
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isAuthenticated={isAuthenticated}
          user={user}
        />
      )}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects searchTerm={searchTerm} />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/account" element={<Account user={user} />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/collaborate/:id" element={<Collaboration />} />
          <Route path="/users/:userId" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/create-project"
            element={
              <ProjectForm
                onSubmit={async (data) => {
                  try {
                    // В реальном приложении здесь будет сохранение в Firebase
                    console.log('Проект создан:', data);
                    
                    // Симуляция сохранения
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Перенаправляем на страницу аккаунта
                    window.location.href = '/account';
                  } catch (error) {
                    console.error('Ошибка при создании проекта:', error);
                    alert('Ошибка при создании проекта. Попробуйте еще раз.');
                  }
                }}
              />
            }
          />
          <Route 
            path="/projects/:id/edit"
            element={
              <ProjectForm
                isEditing={true}
                onSubmit={async (data) => {
                  try {
                    console.log('Проект обновлен:', data);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    window.location.href = '/account';
                  } catch (error) {
                    console.error('Ошибка при обновлении проекта:', error);
                    alert('Ошибка при обновлении проекта. Попробуйте еще раз.');
                  }
                }}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;