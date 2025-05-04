import React, { useState, useEffect } from 'react';
import { getAllTopics, createTopic } from '../api';

function TopicList() {
    const [topics, setTopics] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');

    useEffect(() => {
        async function fetchTopics() {
            const response = await getAllTopics();
            setTopics(response.data);
        }
        fetchTopics();
    }, []);

    const handleCreateTopic = async (e) => {
        e.preventDefault();
        if (newTitle.trim() && newDescription.trim()) {
            await createTopic(newTitle, newDescription);
            setNewTitle('');
            setNewDescription('');
            // Обновим список тем
            const response = await getAllTopics();
            setTopics(response.data);
        }
    };

    return (
        <div>
            <h2>Список тем</h2>
            <ul>
                {topics.map((topic) => (
                    <li key={topic.id}>
                        <a href={`/topic/${topic.id}`}>{topic.title}</a>
                    </li>
                ))}
            </ul>
            <h3>Добавить тему</h3>
            <form onSubmit={handleCreateTopic}>
                <input
                    type="text"
                    placeholder="Название темы"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Описание"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    required
                />
                <button type="submit">Добавить</button>
            </form>
        </div>
    );
}

export default TopicList;
