const Joi = require("joi");

const validateProduct = (product) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(150).required(),
        description: Joi.string().allow("").max(1000),
        price: Joi.number().positive().required(),
        image: Joi.string().allow("").max(500),
        stock: Joi.number().integer().min(0).required(),
        category_id: Joi.number().integer().positive().required(),
    });

    return schema.validate(product);
};

module.exports = { validateProduct };
