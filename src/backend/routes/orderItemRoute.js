const express = require("express");
const router = express.Router();

const {
    createOrderItem,
    getOrderItems,
    getOrderItemById,
    updateOrderItem,
    deleteOrderItem,
} = require("../controller/orderItemController");

/**
 * @swagger
 * tags:
 *   name: OrderItems
 *   description: Order item management
 */

/**
 * @swagger
 * /api/order-items:
 *   post:
 *     summary: Create an order item
 *     tags: [OrderItems]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - product_id
 *               - quantity
 *               - unit_price
 *             properties:
 *               order_id:
 *                 type: integer
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               unit_price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order item created successfully
 */
router.post("/", createOrderItem);

/**
 * @swagger
 * /api/order-items:
 *   get:
 *     summary: Get all order items
 *     tags: [OrderItems]
 *     responses:
 *       200:
 *         description: List of order items
 */
router.get("/", getOrderItems);

/**
 * @swagger
 * /api/order-items/{id}:
 *   get:
 *     summary: Get order item by ID
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order item found
 *       404:
 *         description: Order item not found
 */
router.get("/:id", getOrderItemById);

/**
 * @swagger
 * /api/order-items/{id}:
 *   put:
 *     summary: Update order item
 *     tags: [OrderItems]
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
 *               order_id:
 *                 type: integer
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               unit_price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Order item updated successfully
 */
router.put("/:id", updateOrderItem);

/**
 * @swagger
 * /api/order-items/{id}:
 *   delete:
 *     summary: Delete order item
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order item deleted successfully
 */
router.delete("/:id", deleteOrderItem);

module.exports = router;
