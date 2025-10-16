// // go to http://localhost:4000/api-docs to view swagger documentation
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Task
 *   description: Task management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - name
 *         - projectId
 *       properties:
 *         _id:
 *           type: string
 *         projectId:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         assignedTo:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date-time
 *         completed:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "task_123"
 *         projectId: "proj_456"
 *         name: "Write tests"
 *         description: "Add unit tests for service"
 *         assignedTo: "user_1"
 *         dueDate: "2025-10-30T12:00:00.000Z"
 *         completed: false
 *         createdAt: "2025-10-16T12:00:00.000Z"
 *         updatedAt: "2025-10-16T12:00:00.000Z"
 *     TaskInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         assignedTo:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date-time
 *         completed:
 *           type: boolean
 *       example:
 *         name: "Write tests"
 *         description: "Add unit tests for service"
 *         assignedTo: "user_1"
 *         dueDate: "2025-10-30T12:00:00.000Z"
 *         completed: false
 *     TaskReport:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *         completed:
 *           type: integer
 *         pending:
 *           type: integer
 *       example:
 *         total: 10
 *         completed: 7
 *         pending: 3
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
 * /api/task/{projectid}/getreport:
 *   get:
 *     summary: Get task completion report for a project
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: projectid
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Report with totals
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskReport'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/task/{projectid}/getreport/{userid}:
 *   get:
 *     summary: Get task completion report for a specific user in a project
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: projectid
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *       - in: path
 *         name: userid
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User-specific report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                 total:
 *                   type: integer
 *                 completed:
 *                   type: integer
 *                 pending:
 *                   type: integer
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/task/{projectid}/exportreport:
 *   get:
 *     summary: Export task report for a project (JSON/CSV)
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: projectid
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Exported task list (JSON)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/task/{projectid}:
 *   post:
 *     summary: Create a task in a project
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: projectid
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 *   get:
 *     summary: Get all tasks in a project
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: projectid
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/task/{projectid}/{taskid}:
 *   get:
 *     summary: Get a specific task
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: projectid
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *       - in: path
 *         name: taskid
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a task
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: projectid
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: taskid
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       200:
 *         description: Updated task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a task
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: projectid
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: taskid
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Task deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */

module.exports = router;