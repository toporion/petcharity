// ✅ BACKEND SOCKET.IO LOGIC

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
require('./connection/db');

const UserRoute = require('./routes/UserRoute');
const AnimalRoute = require('./routes/AnimalRoute');
const DonationRoute = require('./routes/DonationRoute');

const ChatRoute = require("./routes/ChatRoute");
const adminReportRoutes = require('./routes/AdminReportRoute');
const MessageRoute = require('./routes/MessageRoutes');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api', UserRoute);
app.use('/api', AnimalRoute);
app.use('/api', DonationRoute);

app.use("/api", ChatRoute);
app.use("/api", adminReportRoutes);
app.use('/api/messages', MessageRoute);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on('join', (userId) => {
    console.log(`Joining user ${userId} to room`);
    socket.join(userId);
  });

  socket.on('sendMessage', (data) => {
    const { senderId, receiverId, message } = data;
    const fullMessage = { ...data, timestamp: new Date() };

    io.to(senderId).emit('receiveMessage', fullMessage);
    io.to(receiverId).emit('receiveMessage', fullMessage);
  });

  // ✅ Typing events
  socket.on('typing', ({ senderId, receiverId }) => {
    io.to(receiverId).emit('typing', { senderId });
  });

  socket.on('stopTyping', ({ senderId, receiverId }) => {
    io.to(receiverId).emit('stopTyping', { senderId });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
