const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const Contacts = require('../models/contacts');

const createJWT = (userId, name) => {
    return jwt.sign({ userId, name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
}

const validateEmail = (candidateEmail) => {
    // Use a regular expression to validate the email format
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    return emailRegex.test(candidateEmail);
}

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

const comparePassword = async (candidatePassword, hash) => {
    const isMatch = await bcrypt.compare(candidatePassword, hash)
    return isMatch
}

const serializeContact = (contact, userId) => {
    return {
        ...contact,
        createdBy: userId
    }
}

const serializeUser = (user) => {
    const hashedPassword = hashPassword(user.password);
    return {
        name: user.name,
        email: user.email,
        password: hashedPassword
    }
}

const deserializeContact = (contact) => {
    return {
        id: contact.id,
        name: contact.contactName,
        phoneNumber: contact.phoneNumber,
        email: contact.contactEmail
    }
}

const deserializeUser = (id, user) => {
    return {
        userId: id,
        name: user.name,
        email: user.email
    }
}

const getUser = async (email) => {
    const user = await Users.findOne({ where: { email } })
    return user
}

const getContact = async (email, userId) => {
    const contact = await Contacts.findOne({ where: { email, createdBy: userId } })
    return contact
}

const getContactById = async (contactId, userId) => {
    const contact = await Contacts.findOne({
        where: {
            id: contactId,
            createdBy: userId
        }
    })
    return contact?.dataValues
}

const getAllContacts = async (userId) => {
    const contacts = await Contacts.findAll({ where: { createdBy: userId } })
    const contactsList = []
    contacts.forEach(c => {
        contactsList.push(c.dataValues)
    })
    return contactsList
}

const removeContact = async (contactId, userId) => {
    const contact = await Contacts.destroy({
        where: {
            id: contactId,
            createdBy: userId
        }
    })
}

const updateContactDetails = async (newContact, contactId, userId) => {
    await Contacts.update({
        ...newContact
    }, { where: {
        id: contactId,
        createdBy: userId
    }})
}

module.exports = {
    createJWT,
    validateEmail,
    hashPassword,
    comparePassword,
    serializeContact,
    serializeUser,
    deserializeUser,
    deserializeContact,
    getUser,
    getContact,
    getAllContacts,
    getContactById,
    removeContact,
    updateContactDetails,
}