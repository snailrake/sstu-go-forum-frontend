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
    const [isPanelOpen, setIsPanelOpen] = useState(false);  // Состояние для открытия чата

    const navigate = useNavigate(); // Для редиректа

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setTokens({ access_token: '', refresh_token: '' });
        navigate('/login');
    };

    const handleLogin = () => {
        navigate('/login'); // Редирект на страницу логина
    };

    return (
        <div className={isPanelOpen ? 'app-container panel-open' : 'app-container'}>
            <nav className="nav">
                <ul>
                    <li><Link to="/">Главная</Link></li>
                </ul>
                {/* Изменяем классы кнопок для сдвига при открытии чата */}
                {!tokens.access_token ? (
                    <button
                        onClick={handleLogin}
                        className={`login-button ${isPanelOpen ? 'shifted' : ''}`}
                    >
                        Войти
                    </button>
                ) : (
                    <button
                        onClick={handleLogout}
                        className={`logout-button ${isPanelOpen ? 'shifted' : ''}`}
                    >
                        Выйти
                    </button>
                )}
            </nav>
            <div className="content">
                <Routes>
                    <Route path="/" element={<Chat setIsPanelOpen={setIsPanelOpen} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login setTokens={setTokens} />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
