const { Contact } = require("../models");
const { validateContact } = require("../validations/contactValidation");

// CREATE CONTACT
exports.createContact = async (req, res) => {
    const { error, value } = validateContact(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const contact = await Contact.create(value);
        res.status(201).send(contact);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// GET CONTACTS
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll({
            order: [["createdAt", "DESC"]],
        });

        res.status(200).send(contacts);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// GET CONTACT BY ID
exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);

        if (!contact) {
            return res.status(404).send("Contact not found");
        }

        res.status(200).send(contact);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// UPDATE CONTACT
exports.updateContact = async (req, res) => {
    const { error, value } = validateContact(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const contact = await Contact.findByPk(req.params.id);

        if (!contact) {
            return res.status(404).send("Contact not found");
        }

        await contact.update(value);

        res.status(200).send(contact);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// DELETE CONTACT
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);

        if (!contact) {
            return res.status(404).send("Contact not found");
        }

        const contactData = contact.toJSON();

        await contact.destroy();

        res.status(200).send(contactData);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
