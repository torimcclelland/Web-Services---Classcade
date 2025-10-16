// // go to http://localhost:4000/api-docs to view swagger documentation
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Project
 *   description: Project management endpoints
 *
 * components:
 *   schemas:
 *     TrackedTimeEntry:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         timeSpent:
 *           type: number
 *           description: Time spent in minutes (or project unit)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Project:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *         members:
 *           type: array
 *           items:
 *             type: string
 *         trackedTime:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TrackedTimeEntry'
 *         goalTime:
 *           type: number
 *         dueDate:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "proj_123"
 *         name: "New App"
 *         description: "Build new feature"
 *         status: "active"
 *         members: ["user_1","user_2"]
 *         trackedTime:
 *           - userId: "user_1"
 *             timeSpent: 120
 *         goalTime: 1000
 *         dueDate: "2025-12-01T00:00:00.000Z"
 *     ProjectInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         goalTime:
 *           type: number
 *         dueDate:
 *           type: string
 *           format: date-time
 *       example:
 *         name: "New App"
 *         description: "Build new feature"
 *         goalTime: 1000
 *         dueDate: "2025-12-01T00:00:00.000Z"
 *     ProjectStatusUpdate:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *       example:
 *         status: "completed"
 *     TimeUpdate:
 *       type: object
 *       properties:
 *         timeSpent:
 *           type: number
 *       example:
 *         timeSpent: 60
 *     MemberInput:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *       example:
 *         userId: "user_123"
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
 * /api/project/create:
 *   post:
 *     summary: Create a new project
 *     tags: [Project]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       200:
 *         description: Created project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/project:
 *   get:
 *     summary: Get all projects
 *     tags: [Project]
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/project/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update project by ID
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       200:
 *         description: Updated project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete project by ID
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Deletion result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/project/{id}/status:
 *   put:
 *     summary: Update project status
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectStatusUpdate'
 *     responses:
 *       200:
 *         description: Project status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/project:
 *   delete:
 *     summary: Delete all projects
 *     tags: [Project]
 *     responses:
 *       200:
 *         description: All projects deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedAll:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/project/{id}/progress:
 *   get:
 *     summary: Get project progress percentage based on trackedTime and goalTime
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Progress percent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 progress:
 *                   type: number
 *                   example: 42.5
 *       500:
 *         description: Server error
 *
 * /api/project/{id}/time:
 *   get:
 *     summary: Get total time spent on project
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Total time spent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timeSpent:
 *                   type: number
 *                   example: 360
 *       500:
 *         description: Server error
 *
 * /api/project/{id}/due:
 *   get:
 *     summary: Get due date for project
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Due date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dueDate:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Server error
 *
 * /api/project/{id}/streak:
 *   get:
 *     summary: Get current streak of daily tracked activity
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Streak count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 streak:
 *                   type: integer
 *                   example: 3
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/project/{id}/members:
 *   get:
 *     summary: Get project members
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Members list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Server error
 *   post:
 *     summary: Add a member to project
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemberInput'
 *     responses:
 *       200:
 *         description: Member added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       500:
 *         description: Server error
 *
 * /api/project/{id}/members/{userId}:
 *   delete:
 *     summary: Remove a member from project
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Member removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/project/{id}/time/{userId}:
 *   get:
 *     summary: Get tracked time for a specific user on a project
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Time spent for user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timeSpent:
 *                   type: number
 *                   example: 120
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update tracked time for a user on a project
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TimeUpdate'
 *     responses:
 *       200:
 *         description: Time updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete tracked time for a user on a project
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Tracked time entry removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       500:
 *         description: Server error
 */

module.exports = router;