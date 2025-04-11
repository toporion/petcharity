import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:8080');

const FloatingChat = ({ userId }) => {
  const [adminId] = useState('67d9a319418a550493c84d2a');
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [typingStatus, setTypingStatus] = useState(false);

  useEffect(() => {
    if (!userId) return;

    socket.emit('join', userId);

    socket.on('receiveMessage', (data) => {
      if (
        (data.senderId === userId && data.receiverId === adminId) ||
        (data.receiverId === userId && data.senderId === adminId)
      ) {
        setChat((prev) => [...prev, data]);
      }
    });
    

    socket.on('typing', ({ senderId }) => {
      if (senderId === adminId) setTypingStatus(true);
    });

    socket.on('stopTyping', ({ senderId }) => {
      if (senderId === adminId) setTypingStatus(false);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [userId]);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/messages/${userId}/${adminId}`);
        setChat(res.data.messages);
      } catch (err) {
        console.error(err);
      }
    };

    if (isOpen) fetchChat();
  }, [isOpen, userId, adminId]);

  const sendMessage = async () => {
    if (!message.trim()) return;
  
    const newMsg = {
      senderId: userId,
      receiverId: adminId,
      message,
      timestamp: new Date().toISOString(), // Add timestamp for instant rendering
    };
  
    setMessage('');
  
    try {
      await axios.post('http://localhost:8080/api/messages/send', newMsg);
      socket.emit('sendMessage', newMsg);
  
      // // 💡 Add sent message to local chat
      // setChat((prev) => [...prev, newMsg]);
  
      socket.emit('stopTyping', { senderId: userId, receiverId: adminId });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };
  
  const handleTyping = () => {
    socket.emit('typing', { senderId: userId, receiverId: adminId });

    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit('stopTyping', { senderId: userId, receiverId: adminId });
    }, 1000);
  };

  let typingTimeout;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-80 bg-white shadow-lg rounded-lg flex flex-col">
          <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
            <span>Chat with Admin</span>
            <button onClick={() => setIsOpen(false)}>X</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto max-h-96">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 p-2 rounded-lg max-w-[70%] ${msg.senderId === userId || msg.senderId?._id === userId
                  ? 'bg-blue-500 text-white ml-auto'
                  : 'bg-gray-300 text-black'
                  }`}
              >
                <div className="text-xs font-medium mb-1">
                  {msg.senderId?.name || (msg.senderId === userId ? 'You' : 'Admin')}
                </div>
                {msg.message}
                <div className="text-[10px] text-right text-gray-600 mt-1">
                  {new Date(msg.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
            {typingStatus && (
              <div className="text-sm italic text-gray-500 -mt-3">Admin is typing...</div>
            )}
          </div>

          <div className="p-2 flex gap-2 border-t">
            <input
              type="text"
              className="flex-1 border px-2 py-1 rounded"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          Chat
        </button>
      )}
    </div>
  );
};

export default FloatingChat;
