// calendarService.js 

const express = require('express');
const router = express.Router();

// 8 methods


// 1. Add event to Google Calendar
// POST
router.post('/google/link', (req, res) => {
  const { userId, event } = req.body;
  if (!userId || !event) {
    return res.status(400).json({ error: 'Missing userId or event data' });
  }

  googleEvents[userId] = googleEvents[userId] || [];
  googleEvents[userId].push(event);

  res.status(201).json({ message: 'Event added to Google Calendar', event });
});

// 2. Get Google Calendar events for a user
// GET
router.get('/google/:userid', (req, res) => {
  const { userid } = req.params;
  const events = googleEvents[userid] || [];
  res.json(events);
});

// 3. Update Google Calendar event
// PUT
router.put('/google/update', (req, res) => {
  const { userId, eventId, updatedEvent } = req.body;
  const userEvents = googleEvents[userId];

  if (!userEvents) return res.status(404).json({ error: 'User not found' });

  const index = userEvents.findIndex(e => e.id === eventId);
  if (index === -1) return res.status(404).json({ error: 'Event not found' });

  userEvents[index] = updatedEvent;
  res.json({ message: 'Google event updated', updatedEvent });
});

// 4. Remove Google Calendar association
// DELETE
router.delete('/google/delete', (req, res) => {
  const { userId } = req.body;
  delete googleEvents[userId];
  res.json({ message: 'Google Calendar association removed' });
});

// 5. Add event to Outlook Calendar
// POST
router.post('/outlook/link', (req, res) => {
  const { userId, event } = req.body;
  if (!userId || !event) {
    return res.status(400).json({ error: 'Missing userId or event data' });
  }

  outlookEvents[userId] = outlookEvents[userId] || [];
  outlookEvents[userId].push(event);

  res.status(201).json({ message: 'Event added to Outlook Calendar', event });
});

// 6. Get Outlook Calendar events for a user
// GET
router.get('/outlook/:userid', (req, res) => {
  const { userid } = req.params;
  const events = outlookEvents[userid] || [];
  res.json(events);
});

// 7. Update Outlook Calendar event
// PUT
router.put('/outlook/update', (req, res) => {
  const { userId, eventId, updatedEvent } = req.body;
  const userEvents = outlookEvents[userId];

  if (!userEvents) return res.status(404).json({ error: 'User not found' });

  const index = userEvents.findIndex(e => e.id === eventId);
  if (index === -1) return res.status(404).json({ error: 'Event not found' });

  userEvents[index] = updatedEvent;
  res.json({ message: 'Outlook event updated', updatedEvent });
});

// 8. Remove Outlook Calendar association
// DELETE
router.delete('/outlook/delete', (req, res) => {
  const { userId } = req.body;
  delete outlookEvents[userId];
  res.json({ message: 'Outlook Calendar association removed' });
});

module.exports = router;
