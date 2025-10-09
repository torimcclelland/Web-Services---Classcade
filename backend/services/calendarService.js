// services/calendarService.js

// 8 methods
// divided into Google and Outlook methods

const express = require('express');
const router = express.Router();
const Calendar = require('../models/calendar');


// Google Calendar sect.:

// 1. Add Google event
// POST
router.post('/google/link', (req, res) => {
  const { userId, event } = req.body;
  if (!userId || !event) return res.status(400).json({ error: 'Missing userId or event' });

  const added = Calendar.addEvent('google', userId, event);
  res.status(201).json({ message: 'Google Calendar event added', event: added });
});

// 2. Get Google events
// GET
router.get('/google/:userid', (req, res) => {
  const events = Calendar.getEvents('google', req.params.userid);
  res.json(events);
});

// 3. Update Google event
// PUT
router.put('/google/update', (req, res) => {
  const { userId, eventId, updatedEvent } = req.body;
  const updated = Calendar.updateEvent('google', userId, eventId, updatedEvent);

  if (!updated) return res.status(404).json({ error: 'Event not found' });
  res.json({ message: 'Google Calendar event updated', updatedEvent: updated });
});

// 4. Remove Google calendar
// DELETE
router.delete('/google/delete', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  const removed = Calendar.removeUserCalendar('google', userId);
  if (!removed) return res.status(404).json({ error: 'No Google Calendar found for this user' });

  res.json({ message: 'Google Calendar association removed' });
});


// Outlook Calendar sect.:

// 5. Add Outlook event
// POST
router.post('/outlook/link', (req, res) => {
  const { userId, event } = req.body;
  if (!userId || !event) return res.status(400).json({ error: 'Missing userId or event' });

  const added = Calendar.addEvent('outlook', userId, event);
  res.status(201).json({ message: 'Outlook Calendar event added', event: added });
});

// 6. Get Outlook events
// GET
router.get('/outlook/:userid', (req, res) => {
  const events = Calendar.getEvents('outlook', req.params.userid);
  res.json(events);
});

// 7. Update Outlook event
// PUT
router.put('/outlook/update', (req, res) => {
  const { userId, eventId, updatedEvent } = req.body;
  const updated = Calendar.updateEvent('outlook', userId, eventId, updatedEvent);

  if (!updated) return res.status(404).json({ error: 'Event not found' });
  res.json({ message: 'Outlook Calendar event updated', updatedEvent: updated });
});

// 8. Remove Outlook calendar
// DELETE
router.delete('/outlook/delete', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  const removed = Calendar.removeUserCalendar('outlook', userId);
  if (!removed) return res.status(404).json({ error: 'No Outlook Calendar found for this user' });

  res.json({ message: 'Outlook Calendar association removed' });
});

module.exports = router;
