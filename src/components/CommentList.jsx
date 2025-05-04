import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCommentsByPost, createComment, getPostsByTopic } from '../api';

function CommentList() {
    const { postId } = useParams();
    const { topicId } = useParams();
    const [post, setPost] = useState(null); // Для хранения поста
    const [comments, setComments] = useState([]);
    const [newContent, setNewContent] = useState('');

    // Загрузка поста и комментариев
    useEffect(() => {
        async function fetchPostAndComments() {
            // Сначала загружаем пост
            const postResponse = await getPostsByTopic(topicId);
            const post = postResponse.data.find(p => p.id === parseInt(postId)); // Найдём пост по ID
            setPost(post);

            // Затем загружаем комментарии
            const commentsResponse = await getCommentsByPost(postId);
            setComments(commentsResponse.data || []); // Обрабатываем null и преобразуем в пустой массив
        }
        fetchPostAndComments();
    }, [postId, topicId]);

    const handleCreateComment = async (e) => {
        e.preventDefault();
        if (newContent.trim()) {
            // Отправляем комментарий с добавленным username
            await createComment(postId, newContent);
            setNewContent('');
            // Обновим список комментариев
            const response = await getCommentsByPost(postId);
            setComments(response.data || []); // Преобразуем в пустой массив, если null
        }
    };

    return (
        <div>
            {/* Проверяем, есть ли пост, и если он есть — отображаем его */}
            {post ? (
                <div>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <p><em>Опубликовано {new Date(post.timestamp).toLocaleString()}</em></p>
                </div>
            ) : (
                <p>Загружается пост...</p>
            )}

            <h3>Комментарии</h3>
            {/* Если комментариев нет, показываем "Пока нет комментариев", иначе показываем список комментариев */}
            {comments.length === 0 ? (
                <p>Пока нет комментариев.</p>
            ) : (
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id}>
                            <strong>{comment.username ? comment.username : 'Аноним'}: </strong>
                            {comment.content}
                        </li>
                    ))}
                </ul>
            )}

            {/* Форма для добавления комментария */}
            <h3>Добавить комментарий</h3>
            <form onSubmit={handleCreateComment}>
                <textarea
                    placeholder="Комментарий"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    required
                />
                <button type="submit">Добавить</button>
            </form>
        </div>
    );
}

export default CommentList;
