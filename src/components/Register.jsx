import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(username, password);
            navigate('/login');
        } catch (err) {
            setError('Ошибка при регистрации');
        }
    };

    return (
        <div className="form-container">
            <h2>Регистрация</h2>
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
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
}

export default Register;
