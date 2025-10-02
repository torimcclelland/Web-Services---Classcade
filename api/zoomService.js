const axios = require('axios');
const User = require('../models/User'); // assumes User model stores zoom tokens

const ZOOM_API_BASE = 'https://api.zoom.us/v2';

const getAuthHeader = (accessToken) => ({
  Authorization: `Bearer ${accessToken}`
});

module.exports = {
  // Exchange authorization code for access token
  connectZoom: async (userId, code) => {
    const response = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.ZOOM_REDIRECT_URI
      },
      auth: {
        username: process.env.ZOOM_CLIENT_ID,
        password: process.env.ZOOM_CLIENT_SECRET
      }
    });

    const { access_token, refresh_token, expires_in } = response.data;

    await User.findByIdAndUpdate(userId, {
      zoom: {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: Date.now() + expires_in * 1000
      }
    });

    return { connected: true };
  },

  // Get user's Zoom meetings
  getMeetings: async (userId) => {
    const user = await User.findById(userId);
    if (!user?.zoom?.accessToken) throw new Error('Zoom account not connected');

    const response = await axios.get(`${ZOOM_API_BASE}/users/me/meetings`, {
      headers: getAuthHeader(user.zoom.accessToken)
    });

    return response.data.meetings;
  },

  // Update a specific Zoom meeting
  updateMeeting: async (userId, meetingId, updateData) => {
    const user = await User.findById(userId);
    if (!user?.zoom?.accessToken) throw new Error('Zoom account not connected');

    const response = await axios.patch(`${ZOOM_API_BASE}/meetings/${meetingId}`, updateData, {
      headers: getAuthHeader(user.zoom.accessToken)
    });

    return response.data;
  },

  // Disconnect Zoom account
  disconnectZoom: async (userId) => {
    const user = await User.findById(userId);
    if (!user?.zoom?.accessToken) return { disconnected: true };

    await axios.post('https://zoom.us/oauth/revoke', null, {
      params: { token: user.zoom.accessToken },
      auth: {
        username: process.env.ZOOM_CLIENT_ID,
        password: process.env.ZOOM_CLIENT_SECRET
      }
    });

    await User.findByIdAndUpdate(userId, { $unset: { zoom: "" } });

    return { disconnected: true };
  }
};
