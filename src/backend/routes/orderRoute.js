const express = require("express");
const orderController = require("../controller/orderController");

const router = express.Router();

router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:id", orderController.updateOrderStatus);

module.exports = router;
