const Joi = require("joi");

const schema = Joi.object({
    name: Joi.string().trim().min(2).required(),
    email: Joi.string().email().allow("", null),
    phone: Joi.string().min(7).allow("", null),
    address: Joi.string().allow("", null),
});

const validateCustomer = (data) => schema.validate(data);

const validateCustomerUpdate = (data) =>
    schema.fork(["name"], (f) => f.optional()).validate(data);

module.exports = { validateCustomer, validateCustomerUpdate };