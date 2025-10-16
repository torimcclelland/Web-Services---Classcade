const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         username:
 *           type: string
 *         role:
 *           type: string
 *         projects:
 *           type: array
 *           items:
 *             type: string
 *         icon:
 *           type: string
 *         banner:
 *           type: string
 *         backdrop:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "user_123"
 *         firstName: "Jane"
 *         lastName: "Doe"
 *         email: "jane@example.com"
 *         username: "janedoe"
 *         role: "student"
 *         projects: ["proj_1"]
 *         icon: "default_icon"
 *         banner: "default_banner"
 *         backdrop: "default_backdrop"
 *     UserCreate:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - username
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *         projects:
 *           type: array
 *           items:
 *             type: string
 *       example:
 *         firstName: "Jane"
 *         lastName: "Doe"
 *         email: "jane@example.com"
 *         username: "janedoe"
 *         password: "password123"
 *         role: "student"
 *     UserUpdateName:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *       example:
 *         firstName: "Janet"
 *         lastName: "Doe"
 *     UserUpdateUsername:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *       example:
 *         username: "janetdoe"
 *     IconUpdate:
 *       type: object
 *       properties:
 *         icon:
 *           type: string
 *       example:
 *         icon: "avatar1"
 *     BannerUpdate:
 *       type: object
 *       properties:
 *         banner:
 *           type: string
 *       example:
 *         banner: "banner1"
 *     BackdropUpdate:
 *       type: object
 *       properties:
 *         backdrop:
 *           type: string
 *       example:
 *         backdrop: "backdrop1"
 *     SimpleResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
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
 * /api/user/icons:
 *   get:
 *     summary: Get available profile icons
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of icon names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */

/**
 * @swagger
 * /api/user/banners:
 *   get:
 *     summary: Get available banners
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of banner names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */

/**
 * @swagger
 * /api/user/backdrops:
 *   get:
 *     summary: Get available backdrops
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of backdrop names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */

/**
 * @swagger
 * /api/user/createuser:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user by ID (password excluded)
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: User object without password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       204:
 *         description: User deleted (no content)
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/{id}/updateusername:
 *   put:
 *     summary: Update user's username
 *     tags: [User]
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
 *             $ref: '#/components/schemas/UserUpdateUsername'
 *     responses:
 *       200:
 *         description: Updated user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/{id}/updatename:
 *   put:
 *     summary: Update user's first and last name
 *     tags: [User]
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
 *             $ref: '#/components/schemas/UserUpdateName'
 *     responses:
 *       200:
 *         description: Updated user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/{id}/updateemail:
 *   put:
 *     summary: Update user's email
 *     tags: [User]
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
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: "newemail@example.com"
 *     responses:
 *       200:
 *         description: Updated user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/{id}/updateicon:
 *   put:
 *     summary: Update user's profile icon
 *     tags: [User]
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
 *             $ref: '#/components/schemas/IconUpdate'
 *     responses:
 *       200:
 *         description: Updated user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid icon
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/{id}/updatebanner:
 *   put:
 *     summary: Update user's banner
 *     tags: [User]
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
 *             $ref: '#/components/schemas/BannerUpdate'
 *     responses:
 *       200:
 *         description: Updated user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid banner
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/{id}/updatebackdrop:
 *   put:
 *     summary: Update user's backdrop
 *     tags: [User]
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
 *             $ref: '#/components/schemas/BackdropUpdate'
 *     responses:
 *       200:
 *         description: Updated user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid backdrop
 *       404:
 *         description: User not found
 */

module.exports = router;