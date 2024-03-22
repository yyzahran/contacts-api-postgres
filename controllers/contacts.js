const { BadRequestError, NotFoundError } = require('../errors');
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require('http-status-codes');
const Users = require('../models/users');
const Contacts = require('../models/contacts');
const {
    serializeContact,
    validateEmail,
    getContact,
    getAllContacts,
    getContactById,
    removeContact,
    updateContactDetails,
} = require('../services/utils');

const createContact = async (req, res) => {
    const { userId, name: userName } = req.user;
    const { name: contactName, phoneNumber, email: contactEmail } = req.body;

    // Check all inputs are provided
    if (!contactName || !phoneNumber || !contactEmail) {
        throw new BadRequestError(
            "Please provide contact's name, email, and phone number."
        );
    }

    // Validate email format
    if (!validateEmail(contactEmail)) {
        throw new BadRequestError('Please provide a valid email.');
    }

    // Check if contact email is already added for user
    const contactExists = await getContact(contactEmail, userId);
    if (!!contactExists) {
        throw new BadRequestError(
            `Email ${contactEmail} is already an added contact for user ${userName}.`
        );
    }
    const serializedContact = serializeContact(
        {
            contactName,
            phoneNumber,
            email: contactEmail,
        },
        userId
    );
    const newContact = await Contacts.create({ ...serializedContact });
    console.log(12121);

    console.log('Contact added successfully:', contactName);
    res.status(StatusCodes.OK).send(`Contact ${contactName} created`);
};

const fetchContact = async (req, res) => {
    const {
        params: { id: contactId },
        user: { userId, name },
    } = req;

    const contact = await getContactById(contactId, userId);
    if (!contact) {
        throw new NotFoundError(
            `No contact with id ${contactId} found for user ${name}.`
        );
    }

    res.status(StatusCodes.OK).json(contact);
};

const updateContact = async (req, res) => {
    const {
        user: { userId },
        body: { name: contactName, phoneNumber, email },
        params: { id: contactId },
    } = req;

    if (!contactName || !phoneNumber || !email) {
        throw new BadRequestError(
            "Please provide the contact's name, phone number, and email."
        );
    }
    const newContactInfo = { contactName, phoneNumber, email };
    await updateContactDetails(newContactInfo, contactId, userId);

    res.status(StatusCodes.OK).json(newContactInfo);
};

const deleteContact = async (req, res) => {
    const {
        params: { id: contactId },
        user: { userId, name },
    } = req;
    const contact = await getContactById(contactId, userId);
    if (!contact) {
        throw new NotFoundError(
            `No contact with id ${contactId} found for user ${name}.`
        );
    }

    await removeContact(contactId, userId);

    res.status(StatusCodes.NO_CONTENT).send();
};

const fetchAllContacts = async (req, res) => {
    const { userId } = req.user;
    const contactsList = await getAllContacts(userId);
    res.status(StatusCodes.OK).json({
        contactsList,
        count: contactsList.length,
    });
};

module.exports = {
    createContact,
    updateContact,
    deleteContact,
    fetchAllContacts,
    fetchContact,
};
