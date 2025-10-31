
import mongoose from 'mongoose';

const timeEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // reference to users
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task', // reference to tasks
    required: true
  },
  minutes: {
    type: Number,
    required: true,
    min: 1
  },
  completed: {
    type: Boolean,
    default: false
  },
  entryDate: {
    type: Date,
    default: Date.now
  }
});

const TimeEntry = mongoose.model('TimeEntry', timeEntrySchema);
export default TimeEntry;
