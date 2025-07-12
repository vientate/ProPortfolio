import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';
import '../App.css';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collaborateMode, setCollaborateMode] = useState(false);

  useEffect(() => {
    // Заглушка данных - в реальном приложении здесь будет запрос к API
    const fetchProject = async () => {
      try {
        // Имитация загрузки
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockProject = {
          id: 1,
          title: 'Веб-приложение для управления задачами',
          author: 'Алексей Петров',
          authorId: 'user1',
          description: 'Полнофункциональное приложение на React с бэкендом на Node.js. Включает аутентификацию, CRUD операции для задач, фильтрацию и сортировку.',
          rating: 4.5,
          reviewsCount: 12,
          imageUrl: '/project1.jpg',
          tags: ['React', 'Node.js', 'MongoDB'],
          createdAt: '2023-10-15',
          isOwner: true // В реальном приложении это будет проверяться
        };

        const mockReviews = [
          {
            id: 1,
            author: 'Мария Иванова',
            rating: 5,
            comment: 'Отличный проект! Очень чистый код и продуманная архитектура.',
            createdAt: '2023-10-20'
          },
          {
            id: 2,
            author: 'Дмитрий Смирнов',
            rating: 4,
            comment: 'Хорошая работа, но интерфейс можно улучшить.',
            createdAt: '2023-10-18'
          }
        ];

        setProject(mockProject);
        setReviews(mockReviews);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки проекта:', error);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleReviewSubmit = (review) => {
    // В реальном приложении здесь будет отправка на сервер
    const newReview = {
      id: reviews.length + 1,
      author: 'Вы', // В реальном приложении - текущий пользователь
      ...review,
      createdAt: new Date().toISOString()
    };
    setReviews([...reviews, newReview]);
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
              {/* Здесь будут инструменты для совместной работы */}
              <div className="code-editor-placeholder">
                <p>Редактор кода будет здесь</p>
              </div>
              <div className="chat-placeholder">
                <p>Чат для обсуждения</p>
              </div>
            </div>
            <button 
              onClick={() => setCollaborateMode(false)}
              className="btn-secondary"
            >
              Выйти из режима
            </button>
          </div>
        ) : (
          <>
            <div className="project-header">
              <div className="project-image">
                <img src={project.imageUrl} alt={project.title} />
              </div>
              <div className="project-info">
                <h1>{project.title}</h1>
                <Link to={`/users/${project.authorId}`} className="author-link">
                  {project.author}
                </Link>
                <div className="project-meta">
                  <span>⭐ {project.rating} ({project.reviewsCount} отзывов)</span>
                  <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="project-tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
                {project.isOwner && (
                  <div className="owner-actions">
                    <button className="btn-primary">Редактировать</button>
                    <button 
                      onClick={() => setCollaborateMode(true)}
                      className="btn-secondary"
                    >
                      Совместная работа
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="project-content">
              <h2>Описание проекта</h2>
              <p>{project.description}</p>
              
              <div className="project-reviews">
                <h2>Отзывы ({reviews.length})</h2>
                
                <div className="add-review">
                  <h3>Оставить отзыв</h3>
                  <ReviewForm onSubmit={handleReviewSubmit} />
                </div>
                
                <div className="reviews-list">
                  {reviews.map(review => (
                    <div key={review.id} className="review">
                      <div className="review-header">
                        <strong>{review.author}</strong>
                        <span>{review.rating} ★</span>
                        <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p>{review.comment}</p>
                    </div>
                  ))}
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