const express = require("express");
const TimeEntry = require("../models/timeEntry");

const router = express.Router();

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

module.exports = router;
