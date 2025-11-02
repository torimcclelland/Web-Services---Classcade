const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Under Review", "Done"],
      default: "Not Started",
    },

    dueDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);