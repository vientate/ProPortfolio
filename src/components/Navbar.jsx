import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../App.css';

function Navbar({ isAuthenticated, user, searchTerm, setSearchTerm }) {
  const navigate = useNavigate();

  const handleNotificationsClick = () => alert('Уведомлений пока нет');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo">ProPortfolio</Link>

        {/* Лента — слева от поиска */}
        <Link to="/projects" className="nav-link">Лента</Link>

        <input
          type="text"
          className="search-input navbar-search"
          placeholder="Поиск проектов..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="nav-buttons">
          {isAuthenticated ? (
            <>
              <button
                className="notification-button"
                onClick={handleNotificationsClick}
                title="Уведомления"
              >
                <FaBell className="bell-icon" />
              </button>

              <Link to="/account" className="avatar-link">
                <img
                  src={user?.avatarUrl || '/default-avatar.png'}
                  alt="Профиль"
                  className="avatar"
                  title="Аккаунт"
                />
              </Link>

              <button
                className="btn btn-secondary logout-button"
                onClick={handleLogout}
                style={{ marginLeft: '10px' }}
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
