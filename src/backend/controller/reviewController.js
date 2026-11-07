const { Review, User, Product } = require("../models");
const { validateReview } = require("../validations/reviewValidation");

const createReview = async (req, res) => {
    try {
        const { error, value } = validateReview(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }
        const user = await User.findByPk(value.user_id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const product = await Product.findByPk(value.product_id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        const review = await Review.create(value);
        return res.status(201).json({
            message: "Review created successfully",
            data: review,
        });
    } catch (error) {
        console.error("Create review error:", error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
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
        return res.status(200).json(reviews);
    } catch (error) {
        console.error("Get reviews error:", error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

const getReviewById = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id, {
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
        if (!review) {
            return res.status(404).json({
                message: "Review not found",
            });
        }
        return res.status(200).json(review);
    } catch (error) {
        console.error("Get review error:", error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

const updateReview = async (req, res) => {
    try {
        const { error, value } = validateReview(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({
                message: "Review not found",
            });
        }
        const user = await User.findByPk(value.user_id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const product = await Product.findByPk(value.product_id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        await review.update(value);
        return res.status(200).json({
            message: "Review updated successfully",
            data: review,
        });
    } catch (error) {
        console.error("Update review error:", error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({
                message: "Review not found",
            });
        }
        await review.destroy();
        return res.status(200).json({
            message: "Review deleted successfully",
        });
    } catch (error) {
        console.error("Delete review error:", error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createReview,
    getReviews,
    getReviewById,
    updateReview,
    deleteReview,
};