const { Order, OrderItem, Product, User, sequelize } = require("../models");
const {
    validateCreateOrder,
    validateOrderStatus,
} = require("../validations/orderValidation");

const DELIVERY_FEE = 1.5;

const orderIncludes = [
    {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
    },
    {
        model: OrderItem,
        as: "items",
        include: [{ model: Product, as: "product" }],
    },
];

exports.createOrder = async (req, res) => {
    const { error, value } = validateCreateOrder(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let transaction;
    try {
        transaction = await sequelize.transaction();
        const user = await User.findByPk(value.user_id, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: "User not found" });
        }

        const productIds = value.items.map((item) => item.product_id);
        const products = await Product.findAll({
            where: { id: [...new Set(productIds)] },
            transaction,
        });
        const productsById = new Map(
            products.map((product) => [product.id, product])
        );

        if (productsById.size !== new Set(productIds).size) {
            await transaction.rollback();
            return res.status(404).json({ message: "Product not found" });
        }

        const total = value.items.reduce((sum, item) => {
            const product = productsById.get(item.product_id);
            return sum + Number(product.price) * item.quantity;
        }, DELIVERY_FEE);
        const normalizedTotal = Number(value.total_price ?? total);

        const order = await Order.create(
            {
                user_id: value.user_id,
                total_price: Number.isFinite(normalizedTotal) ? normalizedTotal.toFixed(2) : total.toFixed(2),
                status: "pending",
                address: value.address,
            },
            { transaction }
        );

        await OrderItem.bulkCreate(
            value.items.map((item) => ({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: productsById.get(item.product_id).price,
            })),
            { transaction }
        );

        const savedOrder = await Order.findByPk(order.id, {
            include: orderIncludes,
            transaction,
        });
        if (!savedOrder) {
            throw new Error("Order could not be loaded after creation");
        }

        await transaction.commit();
        return res.status(201).json({ data: savedOrder });
    } catch (error) {
        if (transaction && !transaction.finished) {
            await transaction.rollback();
        }
        console.error("Create order error:", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const where = {};
        const userId = req.query.userId ?? req.query.user_id;
        if (userId !== undefined) {
            const parsedUserId = Number(userId);
            if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
                return res.status(400).json({ message: "userId noto'g'ri" });
            }
            where.user_id = parsedUserId;
        }

        const orders = await Order.findAll({
            where,
            include: orderIncludes,
            order: [["createdAt", "DESC"]],
        });
        return res.status(200).json(orders);
    } catch (error) {
        console.error("Get orders error:", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: orderIncludes,
        });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json(order);
    } catch (error) {
        console.error("Get order error:", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { error, value } = validateOrderStatus(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        await order.update({ status: value.status });
        return res.status(200).json(order);
    } catch (error) {
        console.error("Update order status error:", error);
        return res.status(500).json({ message: error.message });
    }
};
