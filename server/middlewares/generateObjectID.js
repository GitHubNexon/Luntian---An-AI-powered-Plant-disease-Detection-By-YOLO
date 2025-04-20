const mongoose = require("mongoose");
const Chat = require("../models/chatModel");

const generateObjectID = async () => {
  let newId;
  let isDuplicate = true;

  while (isDuplicate) {
    newId = new mongoose.Types.ObjectId();
    const existingChat = await Chat.findOne({ "messages.senderId": newId });
    isDuplicate = !!existingChat;
  }

  return newId;
};

module.exports = generateObjectID;
