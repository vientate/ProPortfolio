import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase';
import ProjectCard from '../components/ProjectCard';
import { FaHeart, FaSearch } from 'react-icons/fa';
import '../App.css';

function Favorites() {
  const [user] = useAuthState(auth);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Получаем избранные проекты пользователя
      const favoritesRef = collection(db, 'favorites');
      const q = query(
        favoritesRef, 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const favoriteProjects = [];
      querySnapshot.forEach((doc) => {
        const favoriteData = doc.data();
        favoriteProjects.push({
          id: favoriteData.projectId,
          title: favoriteData.projectTitle,
          author: favoriteData.projectAuthor,
          imageUrl: favoriteData.projectImage,
          addedAt: favoriteData.createdAt.toDate(),
          // Дополнительные данные можно получить из коллекции projects
        });
      });
      
      setFavorites(favoriteProjects);
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
      // Загружаем моковые данные в случае ошибки
      loadMockFavorites();
    } finally {
      setLoading(false);
    }
  };

  const loadMockFavorites = () => {
    const mockFavorites = [
      {
        id: 1,
        title: 'Веб-приложение для управления задачами',
        author: 'Алексей Петров',
        description: 'Полнофункциональное приложение на React с бэкендом на Node.js',
        tags: ['React', 'Node.js'],
        rating: 4.5,
        reviewsCount: 12,
        imageUrl: 'https://via.placeholder.com/300x200?text=Task+Manager',
        likes: 25,
        views: 150,
        addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        title: 'Мобильное приложение для фитнеса',
        author: 'Мария Иванова',
        description: 'Приложение для трекинга тренировок и питания',
        tags: ['React Native', 'UI/UX'],
        rating: 4.2,
        reviewsCount: 8,
        imageUrl: 'https://via.placeholder.com/300x200?text=Fitness+App',
        likes: 18,
        views: 120,
        addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        title: 'E-commerce платформа',
        author: 'Дмитрий Смирнов',
        description: 'Современная платформа для интернет-магазинов',
        tags: ['Next.js', 'Stripe'],
        rating: 4.7,
        reviewsCount: 15,
        imageUrl: 'https://via.placeholder.com/300x200?text=E-commerce',
        likes: 32,
        views: 210,
        addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ];
    setFavorites(mockFavorites);
  };

  // Фильтрация и сортировка
  const filteredFavorites = favorites
    .filter(project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.addedAt) - new Date(a.addedAt);
        case 'oldest':
          return new Date(a.addedAt) - new Date(b.addedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        default:
          return 0;
      }
    });

  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'вчера';
    } else if (diffDays < 7) {
      return `${diffDays} дн. назад`;
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };

  if (!user) {
    return (
      <div className="favorites-page">
        <div className="container">
          <div className="auth-required">
            <h2>Войдите в аккаунт</h2>
            <p>Чтобы просматривать избранные проекты, необходимо войти в систему.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <div className="header-title">
              <FaHeart className="page-icon" />
              <h1>Избранные проекты</h1>
            </div>
            <p className="header-subtitle">
              {favorites.length} {favorites.length === 1 ? 'проект' : 'проектов'} в избранном
            </p>
          </div>
        </div>

        {/* Фильтры и поиск */}
        <div className="favorites-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Поиск в избранном..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="sort-container">
            <label htmlFor="sort">Сортировка:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recent">Недавно добавленные</option>
              <option value="oldest">Давно добавленные</option>
              <option value="title">По названию</option>
              <option value="author">По автору</option>
            </select>
          </div>
        </div>

        {/* Содержимое */}
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Загрузка избранного...</p>
          </div>
        ) : filteredFavorites.length === 0 ? (
          searchTerm ? (
            <div className="no-results">
              <h3>Ничего не найдено</h3>
              <p>Попробуйте изменить поисковый запрос</p>
            </div>
          ) : (
            <div className="empty-favorites">
              <FaHeart className="empty-icon" />
              <h3>В избранном пока пусто</h3>
              <p>Добавляйте понравившиеся проекты в избранное, нажимая на иконку закладки</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/projects'}
              >
                Посмотреть проекты
              </button>
            </div>
          )
        ) : (
          <div className="favorites-grid">
            {filteredFavorites.map(project => (
              <div key={project.id} className="favorite-item">
                <ProjectCard project={project} />
                <div className="favorite-meta">
                  <span className="added-date">
                    Добавлено {formatDate(project.addedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;