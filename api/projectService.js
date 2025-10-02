module.exports = {
  createProject: async (data) => await Project.create(data),
  getProjectById: async (id) => await Project.findById(id),
  getAllProjects: async () => await Project.find(),
  updateProject: async (id, data) => await Project.findByIdAndUpdate(id, data, { new: true }),
  updateStatus: async (id, status) => await Project.findByIdAndUpdate(id, { status }, { new: true }),
  deleteProject: async (id) => await Project.findByIdAndDelete(id),
  deleteAllProjects: async () => await Project.deleteMany({}),
  getProgress: async (id) => {getProgress: async (id) => {
  const project = await Project.findById(id);
  if (!project || !project.trackedTime || !project.goalTime) return 0;

  const totalTime = project.trackedTime.reduce((sum, entry) => sum + entry.timeSpent, 0);
  const goal = project.goalTime;

  const progress = (totalTime / goal) * 100;
  return Math.min(progress, 100);
}
},
  getTimeSpent: async (id) => {getTimeSpent: async (id) => {
  const project = await Project.findById(id);
  if (!project || !project.trackedTime) return 0;

  return project.trackedTime.reduce((sum, entry) => sum + entry.timeSpent, 0);
}
},
  getDueDate: async (id) => {getDueDate: async (id) => {
  const project = await Project.findById(id);
  return project?.dueDate || null;
}
},
  getStreak: async (id) => {getStreak: async (id) => {
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
  getMembers: async (id) => {/* logic for member list */},
  addMember: async (id, userId) => {/* push userId to project.members */},
  removeMember: async (id, userId) => {/* pull userId from project.members */},
  getTrackedTime: async (id, userId) => {/* logic for user time */},
  updateTrackedTime: async (id, userId, time) => {/* logic to update time */},
  deleteTrackedTime: async (id, userId) => {/* logic to delete time */}
};