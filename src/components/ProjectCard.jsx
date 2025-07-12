import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaEye } from 'react-icons/fa';

function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <Link to={`/projects/${project.id}`} className="project-link">
        <div className="project-image">
          <img src={project.imageUrl} alt={project.title} />
        </div>
        <div className="project-content">
          <h3>{project.title}</h3>
          <p className="project-author">Автор: {project.author}</p>
          <p className="project-description">{project.description}</p>
          
          <div className="project-tags">
            {project.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
          
          <div className="project-meta">
            <div className="meta-item">
              <FaStar className="meta-icon" />
              <span>{project.rating} ({project.reviewsCount})</span>
            </div>
            <div className="meta-item">
              <FaHeart className="meta-icon" />
              <span>{project.likes}</span>
            </div>
            <div className="meta-item">
              <FaEye className="meta-icon" />
              <span>{project.views}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProjectCard;