import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';
const AUTH_BASE_URL = 'http://localhost:8081';

// Отдельный экземпляр для авторизации (register, login, refresh)
const authApi = axios.create({ baseURL: AUTH_BASE_URL });

// Основной экземпляр для остальных запросов
const api = axios.create({ baseURL: API_BASE_URL });

// Парсер JWT-токена, возвращает payload или null
export function parseJwt(token) {
    try {
        const base64 = token.split('.')[1];
        const jsonPayload = decodeURIComponent(
            atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

let isRefreshing = false;
let subscribers = [];

// Подписаться на событие, когда токен обновится
function subscribe(cb) {
    subscribers.push(cb);
}

// Уведомить всех подписчиков о новом токене
function onRefreshed(token) {
    subscribers.forEach(cb => cb(token));
    subscribers = [];
}

// Интерсептор для основного api — ставит Authorization и обновляет токен при необходимости
api.interceptors.request.use(async config => {
    let token = localStorage.getItem('access_token');
    if (token) {
        const decoded = parseJwt(token);
        if (decoded && decoded.exp && Date.now() >= decoded.exp * 1000) {
            const refresh = localStorage.getItem('refresh_token');
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const { data } = await authApi.post('/refresh', { refresh_token: refresh });
                    const { access_token: newAccess, refresh_token: newRefresh } = data;
                    localStorage.setItem('access_token', newAccess);
                    localStorage.setItem('refresh_token', newRefresh);
                    token = newAccess;
                    onRefreshed(newAccess);
                } catch (err) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }
            return new Promise(resolve => {
                subscribe(newToken => {
                    config.headers.Authorization = `Bearer ${newToken}`;
                    resolve(config);
                });
            });
        }
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

// Экспорт функций для UI

export const registerUser = (username, password) =>
    authApi.post('/register', { username, password, role: 'USER' });

export const registerAdmin = (username, password) =>
    authApi.post('/register', { username, password, role: 'ADMIN' });

export const loginUser = (username, password) =>
    authApi.post('/login', { username, password });

export const refreshToken = refreshTokenValue =>
    authApi.post('/refresh', { refresh_token: refreshTokenValue });

// Основное API на 8080
export const getAllTopics = () =>
    api.get('/topics');

export const createTopic = (title, description) =>
    api.post('/topics/create', { title, description });

export const getAllPosts = () =>
    api.get('/posts/all');

export const getPostsByTopic = (topicId) =>
    api.get(`/posts?topic_id=${topicId}`);

export const createPost = (topicId, title, content) =>
    api.post('/posts/create', { topic_id: parseInt(topicId), title, content });

export const getCommentsByPost = (postId) =>
    api.get(`/comments?post_id=${postId}`);

export const createComment = (postId, content) =>
    api.post('/comments/create', { post_id: parseInt(postId), content });

export const getAllMessages = async (token) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/chat/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (err) {
        console.error('Ошибка при загрузке сообщений:', err);
        throw err;
    }
};

export const deleteTopic = (id) =>
    api.delete('/topics/delete', { params: { id } });

export const deletePost = id =>
    api.delete('/posts/delete', { params: { post_id: id } })

export const deleteComment = id =>
    api.delete('/comments/delete', { params: { comment_id: id } })


export default api;
