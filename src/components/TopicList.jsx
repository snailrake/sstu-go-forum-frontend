import React, { useState, useEffect } from 'react';
import { getAllTopics, createTopic } from '../api';

function TopicList() {
    const [topics, setTopics] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchTopics() {
            const response = await getAllTopics();
            setTopics(response.data || []);
        }
        fetchTopics();
    }, []);

    const handleCreateTopic = async (e) => {
        e.preventDefault();
        if (newTitle.trim() && newDescription.trim()) {
            await createTopic(newTitle, newDescription);
            setNewTitle('');
            setNewDescription('');
            const response = await getAllTopics();
            setTopics(response.data || []);
            setShowModal(false);
        }
    };

    const handleOverlayClick = (e) => {
        // Закрываем только если кликнули по overlay, а не по внутреннему .modal-content
        if (e.target.classList.contains('modal-overlay')) {
            setShowModal(false);
        }
    };

    return (
        <div>
            {/* Заголовок с плюсом */}
            <div className="topic-header">
                <h2>Темы</h2>
                <button
                    className="add-topic-button"
                    onClick={() => setShowModal(true)}
                    aria-label="Добавить тему"
                >
                    +
                </button>
            </div>

            {/* Модалка */}
            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={handleOverlayClick}
                >
                    {/* Предотвращаем всплытие клика внутрь контента */}
                    <div
                        className="modal-content"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3>Добавить новую тему</h3>
                        <form onSubmit={handleCreateTopic}>
                            <input
                                type="text"
                                placeholder="Название темы"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Описание"
                                value={newDescription}
                                onChange={e => setNewDescription(e.target.value)}
                                required
                            />
                            <button type="submit">Добавить</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Список тем */}
            {topics.length === 0 ? (
                <p>Нет доступных тем.</p>
            ) : (
                <ul className="topics-list">
                    {topics.map(topic => (
                        <li key={topic.id}>
                            <a href={`/topic/${topic.id}`}>{topic.title}</a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TopicList;
