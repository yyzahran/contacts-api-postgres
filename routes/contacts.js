const express = require('express')
const contactsRouter = express.Router()
const { createContact,
    updateContact, deleteContact, fetchContact, fetchAllContacts
} = require('../controllers/contacts');

// setting up the routes
contactsRouter.route('/').post(createContact).get(fetchAllContacts);
contactsRouter.route('/:id').get(fetchContact).patch(updateContact).delete(deleteContact);

module.exports = contactsRouter;