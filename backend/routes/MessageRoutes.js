const express = require('express');
const { sendMessage, getMessages, getChatUsers } = require('../controllers/MessageController');
const router = express.Router();


// Save a new message
router.post('/send', sendMessage);

// Get all messages between two users
router.get('/:user1/:user2', getMessages);
router.get('/admin/users/:adminId', getChatUsers);

module.exports = router;
