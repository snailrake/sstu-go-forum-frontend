import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
    const [tokens, setTokens] = useState({
        access_token: localStorage.getItem('access_token') || '',
        refresh_token: localStorage.getItem('refresh_token') || '',
    });

    const navigate = useNavigate(); // Добавим useNavigate для редиректа

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setTokens({ access_token: '', refresh_token: '' });

        // Перенаправляем пользователя на страницу входа после логаута
        navigate('/login');
    };

    const handleLogin = () => {
        navigate('/login'); // Редирект на страницу логина
    };

    return (
        <div className="app-container">
            <nav className="nav">
                <ul>
                    <li><Link to="/">Главная</Link></li>
                    <li><Link to="/chat">Чат</Link></li>
                </ul>
                {!tokens.access_token ? (
                    <button onClick={handleLogin} className="login-button">Войти</button> // Показываем кнопку "Войти"
                ) : (
                    <button onClick={handleLogout} className="logout-button">Выйти</button> // Показываем кнопку "Выйти"
                )}
            </nav>
            <div className="content">
                <Routes>
                    <Route path="/" element={<h2>Главная страница</h2>} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login setTokens={setTokens} />} />
                    <Route path="/chat" element={<Chat />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
