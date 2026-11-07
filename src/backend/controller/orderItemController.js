const { OrderItem, Order, Product } = require("../models");
const { validateOrderItem } = require("../validations/orderItemValidation");

const createOrderItem = async (req, res) => {
    try {
        const { error, value } = validateOrderItem(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }
        const order = await Order.findByPk(value.order_id);
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }
        const product = await Product.findByPk(value.product_id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        const item = await OrderItem.create(value);
        return res.status(201).json({
            message: "Order item created successfully",
            data: item,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getOrderItems = async (req, res) => {
    try {
        const items = await OrderItem.findAll({
            include: [
                { model: Order, as: "order" },
                { model: Product, as: "product" },
            ],
        });
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getOrderItemById = async (req, res) => {
    try {
        const item = await OrderItem.findByPk(req.params.id, {
            include: [
                { model: Order, as: "order" },
                { model: Product, as: "product" },
            ],
        });
        if (!item) {
            return res.status(404).json({ message: "Order item not found" });
        }
        return res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateOrderItem = async (req, res) => {
    try {
        const { error, value } = validateOrderItem(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }
        const item = await OrderItem.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Order item not found" });
        }
        const order = await Order.findByPk(value.order_id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        const product = await Product.findByPk(value.product_id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        await item.update(value);
        return res.status(200).json({
            message: "Order item updated successfully",
            data: item,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteOrderItem = async (req, res) => {
    try {
        const item = await OrderItem.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Order item not found" });
        }
        await item.destroy();
        return res.status(200).json({
            message: "Order item deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrderItem,
    getOrderItems,
    getOrderItemById,
    updateOrderItem,
    deleteOrderItem,
};