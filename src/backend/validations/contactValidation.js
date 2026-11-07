const Joi = require("joi");

const validateContact = (contact) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        phone: Joi.string().required(),
        email: Joi.string().email().required(),
        subject: Joi.string().required(),
        message: Joi.string().min(5).max(2000).required(),
        status: Joi.string()
            .valid("new", "read", "replied")
            .optional(),
    });

    return schema.validate(contact);
};

module.exports = { validateContact };
