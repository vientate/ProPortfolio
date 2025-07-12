import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../App.css';

function Collaboration() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

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
          description: 'Совместная работа над улучшением функционала',
          participants: [
            { id: 'user1', name: 'Алексей Петров', role: 'Владелец' },
            { id: 'user2', name: 'Иван Иванов', role: 'Разработчик' }
          ]
        };

        const mockMessages = [
          {
            id: 1,
            author: 'Алексей Петров',
            text: 'Добро пожаловать в проект! Сегодня будем работать над компонентом задач.',
            timestamp: '2023-11-10T09:30:00'
          },
          {
            id: 2,
            author: 'Иван Иванов',
            text: 'Хорошо, я как раз занимался этим вчера. Какие конкретно изменения нужны?',
            timestamp: '2023-11-10T09:35:00'
          }
        ];

        setProject(mockProject);
        setMessages(mockMessages);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки проекта:', error);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const message = {
      id: messages.length + 1,
      author: 'Вы', // В реальном приложении - текущий пользователь
      text: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  if (loading) {
    return <div className="loading">Загрузка проекта...</div>;
  }

  if (!project) {
    return <div className="error">Проект не найден</div>;
  }

  return (
    <div className="collaboration-page">
      <div className="container">
        <div className="collaboration-header">
          <h1>Совместная работа: {project.title}</h1>
          <div className="participants">
            <span>Участники: </span>
            {project.participants.map(participant => (
              <span key={participant.id} className="participant">
                {participant.name} ({participant.role})
              </span>
            ))}
          </div>
        </div>

        <div className="collaboration-layout">
          <div className="code-editor">
            <h2>Редактор кода</h2>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Начните писать код здесь..."
            />
            <div className="editor-actions">
              <button className="btn-primary">Сохранить изменения</button>
              <button className="btn-secondary">Запустить тесты</button>
            </div>
          </div>

          <div className="collaboration-chat">
            <h2>Чат проекта</h2>
            <div className="messages">
              {messages.map(message => (
                <div key={message.id} className="message">
                  <div className="message-header">
                    <strong>{message.author}</strong>
                    <span>
                      {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="message-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Напишите сообщение..."
              />
              <button type="submit" className="btn-primary">
                Отправить
              </button>
            </form>
          </div>
        </div>

        <div className="collaboration-tools">
          <h2>Инструменты</h2>
          <div className="tools-grid">
            <div className="tool-card">
              <h3>Документация</h3>
              <p>Общая документация проекта</p>
              <button className="btn-secondary">Открыть</button>
            </div>
            <div className="tool-card">
              <h3>Задачи</h3>
              <p>Список текущих задач</p>
              <button className="btn-secondary">Просмотреть</button>
            </div>
            <div className="tool-card">
              <h3>Файлы</h3>
              <p>Общие файлы проекта</p>
              <button className="btn-secondary">Загрузить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collaboration;