// // go to http://localhost:4000/api-docs to view swagger documentation
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: Notifction management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - recipientId
 *         - title
 *         - body
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         recipientId:
 *           type: string
 *           description: ID of the notification recipient
 *         senderId:
 *           type: string
 *           description: ID of the sender (optional)
 *         title:
 *           type: string
 *           description: Notification title
 *         body:
 *           type: string
 *           description: Notification body content
 *         read:
 *           type: boolean
 *           description: Whether the notification was read
 *           default: false
 *         data:
 *           type: object
 *           description: Optional payload object for additional metadata
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "6512bc1a4f1c2b001234abcd"
 *         recipientId: "user_123"
 *         senderId: "user_456"
 *         title: "New Assignment"
 *         body: "You have a new assignment due next week."
 *         read: false
 *         data: { "assignmentId": "asg_789" }
 *         createdAt: "2025-10-16T12:00:00.000Z"
 *         updatedAt: "2025-10-16T12:00:00.000Z"
 *     NotificationInput:
 *       type: object
 *       required:
 *         - recipientId
 *         - title
 *         - body
 *       properties:
 *         recipientId:
 *           type: string
 *         senderId:
 *           type: string
 *         title:
 *           type: string
 *         body:
 *           type: string
 *         data:
 *           type: object
 *       example:
 *         recipientId: "user_123"
 *         senderId: "user_456"
 *         title: "New Assignment"
 *         body: "You have a new assignment due next week."
 *         data: { "assignmentId": "asg_789" }
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
 * /api/notification:
 *   post:
 *     summary: Create a notification
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationInput'
 *     responses:
 *       201:
 *         description: Notification created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Invalid input
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
 * /api/notification/user/{userId}:
 *   get:
 *     summary: Get notifications for a user (most recent first)
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: Recipient user ID
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/notification/{id}:
 *   get:
 *     summary: Get a notification by ID
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notification not found
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
 *   put:
 *     summary: Update a notification by ID
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Notification ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               read:
 *                 type: boolean
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Notification updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notification not found
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
 *   delete:
 *     summary: Delete a notification by ID
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Notification not found
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