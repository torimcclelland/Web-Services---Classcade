const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const connectDB = require('../db');

router.use(express.json());

// Create a message
router.post('/', async (req, res) => {
  const { conversationId, sender, recipients, content, contentType, repliedTo } = req.body;
  if (!sender || typeof sender !== 'string')
    return res.status(400).json({ error: 'sender (user id) is required' });
  if (!content || typeof content !== 'string' || content.trim() === '')
    return res.status(400).json({ error: 'Message content is required' });

  try {
    const newMsg = await Chat.create({ conversationId, sender, recipients, content, contentType, repliedTo });
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ error: 'Server error creating message' });
  }
});

// Get messages - updated to populate sender info
router.get('/', async (req, res) => {
  try {
    const { conversationId, userId, limit = 50, before } = req.query;
    const q = {};
    
    if (conversationId) {
      q.conversationId = conversationId;
    } else if (userId) {
      // Find messages where user is sender or recipient
      q.$or = [
        { sender: userId },
        { recipients: userId }
      ];
    }
    
    if (before) q.createdAt = { $lt: new Date(before) };

    const items = await Chat.find(q)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("sender", "firstName lastName avatar email")
      .populate("recipients", "firstName lastName avatar email");

    res.json(items);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Server error fetching messages' });
  }
});

// Get message by id
router.get('/:id', async (req, res) => {
  try {
    const item = await Chat.findById(req.params.id)
      .populate("sender", "firstName lastName avatar email")
      .populate("recipients", "firstName lastName avatar email");
    if (!item) return res.status(404).json({ message: 'Message not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error finding message' });
  }
});

// Update a message
router.put('/:id', async (req, res) => {
  const { content } = req.body;
  if (content !== undefined && typeof content !== 'string')
    return res.status(400).json({ error: 'Invalid payload' });

  try {
    const update = {};
    if (content !== undefined) {
      update.content = content;
      update.isEdited = true;
      update.editedAt = new Date();
    }

    const updated = await Chat.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Message not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error updating message' });
  }
});

// Delete a message
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Chat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message successfully deleted', item: deleted });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting message' });
  }
});

// Delete a conversation (all messages for a project)
router.delete('/conversation/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const result = await Chat.deleteMany({ conversationId });
    if (!result || result.deletedCount === 0)
      return res.status(404).json({ message: 'Conversation not found or already empty' });
    res.json({ message: 'Conversation successfully deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting conversation' });
  }
});

// Mark message as read
router.post('/:messageId/read', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  try {
    const updated = await Chat.findByIdAndUpdate(
      req.params.messageId,
      { $addToSet: { readBy: { user: userId, readAt: new Date() } } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Message not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error marking message as read' });
  }
});

// Add a reaction
router.post('/:messageId/reaction', async (req, res) => {
  const { messageId } = req.params;
  const { user, type } = req.body;
  if (!user || typeof user !== 'string' || !type || typeof type !== 'string')
    return res.status(400).json({ error: 'user (id) and type (string) are required' });

  try {
    // Remove existing reaction from this user first
    await Chat.findByIdAndUpdate(messageId, { $pull: { reactions: { user } } });
    // Add new reaction
    const updated = await Chat.findByIdAndUpdate(
      messageId,
      { $push: { reactions: { user, type, createdAt: new Date() } } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Message not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error adding reaction' });
  }
});

// Remove a reaction
router.delete('/:messageId/reaction/:userId', async (req, res) => {
  const { messageId, userId } = req.params;
  if (!userId || typeof userId !== 'string')
    return res.status(400).json({ error: 'userId (path param) is required' });

  try {
    const updated = await Chat.findOneAndUpdate(
      { _id: messageId, 'reactions.user': userId },
      { $pull: { reactions: { user: userId } } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Reaction or message not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error removing reaction' });
  }
});

module.exports = router;

if (require.main === module) {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use('/api/chat', router);

  connectDB()
    .then(async () => {
      const mongoose = require('mongoose');
      console.log('mongoose state:', mongoose.connection.readyState);
      app.listen(PORT, () => {
        console.log(`Chat service running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('DB connect failed, starting server without DB:', err);
      app.listen(PORT, () => console.log(`Chat service running on port ${PORT} (no DB)`));
    });
}