import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';

function Login({ setTokens }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(username, password);
            const { access_token, refresh_token } = response.data;
            setTokens({ access_token, refresh_token });
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            navigate('/');
        } catch (err) {
            setError('Неверные учетные данные');
        }
    };

    return (
        <div className="form-container">
            <h2>Вход</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error">{error}</p>}
                <button type="submit" className="full-width-button">
                    Войти
                </button>
            </form>
            <p>
                <span onClick={() => navigate('/register')} className="link">Зарегистрироваться</span>
            </p>
        </div>
    );
}

export default Login;
