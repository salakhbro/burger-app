const express = require("express");
const router = express.Router();

const {
    createFavorite,
    getFavorites,
    getFavoriteById,
    updateFavorite,
    deleteFavorite,
} = require("../controller/favoriteController");

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Favorites management
 */

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Create Favorite
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - product_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               product_id:
 *                 type: integer
 *                 example: 31
 *     responses:
 *       201:
 *         description: Favorite created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User or Product not found
 *       409:
 *         description: Favorite already exists
 */
router.post("/", createFavorite);

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get All Favorites
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: List of favorites
 */
router.get("/", getFavorites);

/**
 * @swagger
 * /api/favorites/{id}:
 *   get:
 *     summary: Get Favorite By ID
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favorite found
 *       404:
 *         description: Favorite not found
 */
router.get("/:id", getFavoriteById);

/**
 * @swagger
 * /api/favorites/{id}:
 *   put:
 *     summary: Update Favorite
 *     tags: [Favorites]
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
 *             required:
 *               - user_id
 *               - product_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               product_id:
 *                 type: integer
 *                 example: 32
 *     responses:
 *       200:
 *         description: Favorite updated successfully
 *       404:
 *         description: Favorite not found
 */
router.put("/:id", updateFavorite);

/**
 * @swagger
 * /api/favorites/{id}:
 *   delete:
 *     summary: Delete Favorite
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favorite deleted successfully
 *       404:
 *         description: Favorite not found
 */
router.delete("/:id", deleteFavorite);

module.exports = router;