import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import TopicList from './components/TopicList';
import PostList from './components/PostList';
import CommentList from './components/CommentList';

function App() {
    const [tokens, setTokens] = useState({
        access_token: localStorage.getItem('access_token') || '',
        refresh_token: localStorage.getItem('refresh_token') || '',
    });
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const location = useLocation(); // To get the current path

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setTokens({ access_token: '', refresh_token: '' });
        navigate('/login');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className={`app-container ${isPanelOpen ? 'panel-open' : ''}`}>
            <nav className="nav">
                <ul>
                    <li><Link to="/">Главная</Link></li>
                </ul>
                {!tokens.access_token ? (
                    <button onClick={handleLogin} className={`login-button ${isPanelOpen ? 'shifted' : ''}`}>Войти</button>
                ) : (
                    <button onClick={handleLogout} className={`logout-button ${isPanelOpen ? 'shifted' : ''}`}>Выйти</button>
                )}
            </nav>
            <div className="main-container">
                {/* Conditionally render TopicList only when not on the login page */}
                {location.pathname !== '/login' && location.pathname !== '/register' && (
                    <aside className="sidebar">
                        <TopicList />
                    </aside>
                )}
                <main className="content">
                    <Chat setIsPanelOpen={setIsPanelOpen} />
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login setTokens={setTokens} />} />
                        <Route path="/topic/:topicId" element={<PostList />} />
                        <Route path="/topic/:topicId/post/:postId" element={<CommentList />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;
