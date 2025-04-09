const Message = require('../models/Message');
const UserModel = require('../models/UserModel');

// Save message to DB
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    console.log('Saving message:', newMessage);
    await newMessage.save();
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Send error:", error);
    res.status(500).json({ success: false, error: 'Message not sent.' });
  }
};

// Get chat history between two users
const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    })
      .sort({ timestamp: 1 })
      .populate('senderId', 'name profileImage');

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch messages.' });
  }
};

// Get distinct users who have chatted with the admin
const getChatUsers = async (req, res) => {
  try {
    const adminId = req.params.adminId;

    const users = await Message.find({ receiverId: adminId }).distinct('senderId');

    const userDetails = await UserModel.find({ _id: { $in: users } })
      .select('_id name email profileImage');

    res.status(200).json({ success: true, users: userDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

module.exports = { sendMessage, getMessages, getChatUsers };
