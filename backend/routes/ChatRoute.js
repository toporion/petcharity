const express = require("express");
const { sendMessage, getMessages } = require("../controllers/ChatController");
const router = express.Router();

router.post("/chat", sendMessage);
router.get("/chat/:senderId/:receiverId", getMessages);

module.exports = router;
