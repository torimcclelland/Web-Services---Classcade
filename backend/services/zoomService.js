const express = require('express');
const router = express.Router();
const { createMeeting } = require('../controllers/zoomController');

// GET /api/zoom/create → Launch Zoom meeting
router.get('/create', async (req, res) => {
  try {
    const userId = req.user?.id || '69038607d8d8d5f275a6f3ca'; // Replace with real auth logic
    const meeting = await createMeeting(userId);
    res.json({ join_url: meeting.join_url });
  } catch (err) {
    console.error('Zoom create error:', err);
    res.status(500).json({ error: 'Failed to create Zoom meeting' });
  }
});

module.exports = router;
