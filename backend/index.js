const express = require('express');
const http = require('http'); // Required for socket.io
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
require('./connection/db');

const UserRoute = require('./routes/UserRoute');
const AnimalRoute = require('./routes/AnimalRoute');
const DonationRoute = require('./routes/DonationRoute');
const PaymentRoute = require('./routes/PaymentRoute');
const ChatRoute = require("./routes/ChatRoute");
const adminReportRoutes = require('./routes/AdminReportRoute');
const MessageRoute = require('./routes/MessageRoutes');

const app = express();
const server = http.createServer(app); // Create HTTP server

const port = process.env.PORT || 8080;

// Enable CORS
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', UserRoute);
app.use('/api', AnimalRoute);
app.use('/api', DonationRoute);
app.use('/api', PaymentRoute);
app.use("/api", ChatRoute);
app.use("/api", adminReportRoutes);
app.use('/api/messages', MessageRoute);

// WebSocket Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Change this in production to your frontend URL
    methods: ["GET", "POST"]
  }
});

// ✅ Store userId -> socketId mapping
const connectedUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on('join', (userId) => {
    console.log(`Joining user ${userId} to room`);
    socket.join(userId); // ✅ Now both admin & users are in their own rooms
  });

  socket.on('sendMessage', (data) => {
    const { senderId, receiverId, message } = data;

    // Send to sender & receiver rooms
    io.to(senderId).emit('receiveMessage', {
      ...data,
      timestamp: new Date(),
    });

    io.to(receiverId).emit('receiveMessage', {
      ...data,
      timestamp: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// Test Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
