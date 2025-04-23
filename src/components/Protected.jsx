import React, { useEffect, useState } from 'react';
import { getProtectedData, refreshToken } from '../api';

function Protected() {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        const refreshTokenVal = localStorage.getItem('refresh_token');

        const fetchData = async () => {
            try {
                const response = await getProtectedData(accessToken);
                setData(response.data);
            } catch (err) {
                if (err.response && err.response.status === 401 && refreshTokenVal) {
                    try {
                        const refreshResponse = await refreshToken(refreshTokenVal);
                        const { access_token, refresh_token } = refreshResponse.data;
                        localStorage.setItem('access_token', access_token);
                        localStorage.setItem('refresh_token', refresh_token);

                        const retryResponse = await getProtectedData(access_token);
                        setData(retryResponse.data);
                    } catch (refreshErr) {
                        setError('Ошибка при обновлении токена');
                    }
                } else {
                    setError('Ошибка при получении данных');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading && !error) {
        return (
            <div className="form-container">
                <h2>Защищенные данные</h2>
                <p>Загрузка...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="form-container">
                <h2>Защищенные данные</h2>
                <p className="error">{error}</p>
            </div>
        );
    }

    return (
        <div className="form-container">
            <h2>Защищенные данные</h2>
            {data ? (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>Нет данных</p>
            )}
        </div>
    );
}

export default Protected;
