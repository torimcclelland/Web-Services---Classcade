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

  // Request the necessary scopes for meeting management
  const scopes = [
    'meeting:write:meeting',
    'meeting:read:meeting',
    'meeting:read:list_meetings'
  ].join(' ');

  const authUrl = `https://zoom.us/oauth/authorize?` +
    `response_type=code&` +
    `client_id=${process.env.ZOOM_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(process.env.ZOOM_REDIRECT_URI)}&` +
    `state=${userId}&` +
    `scope=${encodeURIComponent(scopes)}`;

  res.json({ authUrl });
});

// POST /api/zoom/callback - OAuth callback handler (called from frontend)
router.post('/callback', async (req, res) => {
  console.log('=== ZOOM CALLBACK ===');
  console.log('Code:', req.body.code?.substring(0, 20) + '...');
  console.log('UserId:', req.body.userId);
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

// POST /api/zoom/team-meeting - Create team meeting for project
router.post('/team-meeting', async (req, res) => {
  console.log('=== Team Meeting Create Request ===');
  console.log('Body:', req.body);
  try {
    const { userId, projectId } = req.body;
    
    if (!userId || !projectId) {
      console.error('Missing userId or projectId');
      return res.status(400).json({ error: 'userId and projectId are required' });
    }

    const Project = require('../models/project');
    
    // Check if user is a member of the project
    const project = await Project.findById(projectId);
    if (!project) {
      console.error('Project not found:', projectId);
      return res.status(404).json({ error: 'Project not found' });
    }
    
    console.log('Project found:', project.name);
    console.log('Project members:', project.members);
    console.log('User ID to check:', userId);
    
    if (!project.members.some(m => m.toString() === userId)) {
      console.error('User is not a member of this project');
      return res.status(403).json({ error: 'User is not a member of this project' });
    }

    console.log('Creating Zoom meeting...');
    // Create the Zoom meeting
    const meeting = await createMeeting(userId, `${project.name} - Team Meeting`);
    console.log('Meeting created:', meeting);
    
    // Update project with team meeting info
    project.teamMeeting = {
      meetingId: meeting.id.toString(),
      joinUrl: meeting.join_url,
      topic: meeting.topic,
      startUrl: meeting.start_url,
      createdBy: userId,
      createdAt: new Date(),
      isActive: true
    };
    
    await project.save();
    console.log('Project saved with team meeting');
    
    res.json({ 
      success: true, 
      teamMeeting: project.teamMeeting,
      meeting 
    });
  } catch (err) {
    console.error('Team meeting create error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/zoom/team-meeting/:projectId - Get active team meeting for project
router.get('/team-meeting/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const Project = require('../models/project');
    
    const project = await Project.findById(projectId).populate('teamMeeting.createdBy', 'firstName lastName');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (!project.teamMeeting || !project.teamMeeting.isActive) {
      return res.json({ teamMeeting: null });
    }
    
    res.json({ teamMeeting: project.teamMeeting });
  } catch (err) {
    console.error('Get team meeting error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/zoom/team-meeting/:projectId - End team meeting for project
router.delete('/team-meeting/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const Project = require('../models/project');
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Only the creator or project members can end the meeting
    if (!project.members.some(m => m.toString() === userId)) {
      return res.status(403).json({ error: 'User is not a member of this project' });
    }
    
    project.teamMeeting = {
      isActive: false
    };
    
    await project.save();
    
    res.json({ success: true, message: 'Team meeting ended' });
  } catch (err) {
    console.error('End team meeting error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
