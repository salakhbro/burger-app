const Joi = require("joi");

const validateOrderItem = (data) => {
    const schema = Joi.object({
        order_id: Joi.number().integer().positive().required(),
        product_id: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().min(1).required(),
        unit_price: Joi.number().positive().required(),
    });

    return schema.validate(data);
};

module.exports = { validateOrderItem };