const express = require('express');
const Task = require('../models/task');

const router = express.Router();

// Get task completion report for project
router.get('/:projectid/getreport', async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectid });
    const completed = tasks.filter((t) => t.completed).length;
    res.json({
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
    });
  } catch (err) {
    console.error('Failed to get report:', err);
    res.status(500).json({ error: 'Failed to get report' });
  }
});

// Get task completion report for a specific user
router.get('/:projectid/getreport/:userid', async (req, res) => {
  try {
    const tasks = await Task.find({
      projectId: req.params.projectid,
      assignedTo: req.params.userid,
    });
    const completed = tasks.filter((t) => t.completed).length;
    res.json({
      user: req.params.userid,
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
    });
  } catch (err) {
    console.error('Failed to get user report:', err);
    res.status(500).json({ error: 'Failed to get user report' });
  }
});

// Export task completion report (e.g., CSV/JSON)
router.get('/:projectid/exportreport', async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectid });
    // For now just export as JSON, you can later add CSV/Excel
    res.json(tasks);
  } catch (err) {
    console.error('Failed to export report:', err);
    res.status(500).json({ error: 'Failed to export report' });
  }
});

// Create a task in a project
router.post('/:projectid', async (req, res) => {
  try {
    const { name, description, assignedTo, dueDate } = req.body;
    const created = await Task.create({
      projectId: req.params.projectid,
      name,
      description,
      assignedTo,
      dueDate,
    });
    res.status(201).json(created);
  } catch (err) {
    console.error('Failed to create task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Get all tasks in a project
router.get('/:projectid', async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectid });
    res.json(tasks);
  } catch (err) {
    console.error('Failed to fetch tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get a specific task
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

// Update a task
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

// Delete a task
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