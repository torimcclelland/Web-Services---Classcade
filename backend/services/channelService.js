const express = require('express');
const router = express.Router();
const Channel = require('../models/channel');
const Chat = require('../models/chat');
const connectDB = require('../db');

router.use(express.json());

// GET all channels for a project
router.get('/project/:projectId/channels', async (req, res) => {
    try {
        const { projectId } = req.params;
        console.log('Fetching channels for project:', projectId);

        const channels = await Channel.find({
            projectId,
            isDeleted: false  // Only return non-deleted channels
        }).sort({ createdAt: 1 });

        console.log('Found channels:', channels.length);
        res.json(channels);
    } catch (error) {
        console.error('Error fetching channels:', error);
        res.status(500).json({ error: 'Failed to fetch channels' });
    }
});

// POST create a new channel
router.post('/project/:projectId/channels', async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, description } = req.body;

        console.log('Creating channel:', { projectId, name });

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Channel name is required' });
        }

        if (name.trim().length > 50) {
            return res.status(400).json({ error: 'Channel name must be 50 characters or less' });
        }

        // Check for duplicate channel name in the same project (case-insensitive)
        const existingChannel = await Channel.findOne({
            projectId,
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
            isDeleted: false
        });

        if (existingChannel) {
            return res.status(400).json({ error: 'A channel with this name already exists' });
        }

        const newChannel = new Channel({
            projectId,
            name: name.trim(),
            description: description || '',
            createdAt: new Date()
        });

        await newChannel.save();
        console.log('Channel created:', newChannel._id);
        res.status(201).json(newChannel);
    } catch (error) {
        console.error('Error creating channel:', error);
        res.status(500).json({ error: 'Failed to create channel' });
    }
});

// GET single channel by ID
router.get('/channels/:channelId', async (req, res) => {
    try {
        const { channelId } = req.params;
        const channel = await Channel.findOne({
            _id: channelId,
            isDeleted: false
        });

        if (!channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        res.json(channel);
    } catch (error) {
        console.error('Error fetching channel:', error);
        res.status(500).json({ error: 'Failed to fetch channel' });
    }
});

// PUT update a channel
router.put('/channels/:channelId', async (req, res) => {
    try {
        const { channelId } = req.params;
        const { name, description } = req.body;

        console.log('Updating channel:', channelId, 'New name:', name);

        if (name && name.trim().length > 50) {
            return res.status(400).json({ error: 'Channel name must be 50 characters or less' });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description;

        const channel = await Channel.findOneAndUpdate(
            { _id: channelId, isDeleted: false },
            updateData,
            { new: true }
        );

        if (!channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        console.log('Channel updated successfully:', channelId);
        res.json(channel);
    } catch (error) {
        console.error('Error updating channel:', error);
        res.status(500).json({ error: 'Failed to update channel' });
    }
});

// DELETE a channel (HARD DELETE - actually removes from database)
router.delete('/channels/:channelId', async (req, res) => {
    try {
        const { channelId } = req.params;

        console.log('Deleting channel:', channelId);

        // Find the channel first
        const channel = await Channel.findOne({ _id: channelId, isDeleted: false });

        if (!channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        // HARD DELETE: Actually remove the channel from database
        await Channel.findByIdAndDelete(channelId);
        console.log('Channel deleted from database:', channelId);

        // HARD DELETE: Actually remove all messages in this channel from database
        const deleteResult = await Chat.deleteMany({ channelId });
        console.log(`Deleted ${deleteResult.deletedCount} messages from channel:`, channelId);

        res.json({
            message: 'Channel and all messages deleted successfully',
            deletedMessagesCount: deleteResult.deletedCount
        });
    } catch (error) {
        console.error('Error deleting channel:', error);
        res.status(500).json({ error: 'Failed to delete channel' });
    }
});

// GET all messages for a channel
router.get('/channels/:channelId/messages', async (req, res) => {
    try {
        const { channelId } = req.params;
        const { limit = 100, before } = req.query;

        console.log('Fetching messages for channel:', channelId);

        const query = {
            channelId,
            isDeleted: false  // Only return non-deleted messages
        };

        if (before) {
            query.createdAt = { $lt: new Date(before) };
        }

        const messages = await Chat.find(query)
            .sort({ createdAt: 1 })
            .limit(Number(limit))
            .populate('sender', 'firstName lastName avatar email')
            .populate('recipients', 'firstName lastName avatar email');

        console.log('Found messages:', messages.length);
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

module.exports = router;

// Standalone server for testing
if (require.main === module) {
    const app = express();
    const PORT = process.env.PORT || 3001;

    app.use(express.json());
    app.use('/api', router);

    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Channel service running on port ${PORT}`);
            });
        })
        .catch(err => {
            console.error('DB connect failed:', err);
            process.exit(1);
        });
}
