require("dotenv").config({ path: "../.env" });
const { OpenAI } = require("openai");
const mongoose = require("mongoose");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const AI_OBJECT_ID = process.env.AI_OBJECT_ID;

const createConversation = async (req, res) => {
  const { userId, question } = req.body;

  if (!userId || !question) {
    return res.status(400).json({ error: "Missing userId or question." });
  }

  const aiId = new mongoose.Types.ObjectId(AI_OBJECT_ID);

  let existingChat = await Chat.findOne({
    members: { $all: [userId, aiId] },
  });

  const messages = [
    {
      role: "system",
      content: `You are Luntian, an assistant designed to support users in understanding and optimizing plant health . The name "Luntian" comes from the Filipino word meaning 'green'—a vibrant symbol of nature, growth, and all things lush and leafy. With your extensive knowledge in sensor technologies, data analysis, environmental conditions, and plant health diagnostics, your role is to provide users with in-depth, accurate, and practical guidance. Whether the question involves sensor selection, data interpretation, irrigation automation, or early detection of plant stress and disease, your responses will be tailored, research-driven, and aligned with the latest advancements in precision agriculture and smart farming technologies.`,
    },
    {
      role: "user",
      content: question,
    },
  ];

  const model = "llama3-70b-8192";
  let aiResponse = "";

  try {
    const stream = await openai.chat.completions.create({
      model,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content || "";
      aiResponse += content;
    }

    const newMessages = [
      {
        senderId: userId,
        text: question,
        role: "user",
      },
      {
        senderId: aiId,
        text: aiResponse,
        role: "ai",
      },
    ];

    if (existingChat) {
      existingChat.messages.push(...newMessages);
      await existingChat.save();
      res.status(200).json(existingChat);
    } else {
      const newChat = new Chat({
        members: [userId, aiId],
        messages: newMessages,
      });
      await newChat.save();
      res.status(201).json(newChat);
    }
  } catch (error) {
    console.error("❌ Conversation failed:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getConversation = async (req, res) => {
  const { userId } = req.params;
  const aiId = new mongoose.Types.ObjectId(process.env.AI_OBJECT_ID);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId." });
  }

  try {
    const chat = await Chat.findOne({
      members: { $all: [userId, aiId] },
    }).populate("messages.senderId");

    if (!chat) {
      return res.status(404).json({ message: "No conversation found." });
    }

    const messages = chat.messages.map((msg) => {
      if (msg.role === "ai" && msg.senderId === null) {
        msg.senderId = process.env.AI_OBJECT_ID;
      }
      return msg;
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Error fetching conversation:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  createConversation,
  getConversation,
};
