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

  const { access_token, refresh_token, expires_in } = response.data;

  await User.findByIdAndUpdate(userId, {
    zoom: {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: Date.now() + expires_in * 1000,
    },
  });

  return { connected: true };
};

// 📅 Get Scheduled Meetings
const getMeetings = async (userId) => {
  const user = await User.findById(userId);
  if (!user?.zoom) throw new Error('Zoom not connected');

  let accessToken = user.zoom.accessToken;
  if (Date.now() > user.zoom.expiresAt) {
    accessToken = await refreshZoomToken(user);
  }

  try {
    const response = await axios.get(`${ZOOM_API_BASE}/users/me/meetings`, {
      headers: getAuthHeader(accessToken),
    });
    return response.data.meetings;
  } catch (err) {
    console.error('Zoom getMeetings error:', err.response?.data || err.message);
    throw new Error('Failed to fetch Zoom meetings');
  }
};

// ✏️ Update Meeting
const updateMeeting = async (userId, meetingId, updateData) => {
  const user = await User.findById(userId);
  if (!user?.zoom) throw new Error('Zoom not connected');

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
  if (!user?.zoom) throw new Error('Zoom not connected');

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
