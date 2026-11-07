const Joi = require("joi");

const schema = Joi.object({
    name: Joi.string().trim().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    customer_id: Joi.number().allow(null),
});

const validateUser = (data) => schema.validate(data);

const validateUserUpdate = (data) =>
    schema
        .fork(["name", "email", "password"], (f) => f.optional())
        .validate(data);

module.exports = { validateUser, validateUserUpdate };