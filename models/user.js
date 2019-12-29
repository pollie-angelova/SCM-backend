const mongoose = require('mongoose')
const utils = require('../lib/util')
const { HTTPError, ERROR_CODES } = require('../lib/responses')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'courier'],
        default: 'user',
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now

    },
    dateUpdated: {
        type: Date,
        default: Date.now

    }
})

UserSchema.statics.register = async function register(email, password, name, role = 'user') {

    utils.validateEmail(email);
    utils.validateName(name);
    utils.validateRole(role);

    let user

    try {

        user = await new this({ name, email, password: utils.generatePassword(password), role, }).save();

    } catch (err) {

        //DB error 11000 - duplicate entry
        if (err.code === 11000) {

            throw new HTTPError(`The email ${email} is already in use`, 400, ERROR_CODES.INVALID_DATA);

        } else {
            throw err;
        }
    }
    return user;
}

const User = mongoose.model('User', UserSchema)

module.exports = { User }
