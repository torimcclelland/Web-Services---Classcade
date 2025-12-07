const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["pending", "active", "completed"],
    default: "pending",
  },
  dueDate: { type: Date },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  pendingInvites: [{ type: String }], // Emails of invited non-registered users
  teamMeeting: {
    meetingId: { type: String },
    joinUrl: { type: String },
    topic: { type: String },
    startUrl: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date },
    isActive: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
