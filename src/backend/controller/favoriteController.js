
const { Favorite, User, Product } = require("../models");
const { validateFavorite } = require("../validations/favoriteValidation");

const createFavorite = async (req, res) => {
    try {
        const { error } = validateFavorite(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        const { user_id, product_id } = req.body;

        const user = await User.findByPk(user_id);
        const product = await Product.findByPk(product_id);

        if (!user || !product) {
            return res.status(404).json({
                message: "User yoki Product topilmadi",
            });
        }

        const existing = await Favorite.findOne({
            where: { user_id, product_id },
        });

        if (existing) {
            return res.status(409).json({
                message: "Bu mahsulot Favoritesda mavjud",
            });
        }

        const favorite = await Favorite.create({
            user_id,
            product_id,
        });

        return res.status(201).json({
            message: "Favorite created successfully",
            data: favorite,
        });

    } catch (error) {
        console.error("Create Favorite Error:", error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

const getFavorites = async (req, res) => {
    try {
        const { user_id } = req.query;

        const where = {};

        if (user_id !== undefined) {
            const parsedUserId = Number(user_id);

            if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
                return res.status(400).json({
                    message: "user_id noto'g'ri",
                });
            }

            where.user_id = parsedUserId;
        }

        const favorites = await Favorite.findAll({
            where,
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email"],
                },
                {
                    model: Product,
                    as: "product",
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json(favorites);

    } catch (error) {
        console.error("Get Favorites Error:", error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

const getFavoriteById = async (req, res) => {
    try {
        const favorite = await Favorite.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email"],
                },
                {
                    model: Product,
                    as: "product",
                },
            ],
        });

        if (!favorite) {
            return res.status(404).json({
                message: "Favorite not found",
            });
        }

        return res.status(200).json(favorite);

    } catch (error) {
        console.error("Get Favorite Error:", error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

const updateFavorite = async (req, res) => {
    try {
        const { error } = validateFavorite(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        const favorite = await Favorite.findByPk(req.params.id);

        if (!favorite) {
            return res.status(404).json({
                message: "Favorite not found",
            });
        }

        const { user_id, product_id } = req.body;

        const user = await User.findByPk(user_id);
        const product = await Product.findByPk(product_id);

        if (!user || !product) {
            return res.status(404).json({
                message: "User yoki Product topilmadi",
            });
        }

        const existing = await Favorite.findOne({
            where: {
                user_id,
                product_id,
            },
        });

        if (existing && existing.id !== favorite.id) {
            return res.status(409).json({
                message: "Bu Favorite allaqachon mavjud",
            });
        }

        await favorite.update({
            user_id,
            product_id,
        });

        return res.status(200).json({
            message: "Favorite updated successfully",
            data: favorite,
        });

    } catch (error) {
        console.error("Update Favorite Error:", error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

const deleteFavorite = async (req, res) => {
    try {
        const favorite = await Favorite.findByPk(req.params.id);

        if (!favorite) {
            return res.status(404).json({
                message: "Favorite not found",
            });
        }

        await favorite.destroy();

        return res.status(200).json({
            message: "Favorite deleted successfully",
        });

    } catch (error) {
        console.error("Delete Favorite Error:", error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createFavorite,
    getFavorites,
    getFavoriteById,
    updateFavorite,
    deleteFavorite,
};