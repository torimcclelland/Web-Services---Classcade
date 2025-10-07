const Project = require('../models/project');

const createProject = async (data) => {
  const payload = { ...data };
  if (payload.name) {
    payload.name = payload.name.trim();
  }
  return Project.create(payload);
};

const getProjectById = (id) => Project.findById(id);

const getAllProjects = () => Project.find();

const updateProject = (id, data) =>
  Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const updateStatus = (id, status) => {
  if (typeof status !== 'string' || !status.trim()) {
    throw new Error('Status must be a non-empty string');
  }
  return Project.findByIdAndUpdate(id, { status: status.trim() }, { new: true, runValidators: true });
};

const deleteProject = (id) => Project.findByIdAndDelete(id);

const deleteAllProjects = () => Project.deleteMany({});

const getProgress = async (id) => {
  const project = await Project.findById(id);
  if (!project || !Array.isArray(project.trackedTime) || !project.goalTime) {
    return 0;
  }

  const totalTime = project.trackedTime.reduce(
    (sum, entry) => sum + (Number(entry.timeSpent) || 0),
    0
  );
  if (!project.goalTime) {
    return 0;
  }

  const progress = (totalTime / project.goalTime) * 100;
  return Math.min(progress, 100);
};

const getTimeSpent = async (id) => {
  const project = await Project.findById(id);
  if (!project || !Array.isArray(project.trackedTime)) {
    return 0;
  }

  return project.trackedTime.reduce(
    (sum, entry) => sum + (Number(entry.timeSpent) || 0),
    0
  );
};

const getDueDate = async (id) => {
  const project = await Project.findById(id);
  return project?.dueDate ?? null;
};

const getStreak = async (id) => {
  const project = await Project.findById(id);
  if (!project || !Array.isArray(project.trackedTime) || project.trackedTime.length === 0) {
    return 0;
  }

  const today = new Date();
  let streak = 0;

  // trackedTime does not store dates by default; allow optional updatedAt fallback
  const uniqueDates = project.trackedTime
    .map((entry) => entry.updatedAt || entry.createdAt)
    .filter(Boolean)
    .map((date) => new Date(date).toDateString())
    .filter((value, index, array) => array.indexOf(value) === index)
    .sort((a, b) => new Date(a) - new Date(b));

  for (let i = uniqueDates.length - 1; i >= 0; i -= 1) {
    const current = new Date(uniqueDates[i]);
    const expected = new Date(today);
    expected.setDate(expected.getDate() - streak);

    if (current.toDateString() === expected.toDateString()) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
};

const getMembers = async (id) => {
  const project = await Project.findById(id).populate('members');
  if (!project) {
    throw new Error('Project not found');
  }
  return project.members;
};

const addMember = async (id, userId) => {
  if (!userId) {
    throw new Error('userId is required');
  }

  const project = await Project.findById(id);
  if (!project) {
    throw new Error('Project not found');
  }

  const exists = project.members.some((member) => member.toString() === String(userId));
  if (exists) {
    throw new Error('User is already a member');
  }

  project.members.push(userId);
  await project.save();
  return project;
};

const removeMember = async (id, userId) => {
  const project = await Project.findById(id);
  if (!project) {
    throw new Error('Project not found');
  }

  project.members = project.members.filter((member) => member.toString() !== String(userId));
  await project.save();
  return project;
};

const getTrackedTime = async (id, userId) => {
  const project = await Project.findById(id);
  if (!project) {
    throw new Error('Project not found');
  }

  const entry = project.trackedTime.find((item) => item.userId?.toString() === String(userId));
  return entry ? Number(entry.timeSpent) || 0 : 0;
};

const updateTrackedTime = async (id, userId, timeSpent) => {
  if (!Number.isFinite(timeSpent)) {
    throw new Error('timeSpent must be a number');
  }

  const project = await Project.findById(id);
  if (!project) {
    throw new Error('Project not found');
  }

  const entry = project.trackedTime.find((item) => item.userId?.toString() === String(userId));
  if (entry) {
    entry.timeSpent = timeSpent;
  } else {
    project.trackedTime.push({ userId, timeSpent });
  }

  await project.save();
  return project;
};

const deleteTrackedTime = async (id, userId) => {
  const project = await Project.findById(id);
  if (!project) {
    throw new Error('Project not found');
  }

  project.trackedTime = project.trackedTime.filter(
    (item) => item.userId?.toString() !== String(userId)
  );

  await project.save();
  return project;
};

module.exports = {
  createProject,
  getProjectById,
  getAllProjects,
  updateProject,
  updateStatus,
  deleteProject,
  deleteAllProjects,
  getProgress,
  getTimeSpent,
  getDueDate,
  getStreak,
  getMembers,
  addMember,
  removeMember,
  getTrackedTime,
  updateTrackedTime,
  deleteTrackedTime,
};
