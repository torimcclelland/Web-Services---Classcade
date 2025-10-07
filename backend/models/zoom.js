const express = require('express');
const router = express.Router();
const zoomService = require('../services/zoomService');

// Connect Zoom account (OAuth redirect)
router.get('/connect', async (req, res) => {
  try {
    const redirectUri = encodeURIComponent(process.env.ZOOM_REDIRECT_URI);
    const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.ZOOM_CLIENT_ID}&redirect_uri=${redirectUri}`;
    res.redirect(zoomAuthUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Handle Zoom OAuth callback
router.post('/connect', async (req, res) => {
  try {
    const { userId, code } = req.body;
    const result = await zoomService.connectZoom(userId, code);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's Zoom meetings
router.get('/meetings', async (req, res) => {
  try {
    const { userId } = req.query;
    const meetings = await zoomService.getMeetings(userId);
    res.status(200).json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Zoom meeting
router.put('/update', async (req, res) => {
  try {
    const { userId, meetingId, updateData } = req.body;
    const updated = await zoomService.updateMeeting(userId, meetingId, updateData);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Disconnect Zoom account
router.delete('/disconnect', async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await zoomService.disconnectZoom(userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
