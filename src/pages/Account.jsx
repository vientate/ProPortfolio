import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // если стили там

function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
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

  const [projects] = useState([
    { id: 1, title: 'Проект 1', description: 'Описание проекта 1' },
    { id: 2, title: 'Проект 2', description: 'Описание проекта 2' },
    { id: 3, title: 'Проект 3', description: 'Описание проекта 3' },
    { id: 4, title: 'Проект 4', description: 'Описание проекта 4' },
    { id: 5, title: 'Проект 5', description: 'Описание проекта 5' },
    { id: 6, title: 'Проект 6', description: 'Описание проекта 6' },
  ]);

  const [bannerImage, setBannerImage] = useState('');
  const [avatarImage, setAvatarImage] = useState('');
  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio,
    skills: user.skills.join(', '),
  });

  const [showFriendsModal, setShowFriendsModal] = useState(false);

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
      name: user.name,
      email: user.email,
      bio: user.bio,
      skills: user.skills.join(', '),
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name: formData.name.trim(),
      email: formData.email.trim(),
      bio: formData.bio.trim(),
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
    }));
    setIsEditing(false);
  };

  const handleCancel = () => setIsEditing(false);

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
              <h1>{user.name}</h1>
              <p>{user.bio}</p>
              
              <div className="meta-info">
                <span>📧 {user.email}</span>
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
                {user.skills.map(skill => (
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

      {/* Список проектов */}
      <div
        style={{
          background: '#fff',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        {projects.length === 0 ? (
          <p>У вас пока нет проектов.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 16,
            }}
          >
            {projects.map(proj => (
              <div 
                key={proj.id} 
                style={{
                  padding: 12,
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  background: '#f9f9f9',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <strong>{proj.title}</strong>
                <p>{proj.description}</p>
              </div>
            ))}
          </div>
        )}
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
