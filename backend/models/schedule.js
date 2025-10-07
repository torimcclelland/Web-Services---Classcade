
// schedule.js 
// has schemas for:
// meeting
// availability
// schedule

const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: String,
  startTime: Date,
  endTime: Date,
  createdBy: String, 
  isRecurring: { type: Boolean, default: false }
});

const availabilitySchema = new mongoose.Schema({
  userId: String,
  availableTimes: [String] 
});

const scheduleSchema = new mongoose.Schema({
  groupId: {
    type: String,
    required: true,
    unique: true
  },
  meetings: [meetingSchema],
  availability: [availabilitySchema]
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
