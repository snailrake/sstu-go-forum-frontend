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
            if (response.data) {
                setTopics(response.data); // If response.data is not null or undefined, set it
            } else {
                setTopics([]); // Set an empty array if response.data is null or undefined
            }
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
            if (response.data) {
                setTopics(response.data);
            } else {
                setTopics([]);
            }
            setShowModal(false); // Close modal after adding topic
        }
    };

    return (
        <div>
            <h2>Список тем</h2>
            <button onClick={() => setShowModal(true)} className="add-topic-button">Добавить тему</button>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Добавить новую тему</h3>
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
                        <button onClick={() => setShowModal(false)} className="close-modal">Закрыть</button>
                    </div>
                </div>
            )}

            {/* Render topics */}
            {topics.length === 0 ? (
                <p>Нет доступных тем.</p> // Display a message when there are no topics
            ) : (
                <ul className="topics-list">
                    {topics.map((topic) => (
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
