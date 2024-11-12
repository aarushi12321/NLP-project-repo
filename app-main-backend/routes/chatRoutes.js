const express = require("express");
const router = express.Router();
const ChatSession = require("../models/ChatSession");

router.post("/saveChat", async (req, res) => {
  const { userId, sessionId, chatHistory } = req.body;
  try {
    const newSession = new ChatSession({ userId, sessionId, chatHistory });
    await newSession.save();
    res.json({ success: true, message: "Chat session saved successfully" });
    console.log("Chat saved successfully.");
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/getChats/:userId", async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.params.userId }).sort(
      { createdAt: -1 }
    );
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/updateChat/:sessionId", async (req, res) => {
  try {
    const updatedSession = await ChatSession.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { chatHistory: req.body.chatHistory },
      { new: true }
    );
    if (updatedSession) {
      res.json({ success: true, updatedSession });
    } else {
      res.status(404).json({ success: false, message: "Session not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
