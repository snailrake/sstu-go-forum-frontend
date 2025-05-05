// src/components/PostList.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllPosts, getPostsByTopic, createPost } from '../api';

function PostList() {
    const { topicId } = useParams();
    const [posts, setPosts] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function fetchPosts() {
            const res = topicId
                ? await getPostsByTopic(topicId)
                : await getAllPosts();
            setPosts(res.data || []);
        }
        fetchPosts();
    }, [topicId]);

    const handleCreatePost = async e => {
        e.preventDefault();
        if (!topicId) return; // на всякий случай
        if (newTitle.trim() && newContent.trim()) {
            await createPost(topicId, newTitle, newContent);
            setNewTitle('');
            setNewContent('');
            const res = await getPostsByTopic(topicId);
            setPosts(res.data || []);
            setIsModalOpen(false);
        }
    };

    const closeModal = e => {
        if (e.target.classList.contains('modal-overlay')) {
            setIsModalOpen(false);
        }
    };

    return (
        <div>
            <div className="post-header">
                <h2>Посты</h2>
                {/* Показываем кнопку только если выбран topicId */}
                {topicId && (
                    <button
                        className="add-post-button"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Добавить пост
                    </button>
                )}
            </div>

            {/* Модалка тоже только для конкретной темы */}
            {isModalOpen && topicId && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div
                        className="modal-container"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3>Добавить пост</h3>
                        <form onSubmit={handleCreatePost} className="post-form">
                            <input
                                type="text"
                                placeholder="Заголовок"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Содержание"
                                value={newContent}
                                onChange={e => setNewContent(e.target.value)}
                                required
                            />
                            <button type="submit">Добавить</button>
                        </form>
                    </div>
                </div>
            )}

            {posts.length === 0 ? (
                <p>Нет постов для отображения.</p>
            ) : (
                <div className="post-list">
                    {posts.map(post => (
                        <div key={post.id} className="post-item">
                            <h3 className="post-title">
                                <Link
                                    to={
                                        topicId
                                            ? `/topic/${topicId}/post/${post.id}`
                                            : `/topic/${post.topic_id}/post/${post.id}`
                                    }
                                >
                                    {post.title}
                                </Link>
                            </h3>
                            <p className="post-content">
                                {post.content.length > 150
                                    ? post.content.slice(0, 150) + '…'
                                    : post.content}
                            </p>
                            <div className="post-meta">
                                <span className="post-author">Автор: {post.username}</span>
                                <span className="post-date">
                  {new Date(post.timestamp).toLocaleString()}
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
