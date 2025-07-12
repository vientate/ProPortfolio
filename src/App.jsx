import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects'; // Это и есть ProjectsPage
import ProjectDetail from './pages/ProjectDetail';
import Collaboration from './pages/Collaboration';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import ProjectForm from './components/ProjectForm';

function AppContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        setUser({
          avatarUrl: firebaseUser.photoURL || '/default-avatar.png',
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          uid: firebaseUser.uid,
        });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const hideNavbarPaths = ['/login', '/register'];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects searchTerm={searchTerm} />} /> {/* Лента */}
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/account" element={<Account user={user} />} />
        <Route path="/collaborate/:id" element={<Collaboration />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-project"
  element={
    <ProjectForm
      onSubmit={(data) => {
        console.log('Проект создан:', data);
        // тут можно сделать navigate обратно на /account или /projects
      }}
    />
  }
/>

      </Routes>
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
