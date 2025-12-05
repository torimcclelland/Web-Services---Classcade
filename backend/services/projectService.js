const express = require("express");
const router = express.Router();
const Project = require("../models/project");
const User = require("../models/user");

// Create project
router.post("/create", async (req, res) => {
  try {
    const {
      name,
      teacherEmail,
      groupmateEmails = [],
      userId,
      dueDate,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Project name is required" });
    }

    if (dueDate) {
      const todayStr = new Date().toISOString().split("T")[0];
      if (dueDate < todayStr) {
        return res
          .status(400)
          .json({ error: "Due date cannot be in the past" });
      }
    }

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    const emails = [user.email, teacherEmail, ...groupmateEmails].filter(
      Boolean
    );
    const users = await User.find({ email: { $in: emails } });

    if (users.length === 0)
      return res.status(400).json({ error: "No valid users found" });

    const memberIds = users.map((u) => u._id);

    const project = await Project.create({
      name: name.trim(),
      members: memberIds,
      dueDate: dueDate || null,
    });

    await User.updateMany(
      { _id: { $in: memberIds } },
      { $push: { projects: project._id.toString() } }
    );

    return res.status(201).json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all projects
router.get("/", async (_req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update project by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update project status
router.put("/:id/status", async (req, res) => {
  try {
    const status = req.body.status?.trim();
    if (!status) throw new Error("Status must be a non-empty string");

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete project by ID
router.delete("/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete all projects
router.delete("/", async (_req, res) => {
  try {
    await Project.deleteMany({});
    res.json({ deletedAll: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get members
router.get("/:id/members", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("members");
    res.json(project.members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add member
router.post("/:id/members", async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (!project.members.includes(userId)) {
      project.members.push(userId);

      project.pendingInvites = project.pendingInvites || [];
      const user = await User.findById(userId);
      if (user && user.email) {
        project.pendingInvites = project.pendingInvites.filter(
          (email) => email.toLowerCase() !== user.email.toLowerCase()
        );
      }

      await project.save();

      await User.findByIdAndUpdate(userId, {
        $push: { projects: project._id },
      });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove member
router.delete("/:id/members/:userId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    project.members = project.members.filter(
      (member) => member.toString() !== req.params.userId
    );
    await project.save();

    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { projects: project._id },
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove pending invite
router.delete("/:id/pendingInvites/:email", async (req, res) => {
  try {
    const projectId = req.params.id;
    const decodedEmail = decodeURIComponent(req.params.email);
    const emailToRemove = decodedEmail.toLowerCase();

    console.log(`Removing pending invite: project=${projectId}, email=${decodedEmail}`);

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    project.pendingInvites = project.pendingInvites || [];
    const beforeCount = project.pendingInvites.length;
    project.pendingInvites = project.pendingInvites.filter(
      (email) => email.toLowerCase() !== emailToRemove
    );
    const afterCount = project.pendingInvites.length;

    await project.save();

    console.log(`Pending invites removed: ${beforeCount - afterCount}`);

    res.json(project);
  } catch (err) {
    console.error('Error removing pending invite:', err);
    res.status(500).json({ error: 'Failed to remove pending invite' });
  }
});

// Get all projects for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const projects = await Project.find({ members: req.params.userId }).select(
      "_id name"
    );

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to get user projects" });
  }
});

// Get all projects for a specific user with details
router.get("/user/:userId/details", async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.params.userId,
    }).populate("members", "username firstName lastName email");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to get user projects" });
  }
});

module.exports = router;
