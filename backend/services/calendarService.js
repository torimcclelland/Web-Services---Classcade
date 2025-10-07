const express = require('express');
const router = express.Router();

// Add event to Google Calendar
router.post('/google/link', (req, res) => {
  const { userId, event } = req.body;
  if (!userId || !event) {
    return res.status(400).json({ error: 'Missing userId or event data' });
  }

  googleEvents[userId] = googleEvents[userId] || [];
  googleEvents[userId].push(event);

  res.status(201).json({ message: 'Event added to Google Calendar', event });
});

// Get Google Calendar events for a user
router.get('/google/:userid', (req, res) => {
  const { userid } = req.params;
  const events = googleEvents[userid] || [];
  res.json(events);
});

// Update Google Calendar event
router.put('/google/update', (req, res) => {
  const { userId, eventId, updatedEvent } = req.body;
  const userEvents = googleEvents[userId];

  if (!userEvents) return res.status(404).json({ error: 'User not found' });

  const index = userEvents.findIndex(e => e.id === eventId);
  if (index === -1) return res.status(404).json({ error: 'Event not found' });

  userEvents[index] = updatedEvent;
  res.json({ message: 'Google event updated', updatedEvent });
});

// Remove Google Calendar association
router.delete('/google/delete', (req, res) => {
  const { userId } = req.body;
  delete googleEvents[userId];
  res.json({ message: 'Google Calendar association removed' });
});

// Add event to Outlook Calendar
router.post('/outlook/link', (req, res) => {
  const { userId, event } = req.body;
  if (!userId || !event) {
    return res.status(400).json({ error: 'Missing userId or event data' });
  }

  outlookEvents[userId] = outlookEvents[userId] || [];
  outlookEvents[userId].push(event);

  res.status(201).json({ message: 'Event added to Outlook Calendar', event });
});

// Get Outlook Calendar events for a user
router.get('/outlook/:userid', (req, res) => {
  const { userid } = req.params;
  const events = outlookEvents[userid] || [];
  res.json(events);
});

// Update Outlook Calendar event
router.put('/outlook/update', (req, res) => {
  const { userId, eventId, updatedEvent } = req.body;
  const userEvents = outlookEvents[userId];

  if (!userEvents) return res.status(404).json({ error: 'User not found' });

  const index = userEvents.findIndex(e => e.id === eventId);
  if (index === -1) return res.status(404).json({ error: 'Event not found' });

  userEvents[index] = updatedEvent;
  res.json({ message: 'Outlook event updated', updatedEvent });
});

// Remove Outlook Calendar association
router.delete('/outlook/delete', (req, res) => {
  const { userId } = req.body;
  delete outlookEvents[userId];
  res.json({ message: 'Outlook Calendar association removed' });
});

module.exports = router;
