const axios = require('axios');
const User = require('../models/user');

const ZOOM_API_BASE = 'https://api.zoom.us/v2';

const getAuthHeader = (accessToken) => ({
  Authorization: `Bearer ${accessToken}`,
});

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

  const { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } =
    response.data;

  await User.findByIdAndUpdate(userId, {
    zoom: {
      accessToken,
      refreshToken,
      expiresAt: Date.now() + expiresIn * 1000,
    },
  });

  return { connected: true };
};

const getMeetings = async (userId) => {
  const user = await User.findById(userId);
  if (!user?.zoom?.accessToken) {
    throw new Error('Zoom account not connected');
  }

  const response = await axios.get(`${ZOOM_API_BASE}/users/me/meetings`, {
    headers: getAuthHeader(user.zoom.accessToken),
  });

  return response.data.meetings;
};

const updateMeeting = async (userId, meetingId, updateData) => {
  const user = await User.findById(userId);
  if (!user?.zoom?.accessToken) {
    throw new Error('Zoom account not connected');
  }

  const response = await axios.patch(`${ZOOM_API_BASE}/meetings/${meetingId}`, updateData, {
    headers: getAuthHeader(user.zoom.accessToken),
  });

  return response.data;
};

const disconnectZoom = async (userId) => {
  const user = await User.findById(userId);
  if (!user?.zoom?.accessToken) {
    return { disconnected: true };
  }

  await axios.post('https://zoom.us/oauth/revoke', null, {
    params: { token: user.zoom.accessToken },
    auth: {
      username: process.env.ZOOM_CLIENT_ID,
      password: process.env.ZOOM_CLIENT_SECRET,
    },
  });

  await User.findByIdAndUpdate(userId, { $unset: { zoom: '' } });

  return { disconnected: true };
};

module.exports = {
  connectZoom,
  getMeetings,
  updateMeeting,
  disconnectZoom,
};
