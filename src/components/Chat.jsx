import React, { useState, useEffect, useRef } from 'react';
import { getAllMessages } from '../api'; // Функция для получения всех сообщений с сервера
import SlidePanel from './SlidePanel'; // Импортируем ваш компонент панели

function Chat({ setIsPanelOpen }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState('');  // Состояние для имени пользователя
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // Состояние для авторизации
    const [isPanelOpenLocal, setIsPanelOpenLocal] = useState(false);  // Состояние для панели чата (локальное)

    const messagesEndRef = useRef(null);  // Реф для контейнера сообщений
    const panelRef = useRef(null);  // Реф для панели чата

    // Обработчик клика вне панели чата
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsPanelOpen(false);
                setIsPanelOpenLocal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUsername(decodedToken.username);
            setIsAuthenticated(true);
        }

        getAllMessages(token).then(data => {
            setMessages(data);
        }).catch(error => {
            console.error('Ошибка при получении сообщений с сервера:', error);
        });

        const newSocket = new WebSocket(`ws://localhost:8080/chat?token=${token || ''}`);
        setSocket(newSocket);

        newSocket.onopen = () => {
            console.log('WebSocket соединение установлено');
        };

        newSocket.onmessage = (event) => {
            try {
                const newMessage = JSON.parse(event.data);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { content: newMessage.content, username: newMessage.username }
                ]);
            } catch (error) {
                console.error('Ошибка при парсинге сообщения:', error);
            }
        };

        newSocket.onerror = (error) => {
            console.error('WebSocket Error: ', error);
        };

        return () => {
            newSocket.close();
        };
    }, []);

    const sendMessage = () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert("Вы не авторизованы, отправка сообщений невозможна.");
            return;
        }

        if (message.trim() !== '') {
            socket.send(message);
            setMessage('');
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div ref={panelRef}> {/* Используем ref для панели чата */}
            <button onClick={() => { setIsPanelOpen(true); setIsPanelOpenLocal(true); }} style={styles.openButton}>
                Чат
            </button>

            <SlidePanel isOpen={isPanelOpenLocal} onClose={() => { setIsPanelOpen(false); setIsPanelOpenLocal(false); }}>
                <div style={styles.chatContainer}>
                    <div style={{ ...styles.messages, flexGrow: isAuthenticated ? 1 : 2 }}> {/* Условный стиль для сообщений */}
                        {messages.map((msg, index) => (
                            <div key={index}>
                                <strong>{msg.username}: </strong>{msg.content}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {isAuthenticated && (
                        <div style={styles.inputContainer}>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Введите сообщение"
                                style={styles.input}
                            />
                            <button onClick={sendMessage} style={styles.sendButton}>
                                Отправить
                            </button>
                        </div>
                    )}
                </div>
            </SlidePanel>
        </div>
    );
}

const styles = {
    openButton: {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#007acc',
        color: 'white',
        fontSize: '24px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    chatContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    messages: {
        flex: 1,
        maxHeight: 'calc(100vh - 100px)',  // Уменьшаем отступ
        overflowY: 'auto',
        padding: '10px',
        marginBottom: '10px',
        wordWrap: 'break-word',
        whiteSpace: 'normal',
    },
    inputContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        background: '#fff',
        borderTop: '1px solid #ccc',
        width: '100%',
        boxSizing: 'border-box',
    },
    input: {
        flex: 1,
        padding: '10px',
        marginRight: '10px',
        maxWidth: 'calc(100% - 120px)', // Убираем лишний горизонтальный скролл
        boxSizing: 'border-box',
    },
    sendButton: {
        padding: '10px',
        backgroundColor: '#007acc',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        width: '100px',
        boxSizing: 'border-box',
    },
};

export default Chat;
