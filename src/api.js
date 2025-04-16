import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080' // укажите URL вашего backend-а
});

export const registerUser = (username, password) => {
    return api.post('/register', { username, password });
};

export const loginUser = (username, password) => {
    return api.post('/login', { username, password });
};

export const refreshToken = (refreshToken) => {
    return api.post('/refresh', { refresh_token: refreshToken });
};

export const getProtectedData = (accessToken) => {
    return api.get('/protected', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
};

export default api;
