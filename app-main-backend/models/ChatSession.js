const mongoose = require("mongoose");

const ChatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  sessionId: { type: String, required: true, unique: true }, 
  chatHistory: [
    {
      sender: { type: String, required: true }, 
      text: { type: String, required: true }, 
      timestamp: { type: Date, default: Date.now }, 
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const ChatSession = mongoose.model("ChatSession", ChatSessionSchema);
module.exports = ChatSession;
