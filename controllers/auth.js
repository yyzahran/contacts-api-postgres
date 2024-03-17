const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require('http-status-codes');
const Users = require('../models/users');
const { BadRequestError } = require('../errors');
const {
    createJWT,
    validateEmail,
    getUser,
    serializeUser,
    comparePassword,
} = require('../services/utils');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const id = uuidv4();

    // Check that all entries are provided
    if (!email || !password || !name) {
        throw new BadRequestError(
            'Please provide valid name, email, and password.'
        );
    }
    // Validate email format
    if (!validateEmail(email)) {
        throw new BadRequestError('Please provide a valid email.');
    }

    // Validate password length (light password check)
    if (password.length < 6 || password.length > 12) {
        throw new BadRequestError(
            'Password must be between 6 and 12 characters'
        );
    }

    // Check if email is already registered
    const isUserExists = await getUser(email);
    if (!!isUserExists) {
        throw new BadRequestError(
            `Email ${email} is already registered.Please login or register using a different email!`
        );
    }

    let serializedUser = await serializeUser({ name, email, password });
    const serializedPassword = await serializedUser.password;

    serializedUser = { ...serializedUser, password: serializedPassword };

    const newUser = await Users.create({
        id,
        fullName: name,
        email: email,
        password: serializedPassword,
    });

    console.log('User registered successfully:', email);
    const token = createJWT(id, serializedUser.name);
    res.status(StatusCodes.OK).json({ id, serializedUser, token });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    // checking that email and password are provided
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    // Check that email is in emails:unique set
    const registered = await getUser(email);
    if (!registered) {
        throw new BadRequestError(
            'Email not registered. Please register a user.'
        );
    }
    const {
        fullName: name,
        password: hashedPassword,
        id,
    } = registered.dataValues;
    const isPasswordMatching = await comparePassword(password, hashedPassword);
    if (!isPasswordMatching) {
        throw new BadRequestError('Wrong email or password, try again');
    }

    const token = createJWT(id, registered.dataValues.fullName);
    res.status(StatusCodes.OK).json({ id, name, token });
};

module.exports = { register, login };
