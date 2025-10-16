// // go to http://localhost:4000/api-docs to view swagger documentation
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Schedule
 *   description: Scheduling API for group availability and meetings
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AvailabilitySlot:
 *       type: object
 *       properties:
 *         day:
 *           type: string
 *           description: Day of week (e.g., Monday)
 *         availableTimes:
 *           type: array
 *           items:
 *             type: string
 *             description: Time slot string or ISO time
 *       example:
 *         day: "Monday"
 *         availableTimes: ["09:00-10:00","14:00-15:00"]
 *     Meeting:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         attendees:
 *           type: array
 *           items:
 *             type: string
 *         isRecurring:
 *           type: boolean
 *       example:
 *         _id: "m_12345"
 *         title: "Team Sync"
 *         startTime: "2025-10-20T15:00:00.000Z"
 *         endTime: "2025-10-20T15:30:00.000Z"
 *         attendees: ["user_1","user_2"]
 *         isRecurring: false
 *     MeetingInput:
 *       type: object
 *       required:
 *         - title
 *         - startTime
 *         - endTime
 *       properties:
 *         title:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         attendees:
 *           type: array
 *           items:
 *             type: string
 *       example:
 *         title: "Planning"
 *         startTime: "2025-10-21T13:00:00.000Z"
 *         endTime: "2025-10-21T14:00:00.000Z"
 *         attendees: ["user_1","user_2"]
 *     Suggestion:
 *       type: object
 *       properties:
 *         suggestions:
 *           type: array
 *           items:
 *             type: string
 *       example:
 *         suggestions: ["2025-10-22T09:00:00Z","2025-10-22T11:00:00Z"]
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /api/schedule/{groupId}/availability:
 *   get:
 *     summary: Get availability for group members
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID to fetch availability for
 *     responses:
 *       200:
 *         description: Availability array for the group
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AvailabilitySlot'
 *       404:
 *         description: Schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/schedule/{groupId}/suggest:
 *   post:
 *     summary: Suggest meeting times based on group availability
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               durationMinutes:
 *                 type: integer
 *                 description: Desired meeting duration in minutes
 *             example:
 *               durationMinutes: 30
 *     responses:
 *       200:
 *         description: Suggested meeting times
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Suggestion'
 *       404:
 *         description: Schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/schedule/{groupId}/meetings:
 *   post:
 *     summary: Create a meeting for a group
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MeetingInput'
 *     responses:
 *       201:
 *         description: Meeting created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       404:
 *         description: Schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error creating meeting
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/schedule/{groupId}/meetings/recurring:
 *   post:
 *     summary: Create a recurring meeting for a group
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MeetingInput'
 *     responses:
 *       201:
 *         description: Recurring meeting created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       404:
 *         description: Schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error creating recurring meeting
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/schedule/{groupId}/meetings/{meetingId}:
 *   put:
 *     summary: Update meeting time
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
 *       - in: path
 *         name: meetingId
 *         schema:
 *           type: string
 *         required: true
 *         description: Meeting ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *             example:
 *               startTime: "2025-10-22T13:00:00.000Z"
 *               endTime: "2025-10-22T14:00:00.000Z"
 *     responses:
 *       200:
 *         description: Meeting updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       404:
 *         description: Meeting or schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error updating meeting
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a meeting
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
 *       - in: path
 *         name: meetingId
 *         schema:
 *           type: string
 *         required: true
 *         description: Meeting ID
 *     responses:
 *       200:
 *         description: Meeting deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 schedule:
 *                   type: object
 *       404:
 *         description: Meeting or schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error deleting meeting
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

module.exports = router;