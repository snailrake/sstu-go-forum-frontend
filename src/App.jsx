import React, { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Protected from './components/Protected'

function App() {
    const [tokens, setTokens] = useState({
        access_token: localStorage.getItem('access_token') || '',
        refresh_token: localStorage.getItem('refresh_token') || ''
    })

    return (
        <div className="app-container">
            <nav className="nav">
                <ul>
                    <li><Link to="/">Главная</Link></li>
                    <li><Link to="/register">Регистрация</Link></li>
                    <li><Link to="/login">Вход</Link></li>
                    <li><Link to="/protected">Защищенная страница</Link></li>
                </ul>
            </nav>
            <div className="content">
                <Routes>
                    <Route path="/" element={<h2>Главная страница</h2>} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login setTokens={setTokens} />} />
                    <Route path="/protected" element={<Protected />} />
                </Routes>
            </div>
        </div>
    )
}

export default App
