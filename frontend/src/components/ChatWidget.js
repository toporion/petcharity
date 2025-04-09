import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:8080"); // Change in production

const ChatWidget = ({ userId, adminId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    // Load chat history from MongoDB
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/chat/${userId}/${adminId}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    if (userId && adminId) fetchMessages();
  }, [userId, adminId]);

  const sendMessage = async () => {
    if (message.trim()) {
      const chatMessage = { senderId: userId, receiverId: adminId, message };

      try {
        await axios.post("http://localhost:8080/api/chat", chatMessage);
        socket.emit("sendMessage", chatMessage);
        setMessages((prev) => [...prev, chatMessage]);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {/* Toggle Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-blue-500 text-white rounded-full shadow-lg"
      >
        💬
      </button>

      {isOpen && (
        <div className="w-72 h-96 bg-white shadow-lg rounded-lg p-4 flex flex-col">
          <div className="overflow-auto flex-1">
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 border-b ${msg.senderId === userId ? "text-right" : ""}`}>
                {msg.message}
              </div>
            ))}
          </div>
          <div className="flex mt-2">
            <input
              type="text"
              className="flex-1 border p-2 rounded-l"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="bg-blue-500 text-white p-2 rounded-r" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
