const express = require("express");
const router = express.Router();
const {
  createConversation,
  getConversation,
} = require("../controllers/chatController");
const { authenticateToken } = require("../controllers/authController");

router.post("/create/conversation", authenticateToken, createConversation);

router.get("/get/conversation/:userId", authenticateToken, getConversation);

module.exports = router;
