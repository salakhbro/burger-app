const Joi = require("joi");

const validateReview = (data) => {
    const schema = Joi.object({
        user_id: Joi.number().integer().positive().required(),

        product_id: Joi.number().integer().positive().required(),

        rating: Joi.number()
            .integer()
            .min(1)
            .max(5)
            .required(),

        comment: Joi.string()
            .max(1000)
            .allow("", null),
    });

    return schema.validate(data);
};

module.exports = { validateReview };