import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import ProjectCard from '../components/ProjectCard';
import '../App.css';

function Account() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  
  const [userProfile, setUserProfile] = useState({
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    bio: 'Фронтенд разработчик с опытом работы 3 года. Специализация: React, TypeScript.',
    skills: ['JavaScript', 'React', 'HTML/CSS', 'Node.js'],
    joinedAt: '2022-05-10'
  });

  const [friends, setFriends] = useState([
    { id: 'u1', name: 'Алексей Смирнов' },
    { id: 'u2', name: 'Мария Ковалева' },
    { id: 'u3', name: 'Дмитрий Орлов' }
  ]);

  const [publicProjects, setPublicProjects] = useState([]);
  const [draftProjects, setDraftProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('public');
  const [loading, setLoading] = useState(true);

  const [bannerImage, setBannerImage] = useState('');
  const [avatarImage, setAvatarImage] = useState('');
  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    bio: userProfile.bio,
    skills: userProfile.skills.join(', '),
  });

  const [showFriendsModal, setShowFriendsModal] = useState(false);

  // Загрузка проектов пользователя
  useEffect(() => {
    if (user) {
      loadUserProjects();
    }
  }, [user]);

  const loadUserProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, where('authorId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const allProjects = [];
      querySnapshot.forEach((doc) => {
        allProjects.push({ id: doc.id, ...doc.data() });
      });
      
      // Разделяем на публичные и черновики
      const publicProjs = allProjects.filter(project => project.isPublic);
      const draftProjs = allProjects.filter(project => !project.isPublic);
      
      setPublicProjects(publicProjs);
      setDraftProjects(draftProjs);
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
      // Загружаем моковые данные в случае ошибки
      loadMockProjects();
    } finally {
      setLoading(false);
    }
  };

  const loadMockProjects = () => {
    const mockPublicProjects = [
      { 
        id: 1, 
        title: 'Веб-приложение для управления задачами', 
        description: 'React приложение с Firebase',
        imageUrl: 'https://via.placeholder.com/300x200?text=Task+Manager',
        isPublic: true,
        likes: 15,
        views: 120,
        rating: 4.5,
        reviewsCount: 8
      },
      { 
        id: 2, 
        title: 'Мобильное приложение для фитнеса', 
        description: 'React Native приложение',
        imageUrl: 'https://via.placeholder.com/300x200?text=Fitness+App',
        isPublic: true,
        likes: 23,
        views: 89,
        rating: 4.2,
        reviewsCount: 5
      }
    ];

    const mockDraftProjects = [
      { 
        id: 3, 
        title: 'E-commerce платформа', 
        description: 'В разработке - Next.js + Stripe',
        imageUrl: 'https://via.placeholder.com/300x200?text=E-commerce+Draft',
        isPublic: false,
        likes: 0,
        views: 5,
        rating: 0,
        reviewsCount: 0
      },
      { 
        id: 4, 
        title: 'Социальная сеть для дизайнеров', 
        description: 'Черновик - концепт и wireframes',
        imageUrl: 'https://via.placeholder.com/300x200?text=Social+Network+Draft',
        isPublic: false,
        likes: 0,
        views: 2,
        rating: 0,
        reviewsCount: 0
      }
    ];

    setPublicProjects(mockPublicProjects);
    setDraftProjects(mockDraftProjects);
  };

  const handlePublishProject = async (projectId) => {
    try {
      const projectRef = doc(db, 'projects', projectId.toString());
      await updateDoc(projectRef, {
        isPublic: true,
        publishedAt: new Date()
      });

      // Перемещаем проект из черновиков в публичные
      const project = draftProjects.find(p => p.id === projectId);
      if (project) {
        setDraftProjects(prev => prev.filter(p => p.id !== projectId));
        setPublicProjects(prev => [...prev, { ...project, isPublic: true }]);
      }
    } catch (error) {
      console.error('Ошибка при публикации проекта:', error);
      // Для демонстрации - перемещаем локально
      const project = draftProjects.find(p => p.id === projectId);
      if (project) {
        setDraftProjects(prev => prev.filter(p => p.id !== projectId));
        setPublicProjects(prev => [...prev, { ...project, isPublic: true }]);
      }
    }
  };

  const handleUnpublishProject = async (projectId) => {
    try {
      const projectRef = doc(db, 'projects', projectId.toString());
      await updateDoc(projectRef, {
        isPublic: false,
        unpublishedAt: new Date()
      });

      // Перемещаем проект из публичных в черновики
      const project = publicProjects.find(p => p.id === projectId);
      if (project) {
        setPublicProjects(prev => prev.filter(p => p.id !== projectId));
        setDraftProjects(prev => [...prev, { ...project, isPublic: false }]);
      }
    } catch (error) {
      console.error('Ошибка при снятии с публикации:', error);
      // Для демонстрации - перемещаем локально
      const project = publicProjects.find(p => p.id === projectId);
      if (project) {
        setPublicProjects(prev => prev.filter(p => p.id !== projectId));
        setDraftProjects(prev => [...prev, { ...project, isPublic: false }]);
      }
    }
  };

  const handleDeleteProject = async (projectId) => {
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить этот проект? Это действие нельзя отменить.');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'projects', projectId.toString()));
      
      // Удаляем из соответствующего списка
      setPublicProjects(prev => prev.filter(p => p.id !== projectId));
      setDraftProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Ошибка при удалении проекта:', error);
      // Для демонстрации - удаляем локально
      setPublicProjects(prev => prev.filter(p => p.id !== projectId));
      setDraftProjects(prev => prev.filter(p => p.id !== projectId));
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setBannerImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setAvatarImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditProfile = () => {
    setFormData({
      name: userProfile.name,
      email: userProfile.email,
      bio: userProfile.bio,
      skills: userProfile.skills.join(', '),
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name: formData.name.trim(),
      email: formData.email.trim(),
      bio: formData.bio.trim(),
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
    }));
    setIsEditing(false);
  };

  const handleCancel = () => setIsEditing(false);

  const ProjectGrid = ({ projects, isDraft = false }) => (
    <div className="projects-grid">
      {projects.map(project => (
        <div key={project.id} className="project-card-container">
          <ProjectCard project={project} />
          <div className="project-actions">
            <button
              className="btn btn-small btn-primary"
              onClick={() => navigate(`/projects/${project.id}/edit`)}
            >
              Редактировать
            </button>
            {isDraft ? (
              <button
                className="btn btn-small btn-success"
                onClick={() => handlePublishProject(project.id)}
              >
                Опубликовать
              </button>
            ) : (
              <button
                className="btn btn-small btn-warning"
                onClick={() => handleUnpublishProject(project.id)}
              >
                Снять с публикации
              </button>
            )}
            <button
              className="btn btn-small btn-danger"
              onClick={() => handleDeleteProject(project.id)}
            >
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  if (!user) {
    return (
      <div className="loading">
        <p>Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div className="account-container">
      <div 
        className="banner" 
        onClick={() => bannerInputRef.current.click()}
        style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : {}}
      >
        <input 
          type="file" 
          ref={bannerInputRef}
          onChange={handleBannerUpload}
          accept="image/*"
          hidden
        />
        {!bannerImage && (
          <div className="banner-placeholder">
            Нажмите для загрузки баннера
          </div>
        )}
      </div>

      <div className="profile-content">
        <div 
          className="avatar" 
          onClick={() => avatarInputRef.current.click()}
          style={{ zIndex: 2 }}
        >
          {avatarImage ? (
            <img src={avatarImage} alt="Аватар" />
          ) : (
            <div className="avatar-placeholder"></div>
          )}
          <input 
            type="file" 
            ref={avatarInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            hidden
          />
        </div>

        <div className="profile-info">
          {!isEditing ? (
            <>
              <h1>{userProfile.name}</h1>
              <p>{userProfile.bio}</p>
              
              <div className="meta-info">
                <span>📧 {userProfile.email}</span>
                <div
                  onClick={() => setShowFriendsModal(true)}
                  style={{
                    cursor: 'pointer',
                    marginTop: 6,
                    color: '#007bff',
                    display: 'inline-block'
                  }}
                >
                  👥 Друзья ({friends.length})
                </div>
              </div>

              <div className="skills">
                {userProfile.skills.map(skill => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              <div className="profile-buttons">
                <button className="btn-primary" onClick={handleEditProfile}>
                  Редактировать профиль
                </button>
                <button className="btn-secondary btn-outline-blue" onClick={() => navigate('/create-project')}>
                  Создать проект
                </button>
              </div>
            </>
          ) : (
            <form className="account-form" onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="name">Имя</label>
                <input 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  type="text"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  type="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">О себе</label>
                <textarea 
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="skills">Навыки (через запятую)</label>
                <input 
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  type="text"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">Сохранить</button>
                <button type="button" className="btn-secondary" onClick={handleCancel}>Отмена</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Табы для проектов */}
      <div className="projects-section">
        <div className="projects-header">
          <div className="project-tabs">
            <button 
              className={`tab-button ${activeTab === 'public' ? 'active' : ''}`}
              onClick={() => setActiveTab('public')}
            >
              Публичные проекты ({publicProjects.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'drafts' ? 'active' : ''}`}
              onClick={() => setActiveTab('drafts')}
            >
              Черновики ({draftProjects.length})
            </button>
          </div>
        </div>

        <div className="projects-content">
          {loading ? (
            <div className="loading">Загрузка проектов...</div>
          ) : (
            <>
              {activeTab === 'public' && (
                <div className="projects-tab-content">
                  {publicProjects.length === 0 ? (
                    <div className="no-projects">
                      <p>У вас пока нет опубликованных проектов.</p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/create-project')}
                      >
                        Создать первый проект
                      </button>
                    </div>
                  ) : (
                    <ProjectGrid projects={publicProjects} isDraft={false} />
                  )}
                </div>
              )}

              {activeTab === 'drafts' && (
                <div className="projects-tab-content">
                  {draftProjects.length === 0 ? (
                    <div className="no-projects">
                      <p>У вас нет черновиков.</p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/create-project')}
                      >
                        Создать проект
                      </button>
                    </div>
                  ) : (
                    <ProjectGrid projects={draftProjects} isDraft={true} />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Модальное окно с друзьями */}
      {showFriendsModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: 24,
            borderRadius: 12,
            width: '400px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowFriendsModal(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'transparent',
                border: 'none',
                fontSize: 20,
                cursor: 'pointer'
              }}
            >
              ✖
            </button>
            <h2 style={{ marginBottom: 16 }}>Мои друзья</h2>
            {friends.map(friend => (
              <div
                key={friend.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 12,
                  borderBottom: '1px solid #eee',
                  paddingBottom: 8
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                    fontWeight: 'bold',
                    color: '#fff',
                    fontSize: 16
                  }}
                >
                  {friend.name.split(' ').map(w => w[0]).join('')}
                </div>
                <span style={{ flexGrow: 1 }}>{friend.name}</span>
                <button
                  style={{
                    backgroundColor: '#ff4d4f',
                    border: 'none',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: 4,
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    const confirmed = window.confirm(`Удалить ${friend.name}?`);
                    if (confirmed) {
                      const updated = friends.filter(f => f.id !== friend.id);
                      setFriends(updated);
                    }
                  }}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;