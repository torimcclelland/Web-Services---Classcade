const express = require('express');
const router = express.Router();
const { 
  createMeeting, 
  connectZoom, 
  getMeetings, 
  disconnectZoom 
} = require('../controllers/zoomController');

// GET /api/zoom/auth - Start OAuth flow
router.get('/auth', (req, res) => {
  const userId = req.query.userId || req.user?.id;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const authUrl = `https://zoom.us/oauth/authorize?` +
    `response_type=code&` +
    `client_id=${process.env.ZOOM_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(process.env.ZOOM_REDIRECT_URI)}&` +
    `state=${userId}`;

  res.json({ authUrl });
});

// POST /api/zoom/callback - OAuth callback handler (called from frontend)
router.post('/callback', async (req, res) => {
  try {
    const { code, userId } = req.body;
    
    if (!code || !userId) {
      return res.status(400).json({ error: 'Missing code or userId' });
    }

    await connectZoom(userId, code);
    res.json({ success: true, connected: true });
  } catch (err) {
    console.error('Zoom callback error:', err);
    res.status(500).json({ error: 'Failed to connect Zoom', message: err.message });
  }
});

// GET /api/zoom/meetings - Get user's meetings
router.get('/meetings', async (req, res) => {
  try {
    const userId = req.query.userId || req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const meetings = await getMeetings(userId);
    res.json({ meetings });
  } catch (err) {
    console.error('Zoom getMeetings error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/zoom/create - Create meeting
router.post('/create', async (req, res) => {
  try {
    const userId = req.body.userId || req.user?.id;
    const topic = req.body.topic || 'Classcade Sync';

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const meeting = await createMeeting(userId, topic);
    res.json({ meeting });
  } catch (err) {
    console.error('Zoom create error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/zoom/disconnect - Disconnect Zoom
router.delete('/disconnect', async (req, res) => {
  try {
    const userId = req.body.userId || req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    await disconnectZoom(userId);
    res.json({ disconnected: true });
  } catch (err) {
    console.error('Zoom disconnect error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
