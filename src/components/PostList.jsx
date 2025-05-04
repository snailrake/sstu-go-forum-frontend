import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostsByTopic, createPost } from '../api';

function PostList() {
    const { topicId } = useParams();
    const [posts, setPosts] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // Управляем открытием модального окна

    useEffect(() => {
        async function fetchPosts() {
            const response = await getPostsByTopic(topicId);
            setPosts(response.data || []); // Если response.data равно null, ставим пустой массив
        }
        fetchPosts();
    }, [topicId]);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (newTitle.trim() && newContent.trim()) {
            await createPost(topicId, newTitle, newContent);
            setNewTitle('');
            setNewContent('');
            // Обновляем список постов
            const response = await getPostsByTopic(topicId);
            setPosts(response.data || []); // Если response.data равно null, ставим пустой массив
            setIsModalOpen(false); // Закрываем модальное окно после добавления поста
        }
    };

    // Функция для закрытия модального окна при клике вне его
    const closeModal = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            setIsModalOpen(false);
        }
    };

    return (
        <div>
            <div className="post-header">
                <h2>Посты</h2>
                <button className="add-post-button" onClick={() => setIsModalOpen(true)}>
                    Добавить пост
                </button>
            </div>

            {/* Модальное окно для добавления поста */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-container">
                        <h3>Добавить пост</h3>
                        <form onSubmit={handleCreatePost} className="post-form">
                            <input
                                type="text"
                                placeholder="Заголовок"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Содержание"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                required
                            />
                            <button type="submit">Добавить</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Display a message if no posts are available */}
            {posts.length === 0 ? (
                <p>Нет постов в этой теме.</p>
            ) : (
                <div className="post-list">
                    {posts.map((post) => (
                        <div key={post.id} className="post-item">
                            <h3 className="post-title">
                                <a href={`/topic/${topicId}/post/${post.id}`}>{post.title}</a>
                            </h3>
                            <p className="post-content">{post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}</p>
                            <div className="post-meta">
                                <span className="post-author">Автор: {post.username}</span>
                                <span className="post-date">
                                    {new Date(post.timestamp).toLocaleDateString() || 'Дата не доступна'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PostList;
