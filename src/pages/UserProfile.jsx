import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard'; // Исправленный путь
import '../App.css';

function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Заглушка данных
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockUser = {
          id: userId,
          name: 'Алексей Петров',
          bio: 'Фронтенд разработчик с 5-летним опытом работы с React и Node.js',
          skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'], // Здесь правильно
          joinedAt: '2020-03-15'
        };

        const mockProjects = [
          {
            id: 1,
            title: 'Веб-приложение для управления задачами',
            description: 'Полнофункциональное приложение с аутентификацией',
            rating: 4.7,
            reviewsCount: 15,
            imageUrl: '/project1.jpg'
          },
          {
            id: 2,
            title: 'API для сервиса блогов',
            description: 'RESTful API на Node.js с MongoDB',
            rating: 4.3,
            reviewsCount: 8,
            imageUrl: '/project2.jpg'
          }
        ];

        setUser(mockUser);
        setProjects(mockProjects);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div className="loading">Загрузка профиля...</div>;
  }

  if (!user) {
    return <div className="error">Пользователь не найден</div>;
  }

  return (
    <div className="user-profile">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src="/avatar-placeholder.jpg" alt={user.name} />
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p className="profile-bio">{user.bio}</p>
            <div className="profile-meta">
              <span>📅 Участник с {new Date(user.joinedAt).toLocaleDateString()}</span>
            </div>
            <div className="profile-skills">
              {user.skills.map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="user-projects">
          <h2>Проекты пользователя</h2>
          <div className="projects-grid">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;