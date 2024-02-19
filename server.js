require('dotenv').config();
require('express-async-errors');
const express = require("express")
const server = express();
// error handlers
const errorHandler = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')
// routers
const authRouter = require('./routes/auth');
const contactsRouter = require('./routes/contacts');
const authHeader = require('./middleware/authentication')

server.use(express.json())

server.get('/', (req, res) => {
    res.send('Contacts api')
})

// routes
server.use('/auth', authRouter)
server.use('/contacts', authHeader, contactsRouter)

// Middleware
server.use(notFound)
server.use(errorHandler)

const port = process.env.PORT || 3001;

const start = async () => {
    try {
        server.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error);
    }
};

start();