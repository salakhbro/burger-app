const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { User, Customer, sequelize } = require("../models");
const {
    createResetCredentials,
    hashResetToken,
    isEmailDeliveryConfigured,
    sendPasswordResetEmail,
} = require("../utils/passwordReset");
const {
    validateUser,
    validateUserUpdate,
} = require("../validations/userValidation");

const publicUserAttributes = {
    exclude: ["password", "reset_password_token", "reset_password_expires"],
};

function stripPasswordResetFields(userData) {
    delete userData.password;
    delete userData.reset_password_token;
    delete userData.reset_password_expires;
    return userData;
}

exports.createUser = async (req, res) => {
    try {
        const { error, value } = validateUser(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }
        const user = await User.create(value);
        const customer = await Customer.create({
            name: user.name,
            email: user.email,
        });
        await user.update({ customer_id: customer.id });
        const userData = user.toJSON();
        stripPasswordResetFields(userData);
        return res.status(201).json({
            message: "Ro'yxatdan o'tish muvaffaqiyatli!",
            user: userData,
        });
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                message: "Bu email allaqachon mavjud!",
            });
        }
        return res.status(500).json({
            message: error.message || "Serverda xatolik yuz berdi!",
        });
    }
};
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: publicUserAttributes,
        });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || !query.trim()) {
            return res.status(400).send("Search query is required");
        }
        const cleanQuery = query.trim();
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${cleanQuery}%` } },
                    { email: { [Op.iLike]: `%${cleanQuery}%` } },
                ],
            },
            attributes: publicUserAttributes,
        });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: publicUserAttributes,
        });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
exports.updateUser = async (req, res) => {
    const { error, value } = validateUserUpdate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const user = await User.findByPk(req.params.id, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).send("User not found");
        }
        await user.update(value, { transaction });
        let customer = user.customer_id
            ? await Customer.findByPk(user.customer_id, { transaction })
            : null;
        if (!customer) {
            customer = await Customer.findOne({
                where: { email: user.email },
                transaction,
            });
        }
        if (!customer) {
            customer = await Customer.findOne({
                where: { name: user.name, email: null },
                transaction,
            });
        }
        if (customer) {
            await customer.update(
                { name: user.name, email: user.email },
                { transaction }
            );
        } else {
            customer = await Customer.create(
                { name: user.name, email: user.email },
                { transaction }
            );
        }
        if (Number(user.customer_id) !== Number(customer.id)) {
            await user.update({ customer_id: customer.id }, { transaction });
        }
        await transaction.commit();

        const userData = user.toJSON();
        stripPasswordResetFields(userData);
        res.status(200).send(userData);
    } catch (error) {
        if (transaction && !transaction.finished) {
            await transaction.rollback();
        }
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).send("Email already exists");
        }
        res.status(500).send(error.message);
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const userData = user.toJSON();
        stripPasswordResetFields(userData);
        await user.destroy();
        res.status(200).send(userData);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
exports.loginUser = async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return res.status(400).json({
                message: "Username va password kiriting",
            });
        }
        const user = await User.findOne({
            where: { name: name.trim() },
        });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: "Login yoki parol noto'g'ri",
            });
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET .env faylida mavjud emas");
        }
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        return res.status(200).json({
            message: "Login muvaffaqiyatli!",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                customer_id: user.customer_id,
            },
        });
    } catch (error) {
        console.error("Login xatosi:", error);
        return res.status(500).json({
            message: error.message,
        });
    }
};
exports.requestPasswordReset = async (req, res) => {
    const email = typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Enter a valid email address." });
    }
    if (process.env.NODE_ENV === "production" && !isEmailDeliveryConfigured()) {
        return res.status(503).json({
            message: "Password reset email service is not configured.",
        });
    }
    try {
        const user = await User.findOne({
            where: sequelize.where(
                sequelize.fn("LOWER", sequelize.col("email")),
                email
            ),
        });
        if (user) {
            const credentials = createResetCredentials();
            await user.update({
                reset_password_token: credentials.tokenHash,
                reset_password_expires: credentials.expiresAt,
            });
            try {
                await sendPasswordResetEmail(user.email, credentials.token);
            } catch (error) {
                await user.update({
                    reset_password_token: null,
                    reset_password_expires: null,
                });
                console.error("Password reset email delivery failed:", error);
            }
        }
        return res.status(200).json({
            message: "If an account exists for this email, password reset instructions will be sent.",
        });
    } catch (error) {
        console.error("Password reset request failed:", error);
        return res.status(500).json({ message: "Could not process password reset request." });
    }
};
exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
        return res.status(400).json({ message: "This password reset link is invalid or has expired." });
    }
    if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters." });
    }
    try {
        const user = await User.findOne({
            where: {
                reset_password_token: hashResetToken(token),
                reset_password_expires: { [Op.gt]: new Date() },
            },
        });
        if (!user) {
            return res.status(400).json({
                message: "This password reset link is invalid or has expired.",
            });
        }
        await user.update({
            password,
            reset_password_token: null,
            reset_password_expires: null,
        });
        return res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        console.error("Password reset failed:", error);
        return res.status(500).json({ message: "Could not reset password." });
    }
};