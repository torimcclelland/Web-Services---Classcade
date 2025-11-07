const express = require("express");
const TimeEntry = require("../models/timeEntry");

const router = express.Router();

// Create time entry
router.post("/", async (req, res) => {
  try {
    const { userId, projectId, taskId, minutes, completed } = req.body;

    if (!userId || !projectId || !taskId || !minutes) {
      return res.status(400).json({
        message: "userId, projectId, taskId, and minutes are required",
      });
    }

    const newEntry = new TimeEntry({
      user: userId,
      project: projectId,
      task: taskId,
      minutes,
      completed: completed || false,
    });

    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    console.error("Time tracking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all time entries for a project
router.get("/:projectId", async (req, res) => {
  try {
    const entries = await TimeEntry.find({ project: req.params.projectId })
      .populate("user", "firstName lastName email")
      .populate("task", "name");

    res.json(entries);
  } catch (err) {
    console.error("Error fetching time logs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user total time tracked in project
router.get("/:projectId/user/:userId", async (req, res) => {
  try {
    const entries = await TimeEntry.find({
      project: req.params.projectId,
      user: req.params.userId,
    });

    const totalMinutes = entries.reduce((sum, e) => sum + e.minutes, 0);
    res.json({ userId: req.params.userId, totalMinutes });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a specific time entry by ID
router.delete("/entry/:entryId", async (req, res) => {
  try {
    const { entryId } = req.params;

    const deleted = await TimeEntry.findByIdAndDelete(entryId);

    if (!deleted) {
      return res.status(404).json({ message: "Time entry not found" });
    }

    res.json({ message: "Time entry deleted successfully", entryId });
  } catch (err) {
    console.error("Error deleting time entry:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
