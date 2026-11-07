const {
    validateCustomer,
    validateCustomerUpdate,
} = require("../validations/customerValidation");
const { Op } = require("sequelize");
const { Customer, User, sequelize } = require("../models");

const findCustomerForUser = async (user, transaction) => {
    if (user.customer_id) {
        const linkedCustomer = await Customer.findByPk(user.customer_id, {
            transaction,
        });
        if (linkedCustomer) return linkedCustomer;
    }

    const emailCustomer = await Customer.findOne({
        where: { email: user.email },
        transaction,
    });
    if (emailCustomer) return emailCustomer;

    return Customer.findOne({
        where: { name: user.name, email: null },
        transaction,
    });
};

exports.getCustomerForUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const customer = await findCustomerForUser(user);
        return res.status(200).json({
            id: customer?.id ?? null,
            phone: customer?.phone ?? "",
            address: customer?.address ?? "",
        });
    } catch (error) {
        console.error("Get Customer Settings Error:", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.updateCustomerForUser = async (req, res) => {
    const { error, value } = validateCustomerUpdate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    let transaction;
    try {
        transaction = await sequelize.transaction();
        const user = await User.findByPk(req.params.userId, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: "User not found" });
        }

        let customer = await findCustomerForUser(user, transaction);
        if (customer) {
            await customer.update(value, { transaction });
        } else {
            customer = await Customer.create(
                {
                    name: user.name,
                    email: user.email,
                    ...value,
                },
                { transaction }
            );
        }

        if (Number(user.customer_id) !== Number(customer.id)) {
            await user.update({ customer_id: customer.id }, { transaction });
        }

        await transaction.commit();
        return res.status(200).json({
            id: customer.id,
            phone: customer.phone ?? "",
            address: customer.address ?? "",
        });
    } catch (error) {
        if (transaction && !transaction.finished) {
            await transaction.rollback();
        }
        console.error("Update Customer Settings Error:", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.createCustomer = async (req, res) => {
    const { error, value } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const customer = await Customer.create(value);
        res.status(201).send(customer);
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).send("Phone already exists");
        }
        res.status(500).send(error.message);
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.status(200).send(customers);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: "users",
                    attributes: { exclude: ["password"] },
                },
            ],
        });
        if (!customer) return res.status(404).send("Customer not found");
        res.status(200).send(customer);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateCustomer = async (req, res) => {
    const { error, value } = validateCustomerUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).send("Customer not found");
        await customer.update(value);
        res.status(200).send(customer);
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).send("Phone already exists");
        }
        res.status(500).send(error.message);
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).send("Customer not found");

        const customerData = customer.toJSON();
        await customer.destroy();
        res.status(200).send(customerData);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.searchCustomers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || !query.trim()) {
            return res.status(400).send("Search query is required");
        }
        const cleanQuery = query.trim();
        const customers = await Customer.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${cleanQuery}%` } },
                    { email: { [Op.iLike]: `%${cleanQuery}%` } },
                    { phone: { [Op.iLike]: `%${cleanQuery}%` } },
                ],
            },
        });
        res.status(200).send(customers);
    } catch (err) {
        res.status(500).send(err.message);
    }
};