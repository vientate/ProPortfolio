import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import '../App.css';

function Home() {
  // Состояние для слайдера
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  // Данные для популярных проектов
  const popularProjects = [
    {
      id: 1,
      title: "Мобильное приложение для трекинга здоровья",
      author: "Алексей Петров",
      likes: 124,
      image: "https://via.placeholder.com/400x225?text=Health+App"
    },
    {
      id: 2,
      title: "Веб-платформа для онлайн-образования",
      author: "Мария Иванова",
      likes: 89,
      image: "https://via.placeholder.com/400x225?text=Education+Platform"
    },
    {
      id: 3,
      title: "Дизайн интерфейса для банковского приложения",
      author: "Дмитрий Смирнов",
      likes: 76,
      image: "https://via.placeholder.com/400x225?text=Banking+UI"
    },
    {
      id: 4,
      title: "Система управления складом",
      author: "Ольга Кузнецова",
      likes: 65,
      image: "https://via.placeholder.com/400x225?text=Warehouse+System"
    }
  ];

  // Данные для отзывов
  const testimonials = [
    {
      id: 1,
      name: "Иван Сидоров",
      role: "UX/UI дизайнер",
      text: "Эта платформа помогла мне найти клиентов для фриланса и получить ценные отзывы о моих работах.",
      rating: 5
    },
    {
      id: 2,
      name: "Елена Васнецова",
      role: "Фронтенд-разработчик",
      text: "Благодаря конструктивной критике смогла значительно улучшить свои проекты и найти команду для совместной работы.",
      rating: 4
    },
    {
      id: 3,
      name: "Артем Козлов",
      role: "Продуктовый дизайнер",
      text: "Отличное место для вдохновения и профессионального роста. Регулярно получаю предложения о работе.",
      rating: 5
    }
  ];

  // Автоматическая прокрутка слайдов
  useEffect(() => {
    const startSlider = () => {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % popularProjects.length);
      }, 3000);
    };

    startSlider();
    
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [popularProjects.length]);

  // Прокрутка к текущему слайду
  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.children[0]?.offsetWidth || 0;
      sliderRef.current.scrollTo({
        left: currentSlide * (slideWidth + 30), // 30 - это gap между слайдами
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  // Остановка автопрокрутки при наведении
  const handleMouseEnter = () => {
    clearInterval(intervalRef.current);
  };

  // Возобновление автопрокрутки
  const handleMouseLeave = () => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % popularProjects.length);
    }, 3000);
  };

  return (
    <div className="home-page">
      {/* Hero-блок */}
      <section className="hero">
        <div className="container">
          <h1>Платформа для профессиональных проектов</h1>
          <p className="hero-subtitle">
            Загружайте, демонстрируйте и сотрудничайте над проектами. Получайте отзывы и улучшайте свои навыки.
          </p>
          <div className="hero-actions">
            <Link to="/projects" className="btn btn-primary">
              <i className="fas fa-folder-open"></i> Смотреть проекты
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              <i className="fas fa-plus-circle"></i> Создать проект
            </Link>
          </div>
        </div>
      </section>

      {/* Популярные проекты с автопрокруткой */}
      <section className="popular-projects">
        <div className="container">
          <div className="section-header">
            <h2>Популярные проекты</h2>
            <p className="section-subtitle">Вдохновляйтесь работами нашего сообщества</p>
          </div>
          
          <div 
            className="projects-slider"
            ref={sliderRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {popularProjects.map(project => (
              <div key={project.id} className="project-slide">
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                  <div className="project-likes">
                    <i className="fas fa-heart"></i> {project.likes}
                  </div>
                </div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p className="project-author">Автор: {project.author}</p>
                  <Link to={`/projects/${project.id}`} className="btn btn-slider">
                    Посмотреть проект
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="slider-controls">
            {popularProjects.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
          
          <div className="view-all">
            <Link to="/projects" className="btn btn-outline">
              Смотреть все проекты <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Функциональные карточки */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Наши возможности</h2>
            <p className="section-subtitle">Все что нужно для профессионального роста</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-upload feature-icon"></i>
              <h3>Загружайте проекты</h3>
              <p>Покажите свои работы профессиональному сообществу</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-comments feature-icon"></i>
              <h3>Получайте отзывы</h3>
              <p>Конструктивная критика поможет вам расти</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-handshake feature-icon"></i>
              <h3>Сотрудничайте</h3>
              <p>Работайте вместе над проектами с другими профессионалами</p>
            </div>
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>Как это работает</h2>
            <p className="section-subtitle">Всего несколько шагов до вашего профессионального портфолио</p>
          </div>
          
          <div className="steps-container">
            <div className="step-line"></div>
            
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <i className="fas fa-user-plus step-icon"></i>
                  <h4>Зарегистрируйтесь</h4>
                  <p>Создайте аккаунт, чтобы начать делиться проектами.</p>
                </div>
              </div>
              
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <i className="fas fa-upload step-icon"></i>
                  <h4>Добавьте проект</h4>
                  <p>Расскажите о своей работе, прикрепите изображения или ссылки.</p>
                </div>
              </div>
              
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <i className="fas fa-comment-dots step-icon"></i>
                  <h4>Получите обратную связь</h4>
                  <p>Читайте комментарии, развивайтесь и улучшайте свои навыки.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="cta-container">
            <Link to="/register" className="btn btn-accent">
              Начать сейчас <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Что говорят наши пользователи</h2>
            <p className="section-subtitle">Реальные истории профессионального роста</p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Дополнительный CTA блок */}
      <section className="extra-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Начни делиться своими проектами</h2>
            <p>Присоединяйтесь к сообществу профессионалов и покажите миру свои работы</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-light">
                Зарегистрироваться
              </Link>
              <Link to="/projects" className="btn btn-outline-light">
                Посмотреть примеры
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;