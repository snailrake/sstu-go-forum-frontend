import React, { useEffect, useState } from 'react';
import api from '../api';

function Protected() {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await api.get('/protected');
                setData(resp.data);
            } catch (err) {
                setError('Ошибка при получении данных');
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
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Нет данных</p>}
        </div>
    );
}

export default Protected;
