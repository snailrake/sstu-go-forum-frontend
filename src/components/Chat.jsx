// components/Chat.jsx
import React, { useEffect, useState, useRef } from 'react';
import { getAllMessages } from '../api'; // Функция для получения всех сообщений с сервера

function Chat() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState('');  // Состояние для имени пользователя
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // Состояние для авторизации
    const messagesEndRef = useRef(null);  // Реф для контейнера сообщений

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (token) {
            // Извлекаем имя пользователя из токена
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Расшифровка токена
            setUsername(decodedToken.username);  // Устанавливаем имя пользователя
            setIsAuthenticated(true);  // Если токен есть, пользователь авторизован
        }

        // Получаем все сообщения с сервера при загрузке страницы
        getAllMessages(token).then(data => {
            setMessages(data);
        }).catch(error => {
            console.error('Ошибка при получении сообщений с сервера:', error);
        });

        // Создаем WebSocket соединение, передавая токен как параметр URL
        const newSocket = new WebSocket(`ws://localhost:8080/chat?token=${token || ''}`);
        setSocket(newSocket);

        // Слушаем события установления соединения WebSocket
        newSocket.onopen = () => {
            console.log('WebSocket соединение установлено');
        };

        // Слушаем события новых сообщений
        newSocket.onmessage = (event) => {
            try {
                const newMessage = JSON.parse(event.data);  // Это теперь объект с полями username и content
                console.log('Новое сообщение:', newMessage);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { content: newMessage.content, username: newMessage.username }
                ]);  // Добавляем сообщение с правильным именем пользователя
            } catch (error) {
                console.error('Ошибка при парсинге сообщения:', error);
            }
        };

        newSocket.onerror = (error) => {
            console.error('WebSocket Error: ', error);
        };

        // Очистка WebSocket при размонтировании компонента
        return () => {
            newSocket.close();
        };
    }, []);

    // Функция отправки сообщения
    const sendMessage = () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert("Вы не авторизованы, отправка сообщений невозможна.");
            return;
        }

        if (message.trim() !== '') {
            socket.send(message);  // Отправляем сообщение на сервер
            console.log('Сообщение отправлено:', message);
            setMessage(''); // Очищаем поле ввода после отправки
        }
    };

    // Прокручиваем сообщения в самый низ
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]); // Каждый раз, когда список сообщений обновляется, прокручиваем вниз

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.username}: </strong>{msg.content} {/* Отображаем имя пользователя и его сообщение */}
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* Этот элемент всегда будет внизу чата */}
            </div>
            {isAuthenticated && ( // Показываем элементы ввода и кнопку только для авторизованных пользователей
                <div className="chat-input">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)} // Обновляем состояние для текущего сообщения
                        placeholder="Введите сообщение"
                    />
                    <button onClick={sendMessage}>Отправить</button>
                </div>
            )}
        </div>
    );
}

export default Chat;
