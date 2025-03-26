import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(username, password, email);
            console.log('Registration successful');
            setError(null);
            navigate('/products'); // Перенаправление в каталог товаров
        } catch (error) {
            console.error('Registration failed:', error);
            setError('Ошибка регистрации. Проверьте данные.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>Регистрация</h2>
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-group">
                        <label htmlFor="username">Имя пользователя</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Введите имя пользователя"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Введите email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Зарегистрироваться</button>
                </form>
            </div>
        </div>
    );
};

export default Register;