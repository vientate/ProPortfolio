import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaHeart, FaBars, FaTimes } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useState, useEffect } from 'react';
import NotificationDropdown from './NotificationDropdown';
import '../App.css';

function Navbar({ isAuthenticated, user, searchTerm, setSearchTerm }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Симуляция уведомлений (в реальном приложении будет из Firebase)
  useEffect(() => {
    if (isAuthenticated) {
      const mockNotifications = [
        {
          id: 1,
          type: 'like',
          message: 'Пользователь Мария Иванова лайкнул ваш проект "Веб-приложение"',
          time: new Date(Date.now() - 10 * 60 * 1000),
          read: false
        },
        {
          id: 2,
          type: 'comment',
          message: 'Новый отзыв на проект "Мобильное приложение"',
          time: new Date(Date.now() - 30 * 60 * 1000),
          read: false
        },
        {
          id: 3,
          type: 'follow',
          message: 'Дмитрий Смирнов подписался на ваши обновления',
          time: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    }
  }, [isAuthenticated]);

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo">ProPortfolio</Link>

        {/* Мобильная кнопка меню */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Навигационные ссылки */}
        <div className={`nav-links ${isMobileMenuOpen ? 'nav-links-mobile-open' : ''}`}>
          <Link to="/projects" className="nav-link">Лента</Link>
          
          {/* Поиск */}
          <div className="search-container">
            <input
              type="text"
              className="search-input navbar-search"
              placeholder="Поиск проектов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="nav-buttons">
          {isAuthenticated ? (
            <>
              {/* Избранное */}
              <Link 
                to="/favorites" 
                className="nav-icon-button"
                title="Избранные проекты"
              >
                <FaHeart className="nav-icon" />
              </Link>

              {/* Уведомления */}
              <div className="notification-container">
                <button
                  className={`nav-icon-button ${unreadCount > 0 ? 'has-notifications' : ''}`}
                  onClick={handleNotificationsClick}
                  title="Уведомления"
                >
                  <FaBell className="nav-icon" />
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>

                {showNotifications && (
                  <NotificationDropdown
                    notifications={notifications}
                    onClose={() => setShowNotifications(false)}
                    onMarkAllRead={markAllAsRead}
                  />
                )}
              </div>

              {/* Аватар пользователя */}
              <Link to="/account" className="avatar-link">
                <img
                  src={user?.avatarUrl || '/default-avatar.png'}
                  alt="Профиль"
                  className="avatar"
                  title="Аккаунт"
                />
              </Link>

              {/* Кнопка выхода */}
              <button
                className="btn btn-secondary logout-button"
                onClick={handleLogout}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">Войти</Link>
              <Link to="/register" className="btn btn-secondary">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;