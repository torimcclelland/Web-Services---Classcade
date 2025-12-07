const axios = require('axios');
const User = require('../models/user');

const ZOOM_API_BASE = 'https://api.zoom.us/v2';

const getAuthHeader = (accessToken) => ({
  Authorization: `Bearer ${accessToken}`,
});

// 🔁 Refresh Zoom Token if Expired
const refreshZoomToken = async (user) => {
  if (!user?.zoom?.refreshToken) throw new Error('No Zoom refresh token available');

  const response = await axios.post('https://zoom.us/oauth/token', null, {
    params: {
      grant_type: 'refresh_token',
      refresh_token: user.zoom.refreshToken,
    },
    auth: {
      username: process.env.ZOOM_CLIENT_ID,
      password: process.env.ZOOM_CLIENT_SECRET,
    },
  });

  const { access_token, refresh_token, expires_in } = response.data;

  user.zoom.accessToken = access_token;
  user.zoom.refreshToken = refresh_token;
  user.zoom.expiresAt = Date.now() + expires_in * 1000;
  await user.save();

  return access_token;
};

// 🔐 Connect Zoom (OAuth callback)
const connectZoom = async (userId, code) => {
  console.log('=== connectZoom called ===');
  console.log('userId:', userId);
  console.log('code:', code?.substring(0, 20) + '...');
  console.log('redirect_uri:', process.env.ZOOM_REDIRECT_URI);
  console.log('client_id:', process.env.ZOOM_CLIENT_ID);

  try {
    // First, verify the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      throw new Error(`User not found with ID: ${userId}`);
    }

    const response = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.ZOOM_REDIRECT_URI,
      },
      auth: {
        username: process.env.ZOOM_CLIENT_ID,
        password: process.env.ZOOM_CLIENT_SECRET,
      },
    });

    console.log('Zoom token response received');

    const { access_token, refresh_token, expires_in } = response.data;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        zoom: {
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresAt: Date.now() + expires_in * 1000,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error(`Failed to update user with ID: ${userId}`);
    }

    console.log('User updated with Zoom tokens');
    console.log('Zoom object:', updatedUser.zoom ? 'exists' : 'missing');

    return { connected: true };
  } catch (error) {
    console.error('=== Zoom OAuth Error ===');
    console.error('Status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Error message:', error.message);
    throw error;
  }
};

// 📅 Get Scheduled Meetings
const getMeetings = async (userId) => {
  const user = await User.findById(userId);
  console.log('getMeetings - User ID:', userId);
  console.log('getMeetings - User zoom object:', user?.zoom);
  if (!user?.zoom?.accessToken) throw new Error('Zoom not connected');

  let accessToken = user.zoom.accessToken;
  if (Date.now() > user.zoom.expiresAt) {
    accessToken = await refreshZoomToken(user);
  }

  try {
    const response = await axios.get(`${ZOOM_API_BASE}/users/me/meetings`, {
      headers: getAuthHeader(accessToken),
    });
    
    // Filter out meetings that have already started or are in the past
    const now = new Date();
    const upcomingMeetings = response.data.meetings.filter(meeting => {
      if (!meeting.start_time) return false;
      const meetingStart = new Date(meeting.start_time);
      return meetingStart > now;
    });
    
    return upcomingMeetings;
  } catch (err) {
    console.error('Zoom getMeetings error:', err.response?.data || err.message);
    
    // Check if it's a scope error
    if (err.response?.data?.code === 4711) {
      throw new Error('Zoom app is missing required permissions. Please disconnect and reconnect Zoom to grant the necessary permissions.');
    }
    
    throw new Error('Failed to fetch Zoom meetings');
  }
};

// ✏️ Update Meeting
const updateMeeting = async (userId, meetingId, updateData) => {
  const user = await User.findById(userId);
  if (!user?.zoom?.accessToken) throw new Error('Zoom not connected');

  let accessToken = user.zoom.accessToken;
  if (Date.now() > user.zoom.expiresAt) {
    accessToken = await refreshZoomToken(user);
  }

  try {
    const response = await axios.patch(`${ZOOM_API_BASE}/meetings/${meetingId}`, updateData, {
      headers: getAuthHeader(accessToken),
    });
    return response.data;
  } catch (err) {
    console.error('Zoom updateMeeting error:', err.response?.data || err.message);
    throw new Error('Failed to update Zoom meeting');
  }
};

// ❌ Disconnect Zoom
const disconnectZoom = async (userId) => {
  const user = await User.findById(userId);
  if (!user?.zoom?.accessToken) return { disconnected: true };

  try {
    await axios.post('https://zoom.us/oauth/revoke', null, {
      params: { token: user.zoom.accessToken },
      auth: {
        username: process.env.ZOOM_CLIENT_ID,
        password: process.env.ZOOM_CLIENT_SECRET,
      },
    });
  } catch (err) {
    console.error('Zoom revoke error:', err.response?.data || err.message);
  }

  await User.findByIdAndUpdate(userId, { $unset: { zoom: '' } });
  return { disconnected: true };
};

// 🚀 Create Instant Meeting
const createMeeting = async (userId, topic = "Classcade Sync") => {
  const user = await User.findById(userId);
  if (!user?.zoom?.accessToken) throw new Error('Zoom not connected');

  let accessToken = user.zoom.accessToken;
  if (Date.now() > user.zoom.expiresAt) {
    accessToken = await refreshZoomToken(user);
  }

  try {
    const response = await axios.post(`${ZOOM_API_BASE}/users/me/meetings`, {
      topic,
      type: 1,
    }, {
      headers: getAuthHeader(accessToken),
    });

    return response.data;
  } catch (err) {
    console.error('Zoom createMeeting error:', err.response?.data || err.message);
    
    // Check if it's a scope error
    if (err.response?.data?.code === 4711) {
      throw new Error('Zoom app is missing required permissions. Please disconnect and reconnect Zoom to grant the necessary permissions.');
    }
    
    throw new Error('Failed to create Zoom meeting');
  }
};

module.exports = {
  connectZoom,
  getMeetings,
  updateMeeting,
  disconnectZoom,
  createMeeting,
};
