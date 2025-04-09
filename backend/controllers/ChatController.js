const Chat = require("../models/Chat");

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    const chatMessage = new Chat({ senderId, receiverId, message });
    await chatMessage.save();

    res.status(201).json(chatMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort("createdAt");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
