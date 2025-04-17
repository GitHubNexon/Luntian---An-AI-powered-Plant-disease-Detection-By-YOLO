require("dotenv").config({ path: "../.env" });
const { OpenAI } = require("openai");
const Chat = require("../models/chatModel");
const generateObjectID = require("../middlewares/generateObjectID");

const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const createConversation = async (req, res) => {
  const { userId, question } = req.body;

  if (!userId || !question) {
    return res.status(400).json({ error: "Missing userId or question." });
  }

  const aiId = await generateObjectID();

  const messages = [
    {
      role: "system",
      content: `You are Luntian, an assistant designed to support users in understanding and optimizing plant monitoring systems...`,
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

    const newChat = new Chat({
      members: [userId, aiId],
      messages: [
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
      ],
    });

    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    console.error("❌ Conversation creation failed:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  createConversation,
};
