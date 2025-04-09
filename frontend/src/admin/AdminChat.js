import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client'; // ✅ 1. Import

const adminId = '67d9a319418a550493c84d2a'; // ✅ Your real admin ID
const socket = io('http://localhost:8080'); // ✅ 2. Connect once outside component

const AdminChat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // ✅ 3. Join admin room
    socket.emit('join', adminId);

    // ✅ 4. Listen for incoming messages
    socket.on('receiveMessage', (data) => {
      if (data.senderId === selectedUser) {
        setChat((prev) => [...prev, data]);
      }
    });

    // ✅ Clean up on unmount
    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/messages/admin/users/${adminId}`);
        setUsers(res.data.users);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const fetchChat = async (userId) => {
    setSelectedUser(userId);
    try {
      const res = await axios.get(`http://localhost:8080/api/messages/${adminId}/${userId}`);
      setChat(res.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
  
    const newMsg = {
      senderId: adminId,
      receiverId: selectedUser,
      message,
    };
  
    setMessage('');
  
    try {
      await axios.post('http://localhost:8080/api/messages/send', newMsg);
      socket.emit('sendMessage', newMsg); // ✅ socket handles real-time display
    } catch (error) {
      console.error("Message send failed:", error);
    }
  };
  

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r p-4 overflow-y-auto">
        <h2 className="font-bold mb-4">Users</h2>
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => fetchChat(user._id)}
            className="cursor-pointer mb-2 p-2 rounded hover:bg-gray-100"
          >
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 p-4 flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex-1 overflow-y-auto border p-2 rounded bg-gray-50">
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-2 p-2 rounded-lg max-w-[70%] ${msg.senderId._id === adminId
                      ? 'bg-blue-500 text-white ml-auto'
                      : 'bg-gray-300 text-black'
                    }`}
                >
                  <div className="text-xs font-medium mb-1">
                    {msg.senderId.name}
                  </div>
                  {msg.message}
                  <div className="text-[10px] text-right text-gray-600 mt-1">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}

            </div>
            <div className="flex gap-2 mt-2">
              <input
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
          </>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
