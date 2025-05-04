const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model('Chat', ChatSchema);

// Start a new chat
router.post('/api/chat', async (req, res) => {
  try {
    const chat = new Chat({
      participants: [req.user._id, req.body.recipientId],
    });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).send('Failed to start chat');
  }
});

// Send a message
router.post('/api/chat/:id/message', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    chat.messages.push({ sender: req.user._id, text: req.body.text });
    await chat.save();
    res.json(chat);
  } catch (error) {
    res.status(500).send('Failed to send message');
  }
});

// Get chat messages
router.get('/api/chat/:id', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).populate('messages.sender');
    res.json(chat);
  } catch (error) {
    res.status(500).send('Failed to fetch chat');
  }
});

module.exports = router;
