const express = require('express');
const app = express();
const PORT = 3000;
const connectDB = require('../db');
const Chat = require('../models/chat');

app.use(express.json());


// Create a message
app.post('/api/chat', async (req, res) => {
	const { conversationId, sender, recipients, content, contentType, repliedTo } = req.body;

	if (!sender || typeof sender !== 'string') {
		return res.status(400).json({ error: 'sender (user id) is required' });
	}

	// require content (attachments removed)
	if (!content || typeof content !== 'string' || content.trim() === '') {
		return res.status(400).json({ error: 'Message content is required' });
	}

	try {
		const newMsg = await Chat.create({ conversationId, sender, recipients, content, contentType, repliedTo });
		res.status(201).json(newMsg);
	} catch (err) {
		res.status(500).json({ error: 'Server error creating message' });
	}
});


// List messages (optionally filter by conversationId)
app.get('/api/chat', async (req, res) => {
	try {
		const { conversationId, limit = 50, before } = req.query;
		const q = {};
		if (conversationId) q.conversationId = conversationId;
		if (before) q.createdAt = { $lt: new Date(before) };

		const items = await Chat.find(q).sort({ createdAt: -1 }).limit(Number(limit));
		res.json(items);
	} catch (err) {
		res.status(500).json({ error: 'Server error fetching messages' });
	}
});

// Get message by id
app.get('/api/chat/:id', async (req, res) => {
	try {
		const item = await Chat.findById(req.params.id);
		if (!item) return res.status(404).json({ message: 'Message not found' });
		res.json(item);
	} catch (err) {
		res.status(500).json({ error: 'Server error finding message' });
	}
});


// Update a message
app.put('/api/chat/:id', async (req, res) => {
	const { content } = req.body;
	if (content !== undefined && typeof content !== 'string') {
		return res.status(400).json({ error: 'Invalid payload' });
	}

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
app.delete('/api/chat/:id', async (req, res) => {
	try {
		const deleted = await Chat.findByIdAndDelete(req.params.id);
		if (!deleted) return res.status(404).json({ message: 'Message not found' });
		res.json({ message: 'Message sucessfully deleted', item: deleted });
	} catch (err) {
		res.status(500).json({ error: 'Server error deleting message' });
	}
});


// Delete a conversation
app.delete('/api/chat/conversation/:conversationId', async (req, res) => {
	try {
    const { conversationId } = req.params;
    const result = await Chat.deleteMany({ conversationId });
    if (!result || result.deletedCount === 0) {
      return res.status(404).json({ message: 'Conversation not found or already empty' });
    }
    res.json({ message: 'Conversation sucessfully deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting conversation' });
  }
});


// Add a reaction to a message
// The user can react to a message as many times as they want, but a new reaction will override an old one
app.post('/api/chat/:messageId/reaction', async (req, res) => {
	const { messageId } = req.params;
	const { user, type } = req.body;

	if (!user || typeof user !== 'string' || !type || typeof type !== 'string') {
		return res.status(400).json({ error: 'user (id) and type (string) are required' });
	}

	try {
		// Remove previous reactions by the user on this message
		await Chat.findByIdAndUpdate(
			messageId,
			{ $pull: { reactions: { user } } }
		);

		// Add the new reaction
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


// Remove a reaction from a message
app.delete('/api/chat/:messageId/reaction/:userId', async (req, res) => {
  const { messageId, userId } = req.params;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId (path param) is required' });
  }

  try {
    // remove any reaction by this user on the message
    const updated = await Chat.findOneAndUpdate(
      { _id: messageId, 'reactions.user': userId },
      { $pull: { reactions: { user: userId } } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Reaction or message not found' });
    res.json(updated);
  } catch (err) {
    console.error('DELETE /api/chat/:messageId/reaction/:userId error:', err);
    res.status(500).json({ error: 'Server error removing reaction' });
  }
});




connectDB()
  .then(async () => {
    const mongoose = require('mongoose');
    console.log('mongoose state:', mongoose.connection.readyState);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('DB connect failed, starting server without DB:', err);
    app.listen(PORT, () => console.log(`Server running on port ${PORT} (no DB)`));
  });

