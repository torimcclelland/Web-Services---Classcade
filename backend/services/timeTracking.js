// routes/timeTracking.js
import express from 'express';
import TimeEntry from '../models/timeEntry.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// POST /time-tracking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { projectId, taskId, minutes, completed } = req.body;

    const newEntry = new TimeEntry({
      user: req.user.id,
      project: projectId,
      task: taskId,
      minutes,
      completed,
    });

    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
