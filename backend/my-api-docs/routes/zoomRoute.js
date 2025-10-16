// // go to http://localhost:4000/api-docs to view swagger documentation
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Zoom
 *   description: Zoom integration endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ZoomMeeting:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         topic:
 *           type: string
 *         start_time:
 *           type: string
 *           format: date-time
 *         duration:
 *           type: integer
 *         join_url:
 *           type: string
 *       example:
 *         id: "123456789"
 *         topic: "Team Sync"
 *         start_time: "2025-10-22T15:00:00Z"
 *         duration: 30
 *         join_url: "https://zoom.us/j/123456789"
 *     ZoomConnectInput:
 *       type: object
 *       required:
 *         - userId
 *         - code
 *       properties:
 *         userId:
 *           type: string
 *         code:
 *           type: string
 *       example:
 *         userId: "user_123"
 *         code: "authorization_code_here"
 *     ZoomConnectResponse:
 *       type: object
 *       properties:
 *         connected:
 *           type: boolean
 *       example:
 *         connected: true
 *     ZoomDisconnectResponse:
 *       type: object
 *       properties:
 *         disconnected:
 *           type: boolean
 *       example:
 *         disconnected: true
 *     ZoomUpdateRequest:
 *       type: object
 *       description: Partial meeting update payload forwarded to Zoom API
 *       example:
 *         topic: "Updated topic"
 *         start_time: "2025-10-22T16:00:00Z"
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
 * /api/zoom/connect:
 *   post:
 *     summary: Connect a user to Zoom using OAuth authorization code
 *     tags: [Zoom]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ZoomConnectInput'
 *     responses:
 *       200:
 *         description: Zoom account connected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ZoomConnectResponse'
 *       400:
 *         description: Missing or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server or Zoom API error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/zoom/{userId}/meetings:
 *   get:
 *     summary: Get Zoom meetings for a connected user
 *     tags: [Zoom]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID in the system
 *     responses:
 *       200:
 *         description: List of meetings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ZoomMeeting'
 *       404:
 *         description: User not found or Zoom not connected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server or Zoom API error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/zoom/{userId}/meetings/{meetingId}:
 *   patch:
 *     summary: Update a Zoom meeting for a user
 *     tags: [Zoom]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID in the system
 *       - in: path
 *         name: meetingId
 *         schema:
 *           type: string
 *         required: true
 *         description: Zoom meeting ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ZoomUpdateRequest'
 *     responses:
 *       200:
 *         description: Meeting updated (returns Zoom meeting object)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ZoomMeeting'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User or meeting not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server or Zoom API error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/zoom/{userId}/disconnect:
 *   delete:
 *     summary: Disconnect a user's Zoom account (revoke tokens)
 *     tags: [Zoom]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID in the system
 *     responses:
 *       200:
 *         description: Zoom account disconnected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ZoomDisconnectResponse'
 *       404:
 *         description: User not found or not connected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server or Zoom API error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

module.exports = router;