// src/components/CommentList.jsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getCommentsByPost, createComment, getPostsByTopic, deleteComment, parseJwt } from '../api'

function CommentList() {
    const { postId, topicId } = useParams()
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [newContent, setNewContent] = useState('')
    const token = localStorage.getItem('access_token')
    const decoded = token ? parseJwt(token) : null
    const isAdmin = decoded?.role === 'ADMIN'

    useEffect(() => {
        async function fetchData() {
            const postRes = await getPostsByTopic(topicId)
            const found = postRes.data.find(p => p.id === parseInt(postId, 10))
            setPost(found)
            const cmRes = await getCommentsByPost(postId)
            setComments(cmRes.data || [])
        }
        fetchData()
    }, [postId, topicId])

    const handleCreateComment = async e => {
        e.preventDefault()
        if (newContent.trim()) {
            await createComment(postId, newContent)
            setNewContent('')
            const res = await getCommentsByPost(postId)
            setComments(res.data || [])
        }
    }

    const handleDeleteComment = async id => {
        if (window.confirm('Удалить комментарий?')) {
            await deleteComment(id)
            const res = await getCommentsByPost(postId)
            setComments(res.data || [])
        }
    }

    return (
        <div className="comment-container">
            {post ? (
                <div className="post-detail">
                    <h2>{post.title}</h2>
                    <p style={{ whiteSpace: 'pre-line' }}>{post.content}</p>
                    <p><em><strong>Опубликовано:</strong> {new Date(post.timestamp).toLocaleString()}</em></p>
                </div>
            ) : (
                <p>Загружается пост...</p>
            )}

            <h3>Комментарии</h3>
            {comments.length === 0 ? (
                <p>Пока нет комментариев.</p>
            ) : (
                <div className="comments-list">
                    {comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            <strong>{comment.username || 'Аноним'}:</strong>
                            <p>{comment.content}</p>
                            <span className="comment-date">{new Date(comment.timestamp).toLocaleString()}</span>
                            {isAdmin && (
                                <button
                                    className="delete-comment-button"
                                    onClick={() => handleDeleteComment(comment.id)}
                                >
                                    −
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <h3>Добавить комментарий</h3>
            <form onSubmit={handleCreateComment} className="comment-form">
        <textarea
            placeholder="Комментарий"
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            required
        />
                <button type="submit">Добавить</button>
            </form>
        </div>
    )
}

export default CommentList
