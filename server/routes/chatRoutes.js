const express = require("express");
const router = express.Router();
const { createConversation } = require("../controllers/chatController");
const { authenticateToken } = require("../controllers/authController");

router.post("/create/conversation", authenticateToken, createConversation);

module.exports = router;
