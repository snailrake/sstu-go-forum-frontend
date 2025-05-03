import axios from 'axios';

const baseURL = 'http://localhost:8080';

// Отдельный экземпляр без интерсепторов для refresh
const authApi = axios.create({ baseURL });

// Основной экземпляр для всех запросов
const api = axios.create({ baseURL });

// Парсер JWT-токена, возвращает payload или null
function parseJwt(token) {
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

// Подписаться на событие, когда refresh завершится
function subscribe(cb) {
    subscribers.push(cb);
}

// Уведомить всех ожидающих новых токенов
function onRefreshed(token) {
    subscribers.forEach(cb => cb(token));
    subscribers = [];
}

// Интерсептор перед каждым запросом
api.interceptors.request.use(async config => {
    let token = localStorage.getItem('access_token');
    if (token) {
        const decoded = parseJwt(token);
        // Если истёк
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
                    // если refresh упал — чистим всё и кидаем на логин
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }
            // ждём, пока токен обновится
            return new Promise(resolve => {
                subscribe(newToken => {
                    config.headers.Authorization = `Bearer ${newToken}`;
                    resolve(config);
                });
            });
        }
        // если не истёк — просто пушим
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

// Экспортируем функции для UI
export const registerUser = (username, password) =>
    api.post('/register', { username, password });

export const loginUser = (username, password) =>
    api.post('/login', { username, password });

export const refreshToken = refreshTokenValue =>
    authApi.post('/refresh', { refresh_token: refreshTokenValue });

// По-умолчанию всё, что не описано выше, идёт через этот экземпляр
export default api;
