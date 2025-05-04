import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import TopicList from './components/TopicList'; // Компонент для списка тем
import PostList from './components/PostList'; // Компонент для списка постов
import CommentList from './components/CommentList'; // Компонент для списка комментариев

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
                    <li><Link to="/">Главная</Link></li> {/* Ссылка на главную страницу */}
                    {/* Здесь можно добавить другие ссылки для навигации */}
                </ul>
                {!tokens.access_token ? (
                    <button onClick={handleLogin} className={`login-button ${isPanelOpen ? 'shifted' : ''}`}>Войти</button>
                ) : (
                    <button onClick={handleLogout} className={`logout-button ${isPanelOpen ? 'shifted' : ''}`}>Выйти</button>
                )}
            </nav>
            <div className="content">
                {/* Чат всегда будет отображаться на всех страницах */}
                <Chat setIsPanelOpen={setIsPanelOpen} />
                <Routes>
                    <Route path="/" element={<TopicList />} /> {/* Список тем */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login setTokens={setTokens} />} />
                    <Route path="/topic/:topicId" element={<PostList />} /> {/* Посты для выбранной темы */}
                    <Route path="/topic/:topicId/post/:postId" element={<CommentList />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
