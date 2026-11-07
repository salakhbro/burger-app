const Joi = require("joi");

const validateFavorite = (favorite) => {
    const schema = Joi.object({
        user_id: Joi.number().integer().positive().required(),
        product_id: Joi.number().integer().positive().required(),
    });

    return schema.validate(favorite);
};

module.exports = { validateFavorite };