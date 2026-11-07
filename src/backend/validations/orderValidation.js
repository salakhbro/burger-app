const Joi = require("joi");

const validateCreateOrder = (data) => {
    const schema = Joi.object({
        user_id: Joi.number().integer().positive().required(),
        address: Joi.string().trim().min(1).max(255).required(),
        total_price: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
        payment_method: Joi.string().valid("cash", "payme", "click", "card").optional(),
        discount: Joi.number().min(0).optional(),
        items: Joi.array()
            .items(
                Joi.object({
                    product_id: Joi.number().integer().positive().required(),
                    quantity: Joi.number().integer().min(1).required(),
                })
            )
            .min(1)
            .required(),
    }).unknown(true);

    return schema.validate(data);
};

const validateOrderStatus = (data) =>
    Joi.object({
        status: Joi.string()
            .valid(
                "pending",
                "confirmed",
                "preparing",
                "delivering",
                "completed",
                "cancelled"
            )
            .required(),
    }).validate(data);

module.exports = { validateCreateOrder, validateOrderStatus };
