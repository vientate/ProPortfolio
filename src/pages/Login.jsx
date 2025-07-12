import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import '../App.css';

function EyeIcon({ open }) {
  return open ? (
    // Открытый глаз
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    // Перечёркнутый глаз
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5-5" />
      <path d="M1 1l22 22" />
      <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
      <path d="M9.88 9.88L1 1" />
      <path d="M21 21l-5.5-5.5" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/.test(password);

  // Словарь с ошибками Firebase
  const firebaseErrorMap = {
    'auth/user-not-found': 'Пользователь не найден.',
    'auth/wrong-password': 'Неверный пароль.',
    'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже.',
    'auth/invalid-email': 'Некорректный email.',
    'auth/invalid-login-credentials': 'Неверный email или пароль.',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Введите корректный email.');
      return;
    }

    if (!validatePassword(password)) {
      setError(
        'Пароль должен быть длиннее 12 символов и содержать строчные и ПРОПИСНЫЕ буквы, цифры и специальные символы.'
      );
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/projects');
    } catch (err) {
      console.error('Ошибка входа:', err);
      const friendlyError = firebaseErrorMap[err.code] || 'Не удалось войти, попробуйте снова.';
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h1 className="auth-title">Вход в ProPortfolio</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Ваш пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner"></span> : 'Войти'}
        </button>
        {error && <p className="auth-error">{error}</p>}
      </form>
      <p className="auth-link">
        Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
      </p>
    </div>
  );
}

export default Login;
