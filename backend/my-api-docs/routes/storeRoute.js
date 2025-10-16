// // go to http://localhost:4000/api-docs to view swagger documentation
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Store
 *   description: Store item management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StoreItem:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the store item
 *         name:
 *           type: string
 *           description: The name of the store item
 *         price:
 *           type: number
 *           description: The price of the store item
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last update date
 *       example:
 *         _id: "60d0fe4f5311236168a109ca"
 *         name: "Cool Avatar"
 *         price: 9.99
 *         createdAt: "2023-10-16T09:30:00.000Z"
 *         updatedAt: "2023-10-16T09:30:00.000Z"
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
 * /api/store/store_icon:
 *   get:
 *     summary: Get all profile icons
 *     tags: [Store]
 *     responses:
 *       200:
 *         description: List of all profile icons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StoreItem'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new profile icon
 *     tags: [Store]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the profile icon
 *               price:
 *                 type: number
 *                 description: The price of the profile icon
 *             example:
 *               name: "Cool Avatar"
 *               price: 9.99
 *     responses:
 *       201:
 *         description: Profile icon created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreItem'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Icon with that name already exists
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
 * /api/store/store_icon/{id}:
 *   get:
 *     summary: Get a profile icon by ID
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The profile icon ID
 *     responses:
 *       200:
 *         description: Profile icon found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreItem'
 *       404:
 *         description: Profile icon not found
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
 *     summary: Update a profile icon
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The profile icon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the profile icon
 *               price:
 *                 type: number
 *                 description: The price of the profile icon
 *             example:
 *               name: "Updated Avatar"
 *               price: 12.99
 *     responses:
 *       200:
 *         description: Profile icon updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 item:
 *                   $ref: '#/components/schemas/StoreItem'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Profile icon not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Item with that name already exists
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
 *     summary: Delete a profile icon
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The profile icon ID
 *     responses:
 *       200:
 *         description: Profile icon deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 item:
 *                   $ref: '#/components/schemas/StoreItem'
 *       404:
 *         description: Profile icon not found
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
 * /api/store/store_banner:
 *   get:
 *     summary: Get all banners
 *     tags: [Store]
 *     responses:
 *       200:
 *         description: List of all banners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StoreItem'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new banner
 *     tags: [Store]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the banner
 *               price:
 *                 type: number
 *                 description: The price of the banner
 *             example:
 *               name: "Epic Banner"
 *               price: 15.99
 *     responses:
 *       201:
 *         description: Banner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreItem'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Banner with that name already exists
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
 * /api/store/store_banner/{id}:
 *   get:
 *     summary: Get a banner by ID
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The banner ID
 *     responses:
 *       200:
 *         description: Banner found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreItem'
 *       404:
 *         description: Banner not found
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
 *     summary: Update a banner
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The banner ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the banner
 *               price:
 *                 type: number
 *                 description: The price of the banner
 *             example:
 *               name: "Updated Banner"
 *               price: 18.99
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 item:
 *                   $ref: '#/components/schemas/StoreItem'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Banner not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Item with that name already exists
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
 *     summary: Delete a banner
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The banner ID
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 item:
 *                   $ref: '#/components/schemas/StoreItem'
 *       404:
 *         description: Banner not found
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
 * /api/store/store_backdrop:
 *   get:
 *     summary: Get all backdrops
 *     tags: [Store]
 *     responses:
 *       200:
 *         description: List of all backdrops
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StoreItem'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new backdrop
 *     tags: [Store]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the backdrop
 *               price:
 *                 type: number
 *                 description: The price of the backdrop
 *             example:
 *               name: "Space Backdrop"
 *               price: 25.99
 *     responses:
 *       201:
 *         description: Backdrop created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreItem'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Backdrop with that name already exists
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
 * /api/store/store_backdrop/{id}:
 *   get:
 *     summary: Get a backdrop by ID
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The backdrop ID
 *     responses:
 *       200:
 *         description: Backdrop found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreItem'
 *       404:
 *         description: Backdrop not found
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
 *     summary: Update a backdrop
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The backdrop ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the backdrop
 *               price:
 *                 type: number
 *                 description: The price of the backdrop
 *             example:
 *               name: "Updated Backdrop"
 *               price: 29.99
 *     responses:
 *       200:
 *         description: Backdrop updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 item:
 *                   $ref: '#/components/schemas/StoreItem'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Backdrop not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Item with that name already exists
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
 *     summary: Delete a backdrop
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The backdrop ID
 *     responses:
 *       200:
 *         description: Backdrop deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 item:
 *                   $ref: '#/components/schemas/StoreItem'
 *       404:
 *         description: Backdrop not found
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