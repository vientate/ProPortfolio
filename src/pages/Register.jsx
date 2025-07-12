import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import '../App.css';

function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5-5"/>
      <path d="M1 1l22 22"/>
      <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/.test(password);

  const firebaseErrorMap = {
    'auth/email-already-in-use': 'Такой email уже зарегистрирован.',
    'auth/invalid-email': 'Неверный формат email.',
    'auth/weak-password': 'Слабый пароль. Используйте более сложный.',
    'auth/missing-password': 'Введите пароль.',
    'auth/network-request-failed': 'Нет подключения к интернету.',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Введите корректный email.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Пароль должен быть длиннее 12 символов и содержать строчные и ПРОПИСНЫЕ буквы, цифры и специальные символы.');
      return;
    }

    if (password !== repeatPassword) {
      setError('Пароли не совпадают.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      navigate('/projects');
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      const friendlyMessage = firebaseErrorMap[err.code] || 'Ошибка при регистрации. Попробуйте позже.';
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h1 className="auth-title">Регистрация в ProPortfolio</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
            placeholder="Придумайте пароль"
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
        <div className="password-field">
          <input
            type={showRepeatPassword ? 'text' : 'password'}
            placeholder="Повторите пароль"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
            aria-label={showRepeatPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            <EyeIcon open={showRepeatPassword} />
          </button>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        {error && <p className="auth-error">{error}</p>}
      </form>
      <p className="auth-link">
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}

export default Register;
