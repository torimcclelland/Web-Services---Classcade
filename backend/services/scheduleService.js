// scheduleService.js
// 6 methods

const express = require('express');
const router = express.Router();

// connect schedule.js with scheduleService.js
const Schedule = require('../models/schedule');

// 1. Get availability for group members
// GET
async function getAvailability(groupId) {
  const schedule = await Schedule.findOne({ groupId });
  if (!schedule) throw new Error('Schedule not found');
  return schedule.availability;
}

// 2. Suggest meeting times based on availability
// POST
async function suggestMeetingTimes(groupId) {
  const schedule = await Schedule.findOne({ groupId }); // finds availability by group
  if (!schedule) throw new Error('Schedule not found');

  const allAvailability = schedule.availability.map(a => a.availableTimes);
  if (allAvailability.length === 0) return [];

  
  let common = allAvailability[0]; // this array stores the "free time" that the team has in common
  for (let i = 1; i < allAvailability.length; i++) {
    common = common.filter(time => allAvailability[i].includes(time)); // this is when everyone is free
  }

  return common; // this array holds all the times the whole team is free
}


// 3. Create a meeting 
// NOTE: By default, this will not be recurring
// NOTE: For a recurring meeting, use the next method (createRecurringMeeting)
// POST
async function createMeeting(groupId, meetingData) {
  const schedule = await Schedule.findOne({ groupId }); 
  if (!schedule) throw new Error('Schedule not found');

  schedule.meetings.push({
    ...meetingData, // this could be time, meeting title, who's attending --> anything else you guys could think of for meeting-related data?
    isRecurring: false
  });
  return await schedule.save();
}


// 4. Create recurring meeting
// POST
async function createRecurringMeeting(groupId, meetingData) {
  const schedule = await Schedule.findOne({ groupId });
  if (!schedule) throw new Error('Schedule not found');

  schedule.meetings.push({
    ...meetingData,
    isRecurring: true // main difference between this method and the reg createMeeting method 
  });
  return await schedule.save();
}


// 5. Update meeting time
// PUT
async function updateMeetingTime(groupId, meetingId, newTimes) {
  const schedule = await Schedule.findOne({ groupId });
  if (!schedule) throw new Error('Schedule not found');

  const meeting = schedule.meetings.id(meetingId);
  if (!meeting) throw new Error('Meeting not found');

  if (newTimes.startTime) meeting.startTime = newTimes.startTime;
  if (newTimes.endTime) meeting.endTime = newTimes.endTime;

  return await schedule.save();
}


// 6. Delete meeting
// DELETE
async function deleteMeeting(groupId, meetingId) {
  const schedule = await Schedule.findOne({ groupId });
  if (!schedule) throw new Error('Schedule not found');

  const meeting = schedule.meetings.id(meetingId);
  if (!meeting) throw new Error('Meeting not found');

  meeting.remove();
  return await schedule.save();
}

module.exports = {
  getAvailability,
  suggestMeetingTimes,
  createMeeting,
  createRecurringMeeting,
  updateMeetingTime,
  deleteMeeting
};

module.exports = router;