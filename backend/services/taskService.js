const express = require('express');
const Task = require('../models/task');

const router = express.Router();

// -----------------------------
// Get tasks by project (unique route to avoid conflicts)
// -----------------------------
router.get('/getByProject/:projectId', async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.json(tasks);
  } catch (err) {
    console.error('Failed to fetch tasks for project:', err);
    res.status(500).json({ error: 'Failed to fetch tasks for project' });
  }
});

// -----------------------------
// Create a task in a project
// -----------------------------
router.post('/:projectid', async (req, res) => {
  try {
    const { name, description, assignedTo, dueDate } = req.body;

    const created = await Task.create({
      projectId: req.params.projectid,
      name,
      description,
      assignedTo,
      dueDate,
      status: req.body.status || "Not Started",
    });

    res.status(201).json(created);
  } catch (err) {
    console.error('Failed to create task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// -----------------------------
// Get all tasks in a project (legacy route)
// -----------------------------
router.get('/:projectid', async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectid }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Failed to fetch tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// -----------------------------
// Get a specific task
// -----------------------------
router.get('/:projectid/:taskid', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskid,
      projectId: req.params.projectid,
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error('Failed to fetch task:', err);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// -----------------------------
// Update a task
// -----------------------------
router.put('/:projectid/:taskid', async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.taskid, projectId: req.params.projectid },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Task not found' });
    res.json(updated);
  } catch (err) {
    console.error('Failed to update task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});


router.delete('/:projectid/:taskid', async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.taskid,
      projectId: req.params.projectid,
    });

    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Failed to delete task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;