const express = require("express");
const Task = require("../models/task");

const router = express.Router();

const normalizePriority = (priority) => {
  if (!priority) return undefined;
  const normalized =
    typeof priority === "string"
      ? priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()
      : priority;
  const valid = ["High", "Medium", "Low"];
  return valid.includes(normalized) ? normalized : undefined;
};

// Get tasks by project (unique route to avoid conflicts)
router.get("/getByProject/:projectId", async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.json(tasks);
  } catch (err) {
    console.error("Failed to fetch tasks for project:", err);
    res.status(500).json({ error: "Failed to fetch tasks for project" });
  }
});

// Create a task in a project
router.post("/:projectid", async (req, res) => {
  try {
    const { name, description, assignedTo, dueDate, priority } = req.body;
    const normalizedPriority = normalizePriority(priority) || "Medium";

    const created = await Task.create({
      projectId: req.params.projectid,
      name,
      description,
      assignedTo,
      dueDate,
      status: req.body.status || "Not Started",
      priority: normalizedPriority,
    });

    res.status(201).json(created);
  } catch (err) {
    console.error("Failed to create task:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Project report
router.get("/:projectid/getreport", async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectid });

    const completed = tasks.filter((t) => t.status === "Done").length;

    res.json({
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
    });
  } catch (err) {
    console.error("Failed to get report:", err);
    res.status(500).json({ error: "Failed to get report" });
  }
});

// User-specific report in project
router.get("/:projectid/getreport/:userid", async (req, res) => {
  try {
    const tasks = await Task.find({
      projectId: req.params.projectid,
      assignedTo: req.params.userid,
    });

    const completed = tasks.filter((t) => t.status === "Done").length;

    res.json({
      user: req.params.userid,
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
    });
  } catch (err) {
    console.error("Failed to get user report:", err);
    res.status(500).json({ error: "Failed to get user report" });
  }
});

// Export tasks report JSON
router.get("/:projectid/exportreport", async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectid });
    res.json(tasks);
  } catch (err) {
    console.error("Failed to export report:", err);
    res.status(500).json({ error: "Failed to export report" });
  }
});

// Get all tasks in a project
router.get("/:projectid", async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectid }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Get a specific task
router.get("/:projectid/:taskid", async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskid,
      projectId: req.params.projectid,
    });

    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error("Failed to fetch task:", err);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// Update a task
router.put("/:projectid/:taskid", async (req, res) => {
  try {
    const updateBody = { ...req.body };
    if (Object.prototype.hasOwnProperty.call(req.body, "priority")) {
      const normalizedPriority =
        normalizePriority(req.body.priority) || "Medium";
      updateBody.priority = normalizedPriority;
    }

    const updated = await Task.findOneAndUpdate(
      { _id: req.params.taskid, projectId: req.params.projectid },
      updateBody,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Task not found" });
    res.json(updated);
  } catch (err) {
    console.error("Failed to update task:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete a task
router.delete("/:projectid/:taskid", async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.taskid,
      projectId: req.params.projectid,
    });

    if (!deleted) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Failed to delete task:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Update a task by ID only (for drag-and-drop)
router.put("/update/:taskid", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.taskid,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Task not found" });
    res.json(updated);
  } catch (err) {
    console.error("Failed to update task:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Get a task by ID only (for modal editing)
router.get("/getById/:taskid", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskid);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error("Failed to fetch task by ID:", err);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// Check if a task exists
router.get("/exists/:taskid", async (req, res) => {
  try {
    const exists = await Task.exists({ _id: req.params.taskid });
    res.json({ exists: !!exists });
  } catch (err) {
    console.error("Failed to check task existence:", err);
    res.status(500).json({ error: "Failed to check task" });
  }
});

// Partially update a task
router.patch("/:projectid/:taskid", async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.taskid, projectId: req.params.projectid },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Task not found" });
    res.json(updated);
  } catch (err) {
    console.error("Failed to patch task:", err);
    res.status(500).json({ error: "Failed to patch task" });
  }
});


module.exports = router;
