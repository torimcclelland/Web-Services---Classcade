const express = require('express');
const router = express.Router();
const Group = require('../models/group');

// CREATE a new group
router.post('/create', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.name) payload.name = payload.name.trim();
    const group = await Group.create(payload);
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET group by ID
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE group by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Group.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE group by ID
router.delete('/:id', async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE all groups
router.delete('/', async (req, res) => {
  try {
    await Group.deleteMany({});
    res.json({ deletedAll: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET users in group
router.get('/:id/users', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('users');
    res.json(group.users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD user to group
router.post('/:id/users', async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group.users.includes(userId)) {
      group.users.push(userId);
      await group.save();
    }
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REMOVE user from group
router.delete('/:id/users/:userId', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    group.users = group.users.filter(
      (user) => user.toString() !== req.params.userId
    );
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET projects in group
router.get('/:id/projects', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('projects');
    res.json(group.projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD project to group
router.post('/:id/projects', async (req, res) => {
  try {
    const { projectId } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group.projects.includes(projectId)) {
      group.projects.push(projectId);
      await group.save();
    }
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REMOVE project from group
router.delete('/:id/projects/:projectId', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    group.projects = group.projects.filter(
      (project) => project.toString() !== req.params.projectId
    );
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
