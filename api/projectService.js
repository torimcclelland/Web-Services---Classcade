module.exports = {
  createProject: async (data) => await Project.create(data),
  getProjectById: async (id) => await Project.findById(id),
  getAllProjects: async () => await Project.find(),
  updateProject: async (id, data) => await Project.findByIdAndUpdate(id, data, { new: true }),
  updateStatus: async (id, status) => await Project.findByIdAndUpdate(id, { status }, { new: true }),
  deleteProject: async (id) => await Project.findByIdAndDelete(id),
  deleteAllProjects: async () => await Project.deleteMany({}),
  getProgress: async (id) => {
    getProgress: async (id) => {
      const project = await Project.findById(id);
      if (!project || !project.trackedTime || !project.goalTime) return 0;

      const totalTime = project.trackedTime.reduce((sum, entry) => sum + entry.timeSpent, 0);
      const goal = project.goalTime;

      const progress = (totalTime / goal) * 100;
      return Math.min(progress, 100);
    }
  },
  getTimeSpent: async (id) => {
    getTimeSpent: async (id) => {
      const project = await Project.findById(id);
      if (!project || !project.trackedTime) return 0;

      return project.trackedTime.reduce((sum, entry) => sum + entry.timeSpent, 0);
    }
  },
  getDueDate: async (id) => {
    getDueDate: async (id) => {
      const project = await Project.findById(id);
      return project?.dueDate || null;
    }
  },
  getStreak: async (id) => {
    getStreak: async (id) => {
      const project = await Project.findById(id);
      if (!project || !project.trackedTime) return 0;

      const today = new Date().toDateString();
      let streak = 0;

      const dates = project.trackedTime
        .map(entry => new Date(entry.updatedAt).toDateString())
        .filter((v, i, a) => a.indexOf(v) === i)

      for (let i = dates.length - 1; i >= 0; i--) {
        const date = new Date(dates[i]);
        const expected = new Date();
        expected.setDate(expected.getDate() - streak);

        if (date.toDateString() === expected.toDateString()) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    }
  },
  getMembers: async (id) => {
    getMembers: async (id) => {
      const project = await Project.findById(id).populate('members');
      if (!project) throw new Error('Project not found');
      return project.members;
    }
  },
  addMember: async (id, userId) => {
    const project = await Project.findById(id);
    if (!project) throw new Error('Project not found');

    if (project.members.includes(userId)) {
      throw new Error('User is already a member');
    }

    project.members.push(userId);
    await project.save();
    return project;
  },
  removeMember: async (id, userId) => {
    const project = await Project.findById(id);
    if (!project) throw new Error('Project not found');

    project.members = project.members.filter(
      member => member.toString() !== userId
    );
    await project.save();
    return project;
  },
  getTrackedTime: async (id, userId) => {
    const project = await Project.findById(id);
    if (!project) throw new Error('Project not found');

    if (!project.members.includes(userId)) {
      throw new Error('User is not a member of this project');
    }

    const entry = project.trackedTime.find(
      t => t.userId.toString() === userId
    );
    return entry?.timeSpent || 0;
  },
  updateTrackedTime: async (id, userId, time) => {
    const project = await Project.findById(id);
    if (!project) throw new Error('Project not found');

    if (!project.members.includes(userId)) {
      throw new Error('User is not a member of this project');
    }

    const entry = project.trackedTime.find(
      t => t.userId.toString() === userId
    );

    if (entry) {
      entry.timeSpent = time;
    } else {
      project.trackedTime.push({ userId, timeSpent: time });
    }

    await project.save();
    return project;
  },
  deleteTrackedTime: async (id, userId) => {
    const project = await Project.findById(id);
    if (!project) throw new Error('Project not found');

    if (!project.members.includes(userId)) {
      throw new Error('User is not a member of this project');
    }

    project.trackedTime = project.trackedTime.filter(
      t => t.userId.toString() !== userId
    );

    await project.save();
    return project;
  }
};

require('dotenv').config();
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, {versionKey: false}
);

module.exports = mongoose.model('Notification', notificationSchema);