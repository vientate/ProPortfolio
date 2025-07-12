import { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import '../App.css';

function ProjectsPage({ searchTerm }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    tags: [],
    category: '',
    sortBy: 'newest'
  });

  // Все доступные теги и категории
  const allTags = ['React', 'Дизайн', 'Node.js', 'Мобильная разработка', 'UI/UX'];
  const categories = ['Веб-разработка', 'Мобильные приложения', 'Дизайн', 'Другое'];

  useEffect(() => {
    // Имитация загрузки данных с API
    const fetchProjects = async () => {
      try {
        const mockProjects = [
          {
            id: 1,
            title: 'Веб-приложение для управления задачами',
            author: 'Алексей Петров',
            description: 'Полнофункциональное приложение на React с бэкендом на Node.js',
            tags: ['React', 'Node.js'],
            category: 'Веб-разработка',
            rating: 4.5,
            reviewsCount: 12,
            imageUrl: '/project1.jpg',
            likes: 25,
            views: 150,
            createdAt: '2023-10-15'
          },
          {
            id: 2,
            title: 'Мобильное приложение для фитнеса',
            author: 'Мария Иванова',
            description: 'Приложение для трекинга тренировок и питания',
            tags: ['Мобильная разработка', 'UI/UX'],
            category: 'Мобильные приложения',
            rating: 4.2,
            reviewsCount: 8,
            imageUrl: '/project2.jpg',
            likes: 18,
            views: 120,
            createdAt: '2023-11-20'
          },
          {
            id: 3,
            title: 'Дизайн интерфейса банковского приложения',
            author: 'Дмитрий Смирнов',
            description: 'Современный UI/UX дизайн для финансового сервиса',
            tags: ['Дизайн', 'UI/UX'],
            category: 'Дизайн',
            rating: 4.7,
            reviewsCount: 15,
            imageUrl: '/project3.jpg',
            likes: 32,
            views: 210,
            createdAt: '2023-09-05'
          }
        ];
        
        setProjects(mockProjects);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки проектов:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Фильтрация и сортировка проектов
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = searchTerm 
        ? project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      const matchesTags = filters.tags.length === 0 || 
                         filters.tags.some(tag => project.tags.includes(tag));
      
      const matchesCategory = !filters.category || 
                            project.category === filters.category;
      
      return matchesSearch && matchesTags && matchesCategory;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (filters.sortBy === 'popular') {
        return b.likes - a.likes;
      } else if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });

  // Обработчики фильтров
  const handleTagToggle = (tag) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
            ? prev.tags.filter(t => t !== tag) 
            : [...prev.tags, tag]
    }));
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? '' : category
    }));
  };

  const handleSortChange = (sortBy) => {
    setFilters(prev => ({
      ...prev,
      sortBy
    }));
  };

  return (
    <div className="projects-page">
      <div className="container">
        {/* Фильтры и сортировка */}
        <div className="filters-section">
          <div className="filter-group">
            <h3>Теги:</h3>
            <div className="tags-filter">
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`tag ${filters.tags.includes(tag) ? 'active' : ''}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <h3>Категории:</h3>
            <div className="category-filter">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${filters.category === category ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <h3>Сортировка:</h3>
            <select 
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Сначала новые</option>
              <option value="popular">По популярности</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>
        </div>
        
        {/* Лента проектов */}
        {loading ? (
          <div className="loading">Загрузка проектов...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="no-projects">
            <p>Проекты не найдены. Попробуйте изменить параметры фильтрации.</p>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectsPage;