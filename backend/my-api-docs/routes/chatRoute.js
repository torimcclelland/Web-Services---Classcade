// // go to http://localhost:4000/api-docs to view swagger documentation
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatMessage:
 *       type: object
 *       required:
 *         - sender
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the message
 *         conversationId:
 *           type: string
 *           description: The ID of the conversation this message belongs to
 *         sender:
 *           type: string
 *           description: The ID of the user who sent the message
 *         recipients:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of recipient user IDs
 *         content:
 *           type: string
 *           description: The message content
 *         contentType:
 *           type: string
 *           enum: [text, image, file, system]
 *           default: text
 *           description: The type of message content
 *         repliedTo:
 *           type: string
 *           description: ID of the message this is replying to
 *         isEdited:
 *           type: boolean
 *           default: false
 *           description: Whether the message has been edited
 *         editedAt:
 *           type: string
 *           format: date-time
 *           description: When the message was last edited
 *         reactions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Reaction'
 *           description: Array of reactions to this message
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the message was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the message was last updated
 *       example:
 *         _id: "60d0fe4f5311236168a109ca"
 *         conversationId: "conv_123"
 *         sender: "user_456"
 *         recipients: ["user_789", "user_012"]
 *         content: "Hello everyone!"
 *         contentType: "text"
 *         repliedTo: null
 *         isEdited: false
 *         editedAt: null
 *         reactions: []
 *         createdAt: "2023-10-16T10:30:00.000Z"
 *         updatedAt: "2023-10-16T10:30:00.000Z"
 *     ChatMessageInput:
 *       type: object
 *       required:
 *         - sender
 *         - content
 *       properties:
 *         conversationId:
 *           type: string
 *           description: The ID of the conversation
 *         sender:
 *           type: string
 *           description: The ID of the user sending the message
 *         recipients:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of recipient user IDs
 *         content:
 *           type: string
 *           description: The message content
 *         contentType:
 *           type: string
 *           enum: [text, image, file, system]
 *           default: text
 *           description: The type of message content
 *         repliedTo:
 *           type: string
 *           description: ID of the message this is replying to
 *       example:
 *         conversationId: "conv_123"
 *         sender: "user_456"
 *         recipients: ["user_789", "user_012"]
 *         content: "Hello everyone!"
 *         contentType: "text"
 *         repliedTo: null
 *     ChatMessageUpdate:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: The updated message content
 *       example:
 *         content: "Updated message content"
 *     Reaction:
 *       type: object
 *       required:
 *         - user
 *         - type
 *       properties:
 *         user:
 *           type: string
 *           description: The ID of the user who reacted
 *         type:
 *           type: string
 *           description: The type of reaction (like, love, laugh, etc.)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the reaction was created
 *       example:
 *         user: "user_456"
 *         type: "like"
 *         createdAt: "2023-10-16T10:35:00.000Z"
 *     ReactionInput:
 *       type: object
 *       required:
 *         - user
 *         - type
 *       properties:
 *         user:
 *           type: string
 *           description: The ID of the user reacting
 *         type:
 *           type: string
 *           description: The type of reaction
 *       example:
 *         user: "user_456"
 *         type: "like"
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
 * /api/chat:
 *   post:
 *     summary: Create a new message
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatMessageInput'
 *     responses:
 *       201:
 *         description: Message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatMessage'
 *       400:
 *         description: Invalid input - sender or content missing/invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error creating message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: Get messages (optionally filtered by conversation)
 *     tags: [Chat]
 *     parameters:
 *       - in: query
 *         name: conversationId
 *         schema:
 *           type: string
 *         description: Filter messages by conversation ID
 *         example: "conv_123"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of messages to return
 *         example: 50
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Get messages created before this date
 *         example: "2023-10-16T10:00:00.000Z"
 *     responses:
 *       200:
 *         description: List of messages (sorted by creation date, newest first)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChatMessage'
 *       500:
 *         description: Server error fetching messages
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/chat/{id}:
 *   get:
 *     summary: Get a specific message by ID
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The message ID
 *         example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       200:
 *         description: Message found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatMessage'
 *       404:
 *         description: Message not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error finding message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update a message (edit content)
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The message ID
 *         example: "60d0fe4f5311236168a109ca"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatMessageUpdate'
 *     responses:
 *       200:
 *         description: Message updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatMessage'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Message not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error updating message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a message
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The message ID
 *         example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message successfully deleted"
 *                 item:
 *                   $ref: '#/components/schemas/ChatMessage'
 *       404:
 *         description: Message not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error deleting message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/chat/conversation/{conversationId}:
 *   delete:
 *     summary: Delete an entire conversation (all messages)
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         schema:
 *           type: string
 *         required: true
 *         description: The conversation ID
 *         example: "conv_123"
 *     responses:
 *       200:
 *         description: Conversation deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Conversation successfully deleted"
 *                 deletedCount:
 *                   type: integer
 *                   description: Number of messages deleted
 *                   example: 15
 *       404:
 *         description: Conversation not found or already empty
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error deleting conversation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/chat/{messageId}/reaction:
 *   post:
 *     summary: Add a reaction to a message
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         schema:
 *           type: string
 *         required: true
 *         description: The message ID to react to
 *         example: "60d0fe4f5311236168a109ca"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReactionInput'
 *     responses:
 *       200:
 *         description: Reaction added successfully (replaces existing reaction from same user)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatMessage'
 *       400:
 *         description: Invalid input - user or type missing/invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Message not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error adding reaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/chat/{messageId}/reaction/{userId}:
 *   delete:
 *     summary: Remove a reaction from a message
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         schema:
 *           type: string
 *         required: true
 *         description: The message ID
 *         example: "60d0fe4f5311236168a109ca"
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID whose reaction to remove
 *         example: "user_456"
 *     responses:
 *       200:
 *         description: Reaction removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatMessage'
 *       400:
 *         description: Invalid userId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Reaction or message not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error removing reaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

module.exports = router;