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
  goalTime: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
