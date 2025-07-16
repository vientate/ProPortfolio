import { useEffect, useRef } from 'react';
import { FaHeart, FaComment, FaUserPlus, FaEye } from 'react-icons/fa';

function NotificationDropdown({ notifications, onClose, onMarkAllRead }) {
  const dropdownRef = useRef(null);

  // Закрытие дропдауна при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <FaHeart className="notification-icon like-icon" />;
      case 'comment':
        return <FaComment className="notification-icon comment-icon" />;
      case 'follow':
        return <FaUserPlus className="notification-icon follow-icon" />;
      case 'view':
        return <FaEye className="notification-icon view-icon" />;
      default:
        return <FaBell className="notification-icon" />;
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} мин. назад`;
    } else if (hours < 24) {
      return `${hours} ч. назад`;
    } else {
      return `${days} дн. назад`;
    }
  };

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <div className="notification-header">
        <h3>Уведомления</h3>
        <button 
          className="mark-all-read-btn"
          onClick={onMarkAllRead}
        >
          Отметить все как прочитанные
        </button>
      </div>
      
      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>Уведомлений пока нет</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
            >
              <div className="notification-content">
                {getNotificationIcon(notification.type)}
                <div className="notification-text">
                  <p>{notification.message}</p>
                  <span className="notification-time">
                    {formatTime(notification.time)}
                  </span>
                </div>
              </div>
              {!notification.read && <div className="unread-dot"></div>}
            </div>
          ))
        )}
      </div>
      
      <div className="notification-footer">
        <button className="view-all-btn" onClick={onClose}>
          Посмотреть все
        </button>
      </div>
    </div>
  );
}

export default NotificationDropdown;