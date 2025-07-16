import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  doc, getDoc, collection, query, where, getDocs, addDoc, 
  updateDoc, increment, deleteDoc, setDoc 
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FaStar, FaHeart, FaEye, FaRegHeart, FaBookmark, FaRegBookmark, FaGithub, FaGlobe, FaYoutube } from 'react-icons/fa';
import ReviewForm from '../components/ReviewForm';
import '../App.css';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  
  const [project, setProject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [collaborateMode, setCollaborateMode] = useState(false);
  
  // Состояния для взаимодействий
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);

  useEffect(() => {
    loadProject();
    loadReviews();
  }, [id]);

  useEffect(() => {
    if (user && project) {
      checkUserInteractions();
      incrementViews();
    }
  }, [user, project]);

  const loadProject = async () => {
    try {
      // В реальном приложении загружаем из Firebase
      const mockProject = {
        id: parseInt(id),
        title: 'Веб-приложение для управления задачами',
        author: 'Алексей Петров',
        authorId: 'user1',
        description: 'Полнофункциональное приложение на React с бэкендом на Node.js. Включает аутентификацию, CRUD операции для задач, фильтрацию и сортировку. Приложение разработано с использованием современных технологий и следует лучшим практикам разработки.',
        fullDescription: `
          Это комплексное веб-приложение для управления задачами, которое поможет вам организовать свою работу и повысить продуктивность.

          **Основные возможности:**
          - Создание, редактирование и удаление задач
          - Категоризация задач по проектам
          - Установка приоритетов и дедлайнов
          - Фильтрация и поиск задач
          - Командная работа и назначение исполнителей
          - Уведомления о приближающихся дедлайнах
          - Статистика и отчеты по выполненным задачам

          **Технологии:**
          - Frontend: React 18, TypeScript, Material-UI
          - Backend: Node.js, Express, MongoDB
          - Аутентификация: JWT
          - Развертывание: Docker, AWS

          **Архитектура:**
          Приложение построено по принципам чистой архитектуры с разделением на слои представления, бизнес-логики и данных.
        `,
        rating: 4.5,
        reviewsCount: 12,
        imageUrl: 'https://via.placeholder.com/800x400?text=Task+Manager+App',
        gallery: [
          'https://via.placeholder.com/600x400?text=Dashboard',
          'https://via.placeholder.com/600x400?text=Task+List',
          'https://via.placeholder.com/600x400?text=Task+Form',
          'https://via.placeholder.com/600x400?text=Reports'
        ],
        tags: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
        createdAt: '2023-10-15',
        likes: 25,
        views: 150,
        github: 'https://github.com/alexeyp/task-manager',
        website: 'https://taskmanager-demo.com',
        youtube: 'https://youtube.com/watch?v=demo',
        isOwner: user?.uid === 'user1'
      };

      setProject(mockProject);
      setLikes(mockProject.likes);
      setViews(mockProject.views);
    } catch (error) {
      console.error('Ошибка загрузки проекта:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    setReviewsLoading(true);
    try {
      // Моковые отзывы
      const mockReviews = [
        {
          id: 1,
          author: 'Мария Иванова',
          authorId: 'user2',
          rating: 5,
          comment: 'Отличный проект! Очень чистый код и продуманная архитектура. Особенно понравилась реализация аутентификации и работа с состоянием приложения.',
          createdAt: new Date('2023-10-20'),
          helpful: 8
        },
        {
          id: 2,
          author: 'Дмитрий Смирнов',
          authorId: 'user3',
          rating: 4,
          comment: 'Хорошая работа! Функционал впечатляет, но интерфейс можно немного улучшить. Может быть, добавить dark mode?',
          createdAt: new Date('2023-10-18'),
          helpful: 5
        },
        {
          id: 3,
          author: 'Анна Козлова',
          authorId: 'user4',
          rating: 5,
          comment: 'Превосходное приложение! Использую похожий стек технологий в своих проектах. Код очень качественный, документация на высоте.',
          createdAt: new Date('2023-10-16'),
          helpful: 12
        }
      ];

      setReviews(mockReviews);
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkUserInteractions = async () => {
    if (!user || !project) return;

    try {
      // В реальном приложении проверяем в Firebase
      // Пока просто устанавливаем случайные значения для демонстрации
      setIsLiked(Math.random() > 0.5);
      setIsFavorited(Math.random() > 0.7);
    } catch (error) {
      console.error('Ошибка при проверке взаимодействий:', error);
    }
  };

  const incrementViews = async () => {
    try {
      // В реальном приложении обновляем счетчик в Firebase
      setViews(prev => prev + 1);
    } catch (error) {
      console.error('Ошибка при увеличении просмотров:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Войдите в систему, чтобы лайкать проекты');
      return;
    }

    try {
      if (isLiked) {
        setLikes(prev => prev - 1);
        setIsLiked(false);
      } else {
        setLikes(prev => prev + 1);
        setIsLiked(true);
        
        // Добавляем уведомление автору
        if (project.authorId !== user.uid) {
          await addNotification(
            project.authorId, 
            'like', 
            `${user.displayName || 'Пользователь'} лайкнул ваш проект "${project.title}"`
          );
        }
      }
    } catch (error) {
      console.error('Ошибка при лайке:', error);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      alert('Войдите в систему, чтобы добавлять в избранное');
      return;
    }

    try {
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Ошибка при добавлении в избранное:', error);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    if (!user) {
      alert('Войдите в систему, чтобы оставить отзыв');
      return;
    }

    try {
      const newReview = {
        id: reviews.length + 1,
        author: user.displayName || 'Пользователь',
        authorId: user.uid,
        ...reviewData,
        createdAt: new Date(),
        helpful: 0
      };

      setReviews(prev => [newReview, ...prev]);
      
      // Обновляем рейтинг проекта
      const newRating = calculateNewRating(reviewData.rating);
      setProject(prev => ({
        ...prev,
        rating: newRating,
        reviewsCount: prev.reviewsCount + 1
      }));

      // Добавляем уведомление автору проекта
      if (project.authorId !== user.uid) {
        await addNotification(
          project.authorId,
          'comment',
          `${user.displayName || 'Пользователь'} оставил отзыв на ваш проект "${project.title}"`
        );
      }
    } catch (error) {
      console.error('Ошибка при добавлении отзыва:', error);
    }
  };

  const calculateNewRating = (newRating) => {
    const totalRating = project.rating * project.reviewsCount + newRating;
    const newCount = project.reviewsCount + 1;
    return Math.round((totalRating / newCount) * 10) / 10;
  };

  const addNotification = async (userId, type, message) => {
    try {
      // В реальном приложении добавляем в Firebase
      console.log('Уведомление добавлено:', { userId, type, message });
    } catch (error) {
      console.error('Ошибка при добавлении уведомления:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star half-filled" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star empty" />);
    }

    return stars;
  };

  if (loading) {
    return <div className="loading">Загрузка проекта...</div>;
  }

  if (!project) {
    return <div className="error">Проект не найден</div>;
  }

  return (
    <div className="project-detail">
      <div className="container">
        {collaborateMode ? (
          <div className="collaboration-mode">
            <h2>Режим совместной работы: {project.title}</h2>
            <div className="collaboration-tools">
              <div className="code-editor-placeholder">
                <h3>Редактор кода</h3>
                <p>Здесь будет интегрированный редактор кода для совместной работы</p>
                <div className="mock-editor">
                  <div className="editor-toolbar">
                    <span>main.js</span>
                    <span>styles.css</span>
                    <span>+ Новый файл</span>
                  </div>
                  <div className="editor-content">
                    <pre>{`function TaskManager() {
  const [tasks, setTasks] = useState([]);
  
  const addTask = (task) => {
    setTasks(prev => [...prev, task]);
  };
  
  return (
    <div className="task-manager">
      {/* Компонент управления задачами */}
    </div>
  );
}`}</pre>
                  </div>
                </div>
              </div>
              <div className="chat-placeholder">
                <h3>Чат проекта</h3>
                <div className="mock-chat">
                  <div className="chat-message">
                    <strong>Алексей:</strong> Привет! Готов начать работу над новой функцией
                  </div>
                  <div className="chat-message">
                    <strong>Мария:</strong> Отлично! Я как раз закончила с UI компонентами
                  </div>
                  <div className="chat-input">
                    <input type="text" placeholder="Написать сообщение..." />
                    <button>Отправить</button>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setCollaborateMode(false)}
              className="btn btn-secondary"
            >
              Выйти из режима совместной работы
            </button>
          </div>
        ) : (
          <>
            <div className="project-header">
              <div className="project-main-image">
                <img src={project.imageUrl} alt={project.title} />
                <div className="project-overlay">
                  <div className="project-actions">
                    <button
                      className={`action-btn ${isLiked ? 'liked' : ''}`}
                      onClick={handleLike}
                      title={isLiked ? 'Убрать лайк' : 'Лайкнуть'}
                    >
                      {isLiked ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    <button
                      className={`action-btn ${isFavorited ? 'favorited' : ''}`}
                      onClick={handleFavorite}
                      title={isFavorited ? 'Убрать из избранного' : 'Добавить в избранное'}
                    >
                      {isFavorited ? <FaBookmark /> : <FaRegBookmark />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="project-info">
                <h1>{project.title}</h1>
                <Link to={`/users/${project.authorId}`} className="author-link">
                  {project.author}
                </Link>
                
                <div className="project-meta">
                  <div className="rating-display">
                    <div className="stars">
                      {renderStars(project.rating)}
                    </div>
                    <span>{project.rating} ({project.reviewsCount} отзывов)</span>
                  </div>
                  <div className="meta-stats">
                    <span className="stat">
                      <FaHeart className="stat-icon" /> {likes}
                    </span>
                    <span className="stat">
                      <FaEye className="stat-icon" /> {views}
                    </span>
                    <span className="date">📅 {formatDate(project.createdAt)}</span>
                  </div>
                </div>
                
                <div className="project-tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>

                {/* Ссылки на ресурсы */}
                <div className="project-links">
                  {project.github && (
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-link github"
                    >
                      <FaGithub /> Код
                    </a>
                  )}
                  {project.website && (
                    <a 
                      href={project.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-link website"
                    >
                      <FaGlobe /> Демо
                    </a>
                  )}
                  {project.youtube && (
                    <a 
                      href={project.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-link youtube"
                    >
                      <FaYoutube /> Видео
                    </a>
                  )}
                </div>
                
                {project.isOwner && (
                  <div className="owner-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate(`/projects/${project.id}/edit`)}
                    >
                      Редактировать
                    </button>
                    <button 
                      onClick={() => setCollaborateMode(true)}
                      className="btn btn-secondary"
                    >
                      Совместная работа
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="project-content">
              <div className="project-description-section">
                <h2>О проекте</h2>
                <div className="description-content">
                  {project.fullDescription ? (
                    <div dangerouslySetInnerHTML={{ 
                      __html: project.fullDescription.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') 
                    }} />
                  ) : (
                    <p>{project.description}</p>
                  )}
                </div>
              </div>

              {/* Галерея изображений */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="project-gallery">
                  <h2>Галерея</h2>
                  <div className="gallery-grid">
                    {project.gallery.map((image, index) => (
                      <div key={index} className="gallery-item">
                        <img src={image} alt={`Скриншот ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Отзывы */}
              <div className="project-reviews">
                <div className="reviews-header">
                  <h2>Отзывы ({reviews.length})</h2>
                  <div className="average-rating">
                    <div className="stars">
                      {renderStars(project.rating)}
                    </div>
                    <span>Средняя оценка: {project.rating}</span>
                  </div>
                </div>
                
                {user && (
                  <div className="add-review">
                    <h3>Оставить отзыв</h3>
                    <ReviewForm onSubmit={handleReviewSubmit} />
                  </div>
                )}
                
                <div className="reviews-list">
                  {reviewsLoading ? (
                    <div className="loading">Загрузка отзывов...</div>
                  ) : reviews.length === 0 ? (
                    <div className="no-reviews">
                      <p>Пока нет отзывов. Станьте первым!</p>
                    </div>
                  ) : (
                    reviews.map(review => (
                      <div key={review.id} className="review">
                        <div className="review-header">
                          <div className="review-author">
                            <strong>{review.author}</strong>
                            <div className="review-rating">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <span className="review-date">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <div className="review-content">
                          <p>{review.comment}</p>
                        </div>
                        <div className="review-actions">
                          <button className="helpful-btn">
                            👍 Полезно ({review.helpful})
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;