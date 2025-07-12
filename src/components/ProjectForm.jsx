import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectForm.css';

function ProjectForm({ onSubmit, initialData = {} }) {
  const navigate = useNavigate();

  const [project, setProject] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    tags: initialData.tags?.join(', ') || '',
    isPublic: initialData.isPublic || false,
    coverImage: initialData.coverImage || '',
    gallery: initialData.gallery || [],
    github: initialData.github || '',
    website: initialData.website || '',
    youtube: initialData.youtube || '',
  });

  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target.result;
      setProject((prev) =>
        type === 'cover'
          ? { ...prev, coverImage: result }
          : { ...prev, gallery: [...prev.gallery, result] }
      );
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = project.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    await onSubmit({ ...project, tags: tagsArray });

    alert('Проект успешно сохранён!');
    navigate('/account');
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <h2>Создание проекта</h2>

      <div className="form-group">
        <label>Обложка проекта</label>
        <div
          className="cover-preview"
          onClick={() => coverInputRef.current.click()}
          style={{
            backgroundImage: project.coverImage ? `url(${project.coverImage})` : 'none',
          }}
        >
          {!project.coverImage && <span>Нажмите для загрузки</span>}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={coverInputRef}
          onChange={(e) => handleImageChange(e, 'cover')}
          hidden
        />
      </div>

      <div className="form-group">
        <label>Название проекта</label>
        <input
          type="text"
          value={project.title}
          onChange={(e) => setProject({ ...project, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Описание</label>
        <textarea
          rows="4"
          value={project.description}
          onChange={(e) => setProject({ ...project, description: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Теги (через запятую)</label>
        <input
          type="text"
          value={project.tags}
          onChange={(e) => setProject({ ...project, tags: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Галерея изображений</label>
        <button
          type="button"
          className="button"
          onClick={() => galleryInputRef.current.click()}
        >
          Добавить изображение
        </button>
        <input
          type="file"
          accept="image/*"
          ref={galleryInputRef}
          onChange={(e) => handleImageChange(e, 'gallery')}
          hidden
        />
        <div className="gallery">
          {project.gallery.map((img, i) => (
            <img key={i} src={img} alt={`gallery-${i}`} />
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>GitHub</label>
        <input
          type="url"
          value={project.github}
          onChange={(e) => setProject({ ...project, github: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Веб-сайт</label>
        <input
          type="url"
          value={project.website}
          onChange={(e) => setProject({ ...project, website: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>YouTube</label>
        <input
          type="url"
          value={project.youtube}
          onChange={(e) => setProject({ ...project, youtube: e.target.value })}
        />
      </div>

      <div className="form-group checkbox">
        <input
          type="checkbox"
          id="public"
          checked={project.isPublic}
          onChange={(e) => setProject({ ...project, isPublic: e.target.checked })}
        />
        <label htmlFor="public">Сделать проект публичным</label>
      </div>

      <div className="form-group">
        <button type="submit" className="submit-btn">Сохранить проект</button>
      </div>
    </form>
  );
}

export default ProjectForm;
