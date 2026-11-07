const { Op } = require("sequelize");
const { Product, Category } = require("../models");
const { validateProduct } = require("../validations/productValidation");

exports.createProduct = async (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const category = await Category.findByPk(req.body.category_id);
        if (!category) {
            return res.status(404).send("Category not found");
        }
        const product = await Product.create(req.body);
        res.status(201).send(product);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    as: "category",
                },
            ],
        });
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                {
                    model: Category,
                    as: "category",
                },
            ],
        });
        if (!product) {
            return res.status(404).send("Product not found");
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateProduct = async (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        const category = await Category.findByPk(req.body.category_id);
        if (!category) {
            return res.status(404).send("Category not found");
        }
        await product.update(req.body);
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        const productData = product.toJSON();
        await product.destroy();
        res.status(200).send(productData);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || !query.trim()) {
            return res.status(400).send("Search query is required");
        }
        const products = await Product.findAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.iLike]: `%${query.trim()}%`,
                        },
                    },
                    {
                        description: {
                            [Op.iLike]: `%${query.trim()}%`,
                        },
                    },
                ],
            },
            include: [
                {
                    model: Category,
                    as: "category",
                },
            ],
        });
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error.message);
    }
};