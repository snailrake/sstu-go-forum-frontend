import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostsByTopic, createPost } from '../api';

function PostList() {
    const { topicId } = useParams();
    const [posts, setPosts] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    useEffect(() => {
        async function fetchPosts() {
            const response = await getPostsByTopic(topicId);
            setPosts(response.data || []); // Если response.data == null, то ставим пустой массив
        }
        fetchPosts();
    }, [topicId]);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (newTitle.trim() && newContent.trim()) {
            await createPost(topicId, newTitle, newContent);
            setNewTitle('');
            setNewContent('');
            // Обновим список постов
            const response = await getPostsByTopic(topicId);
            setPosts(response.data || []); // Преобразуем в пустой массив, если null
        }
    };

    return (
        <div>
            <h2>Посты</h2>
            {/* Проверяем, есть ли посты */}
            {posts.length === 0 ? (
                <p>Нет постов в этой теме.</p>
            ) : (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <a href={`/topic/${topicId}/post/${post.id}`}>{post.title}</a>
                        </li>
                    ))}
                </ul>
            )}

            {/* Форма для добавления поста */}
            <h3>Добавить пост</h3>
            <form onSubmit={handleCreatePost}>
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
    );
}

export default PostList;
