// // go to http://localhost:4000/api-docs to view swagger documentation
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Calendar
 *   description: Calendar Management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CalendarEvent:
 *       type: object
 *       required:
 *         - title
 *         - startTime
 *         - endTime
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the event
 *         title:
 *           type: string
 *           description: The title of the event
 *         description:
 *           type: string
 *           description: The description of the event
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: The start time of the event
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: The end time of the event
 *         location:
 *           type: string
 *           description: The location of the event
 *         attendees:
 *           type: array
 *           items:
 *             type: string
 *           description: List of attendee email addresses
 *       example:
 *         id: "evt_123456"
 *         title: "Team Meeting"
 *         description: "Weekly team sync"
 *         startTime: "2023-10-16T10:00:00.000Z"
 *         endTime: "2023-10-16T11:00:00.000Z"
 *         location: "Conference Room A"
 *         attendees: ["user1@example.com", "user2@example.com"]
 *     CalendarEventInput:
 *       type: object
 *       required:
 *         - userId
 *         - event
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user
 *         event:
 *           $ref: '#/components/schemas/CalendarEvent'
 *       example:
 *         userId: "user123"
 *         event:
 *           title: "Team Meeting"
 *           description: "Weekly team sync"
 *           startTime: "2023-10-16T10:00:00.000Z"
 *           endTime: "2023-10-16T11:00:00.000Z"
 *           location: "Conference Room A"
 *           attendees: ["user1@example.com", "user2@example.com"]
 *     CalendarEventUpdate:
 *       type: object
 *       required:
 *         - userId
 *         - eventId
 *         - updatedEvent
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user
 *         eventId:
 *           type: string
 *           description: The ID of the event to update
 *         updatedEvent:
 *           $ref: '#/components/schemas/CalendarEvent'
 *       example:
 *         userId: "user123"
 *         eventId: "evt_123456"
 *         updatedEvent:
 *           title: "Updated Team Meeting"
 *           description: "Updated weekly team sync"
 *           startTime: "2023-10-16T11:00:00.000Z"
 *           endTime: "2023-10-16T12:00:00.000Z"
 *     CalendarDeleteInput:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user
 *       example:
 *         userId: "user123"
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
 * /api/calendar/google/link:
 *   post:
 *     summary: Add a new Google Calendar event
 *     tags: [Calendar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalendarEventInput'
 *     responses:
 *       201:
 *         description: Google Calendar event added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Google Calendar event added"
 *                 event:
 *                   $ref: '#/components/schemas/CalendarEvent'
 *       400:
 *         description: Missing userId or event data
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
 * /api/calendar/google/{userid}:
 *   get:
 *     summary: Get all Google Calendar events for a user
 *     tags: [Calendar]
 *     parameters:
 *       - in: path
 *         name: userid
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *         example: "user123"
 *     responses:
 *       200:
 *         description: List of Google Calendar events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CalendarEvent'
 *       404:
 *         description: No events found for this user
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
 * /api/calendar/google/update:
 *   put:
 *     summary: Update a Google Calendar event
 *     tags: [Calendar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalendarEventUpdate'
 *     responses:
 *       200:
 *         description: Google Calendar event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Google Calendar event updated"
 *                 updatedEvent:
 *                   $ref: '#/components/schemas/CalendarEvent'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Invalid input data
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
 * /api/calendar/google/delete:
 *   delete:
 *     summary: Remove Google Calendar association for a user
 *     tags: [Calendar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalendarDeleteInput'
 *     responses:
 *       200:
 *         description: Google Calendar association removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Google Calendar association removed"
 *       400:
 *         description: Missing userId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No Google Calendar found for this user
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
 * /api/calendar/outlook/link:
 *   post:
 *     summary: Add a new Outlook Calendar event
 *     tags: [Calendar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalendarEventInput'
 *     responses:
 *       201:
 *         description: Outlook Calendar event added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Outlook Calendar event added"
 *                 event:
 *                   $ref: '#/components/schemas/CalendarEvent'
 *       400:
 *         description: Missing userId or event data
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
 * /api/calendar/outlook/{userid}:
 *   get:
 *     summary: Get all Outlook Calendar events for a user
 *     tags: [Calendar]
 *     parameters:
 *       - in: path
 *         name: userid
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *         example: "user123"
 *     responses:
 *       200:
 *         description: List of Outlook Calendar events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CalendarEvent'
 *       404:
 *         description: No events found for this user
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
 * /api/calendar/outlook/update:
 *   put:
 *     summary: Update an Outlook Calendar event
 *     tags: [Calendar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalendarEventUpdate'
 *     responses:
 *       200:
 *         description: Outlook Calendar event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Outlook Calendar event updated"
 *                 updatedEvent:
 *                   $ref: '#/components/schemas/CalendarEvent'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Invalid input data
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
 * /api/calendar/outlook/delete:
 *   delete:
 *     summary: Remove Outlook Calendar association for a user
 *     tags: [Calendar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalendarDeleteInput'
 *     responses:
 *       200:
 *         description: Outlook Calendar association removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Outlook Calendar association removed"
 *       400:
 *         description: Missing userId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No Outlook Calendar found for this user
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

module.exports = router;