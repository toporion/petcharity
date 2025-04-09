import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:8080'); // 👈 Setup

const FloatingChat = ({ userId }) => {
  const [chat, setChat] = useState([]);
  const [adminId] = useState('67d9a319418a550493c84d2a');
  const [message, setMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

  const fetchChat = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/messages/${userId}/${adminId}`);
      setChat(res.data.messages);
    } catch (err) {
      console.error('Fetching chat failed:', err);
    }
  };

  useEffect(() => {
    if (!showChat) return;

    fetchChat(); // initial fetch

    socket.emit('join', userId); // 👈 Join room

    // 🔁 Real-time updates
    socket.on('receiveMessage', (data) => {
      const isForThisUser = data.receiverId === userId || data.senderId === userId;
      if (isForThisUser) {
        setChat((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [showChat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMsg = {
      senderId: userId,
      receiverId: adminId,
      message,
    };

    setMessage('');

    try {
      await axios.post('http://localhost:8080/api/messages/send', newMsg);
      socket.emit('sendMessage', newMsg); // ✅ Send via socket
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showChat ? (
        <div className="w-80 bg-white rounded shadow-lg flex flex-col h-[400px]">
          <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center rounded-t">
            <span>Chat with Admin</span>
            <button onClick={() => setShowChat(false)}>✖</button>
          </div>

          <div className="flex-1 p-2 overflow-y-auto bg-gray-50">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded max-w-[70%] text-sm ${
                  msg.senderId === userId || (msg.senderId?._id === userId)
                    ? 'bg-green-500 text-white ml-auto'
                    : 'bg-gray-300 text-black'
                }`}
              >
                {msg.message}
              </div>
            ))}
          </div>

          <div className="flex p-2 gap-2">
            <input
              type="text"
              className="flex-1 border rounded px-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 rounded"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowChat(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
        >
          💬 Chat
        </button>
      )}
    </div>
  );
};

export default FloatingChat;
