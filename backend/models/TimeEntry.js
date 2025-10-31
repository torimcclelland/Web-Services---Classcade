

// models/TimeEntry.js
import mongoose from 'mongoose';

const timeEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  minutes: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  entryDate: { type: Date, default: Date.now },
});

export default mongoose.model('TimeEntry', timeEntrySchema);


