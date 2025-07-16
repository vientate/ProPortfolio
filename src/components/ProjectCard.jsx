import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaEye, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { doc, updateDoc, increment, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function ProjectCard({ project, onProjectUpdate }) {
  const [user] = useAuthState(auth);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likes, setLikes] = useState(project.likes || 0);
  const [views, setViews] = useState(project.views || 0);
  const [loading, setLoading] = useState(false);

  // Проверяем статус лайка и избранного при загрузке
  useEffect(() => {
    if (user && project.id) {
      checkUserInteractions();
    }
  }, [user, project.id]);

  const checkUserInteractions = async () => {
    if (!user) return;

    try {
      // Проверяем лайк
      const likeDoc = await getDoc(doc(db, 'likes', `${user.uid}_${project.id}`));
      setIsLiked(likeDoc.exists());

      // Проверяем избранное
      const favoriteDoc = await getDoc(doc(db, 'favorites', `${user.uid}_${project.id}`));
      setIsFavorited(favoriteDoc.exists());
    } catch (error) {
      console.error('Ошибка при проверке взаимодействий:', error);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user || loading) return;
    
    setLoading(true);
    
    try {
      const likeDocRef = doc(db, 'likes', `${user.uid}_${project.id}`);
      const projectDocRef = doc(db, 'projects', project.id);
      
      if (isLiked) {
        // Убираем лайк
        await deleteDoc(likeDocRef);
        await updateDoc(projectDocRef, {
          likes: increment(-1)
        });
        setLikes(prev => prev - 1);
        setIsLiked(false);
      } else {
        // Добавляем лайк
        await setDoc(likeDocRef, {
          userId: user.uid,
          projectId: project.id,
          createdAt: new Date()
        });
        await updateDoc(projectDocRef, {
          likes: increment(1)
        });
        setLikes(prev => prev + 1);
        setIsLiked(true);
        
        // Добавляем уведомление автору проекта (если это не сам автор)
        if (project.authorId !== user.uid) {
          await addNotification(project.authorId, 'like', `${user.displayName || 'Пользователь'} лайкнул ваш проект "${project.title}"`);
        }
      }
      
      if (onProjectUpdate) {
        onProjectUpdate(project.id, { likes: isLiked ? likes - 1 : likes + 1 });
      }
    } catch (error) {
      console.error('Ошибка при лайке:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user || loading) return;
    
    setLoading(true);
    
    try {
      const favoriteDocRef = doc(db, 'favorites', `${user.uid}_${project.id}`);
      
      if (isFavorited) {
        // Убираем из избранного
        await deleteDoc(favoriteDocRef);
        setIsFavorited(false);
      } else {
        // Добавляем в избранное
        await setDoc(favoriteDocRef, {
          userId: user.uid,
          projectId: project.id,
          projectTitle: project.title,
          projectAuthor: project.author,
          projectImage: project.imageUrl,
          createdAt: new Date()
        });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Ошибка при добавлении в избранное:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    // Увеличиваем просмотры при клике на проект
    try {
      const projectDocRef = doc(db, 'projects', project.id);
      await updateDoc(projectDocRef, {
        views: increment(1)
      });
      setViews(prev => prev + 1);
    } catch (error) {
      console.error('Ошибка при увеличении просмотров:', error);
    }
  };

  const addNotification = async (userId, type, message) => {
    try {
      const notificationRef = doc(db, 'notifications', `${userId}_${Date.now()}`);
      await setDoc(notificationRef, {
        userId,
        type,
        message,
        read: false,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Ошибка при добавлении уведомления:', error);
    }
  };

  return (
    <div className="project-card">
      <Link to={`/projects/${project.id}`} className="project-link" onClick={handleClick}>
        <div className="project-image">
          <img src={project.imageUrl} alt={project.title} />
          {user && (
            <div className="project-actions">
              <button
                className={`action-btn favorite-btn ${isFavorited ? 'active' : ''}`}
                onClick={handleFavorite}
                disabled={loading}
                title={isFavorited ? 'Убрать из избранного' : 'Добавить в избранное'}
              >
                {isFavorited ? <FaBookmark /> : <FaRegBookmark />}
              </button>
            </div>
          )}
        </div>
        <div className="project-content">
          <h3>{project.title}</h3>
          <p className="project-author">Автор: {project.author}</p>
          <p className="project-description">{project.description}</p>
          
          <div className="project-tags">
            {project.tags?.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
          
          <div className="project-meta">
            <div className="meta-item">
              <FaStar className="meta-icon" />
              <span>{project.rating || 0} ({project.reviewsCount || 0})</span>
            </div>
            <div className="meta-item">
              <button
                className={`like-button ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
                disabled={loading || !user}
                title={user ? (isLiked ? 'Убрать лайк' : 'Лайкнуть') : 'Войдите для лайка'}
              >
                {isLiked ? <FaHeart className="meta-icon liked" /> : <FaRegHeart className="meta-icon" />}
                <span>{likes}</span>
              </button>
            </div>
            <div className="meta-item">
              <FaEye className="meta-icon" />
              <span>{views}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProjectCard;