
const express = require("express");
const router = express.Router();
const contactController = require("../controller/contactController");

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contact management
 */

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     tags: [Contacts]
 *     summary: Create a new contact message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact created
 *       400:
 *         description: Invalid input
 */
router.post("/", contactController.createContact);

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     tags: [Contacts]
 *     summary: Get all contacts
 *     responses:
 *       200:
 *         description: List of contacts
 */
router.get("/", contactController.getContacts);

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     tags: [Contacts]
 *     summary: Get contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact found
 *       404:
 *         description: Contact not found
 */
router.get("/:id", contactController.getContactById);

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     tags: [Contacts]
 *     summary: Update contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [new, read, replied]
 *     responses:
 *       200:
 *         description: Contact updated
 *       404:
 *         description: Contact not found
 */
router.put("/:id", contactController.updateContact);

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     tags: [Contacts]
 *     summary: Delete contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact deleted
 *       404:
 *         description: Contact not found
 */
router.delete("/:id", contactController.deleteContact);

module.exports = router;
