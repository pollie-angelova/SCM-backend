const express = require('express');
const bcrypt = require('bcryptjs');
const auth = require('../lib/auth')
const { SuccessResponse, ErrorResponse, HTTPError, ERROR_CODES } = require('../lib/responses');
const { User } = require('../models/user');


module.exports = function (app) {

    const router = express.Router();

    app.use('/api/login', router);

    router.post('/', async (req, res) => {

        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                throw new HTTPError('User does not exist', 401, ERROR_CODES.NOT_FOUND)
            }

            if (!bcrypt.compareSync(req.body.password, user.password)) {

                throw new HTTPError('Wrong password', 403, ERROR_CODES.INVALID_DATA)
            }

            const accessToken = await auth.createToken(user.id, user.email, user.role)

            const data = {
                id: user.id,
                name: user.firstName,
                email: user.lastName,
                role: user.role,
                dateCreated: user.dateCreated,
                dateUpdated: user.dateUpdated,
                accessToken
            }

            res.json(new SuccessResponse(data))

        } catch (e) {

            res.status(e.status || 500).json(new ErrorResponse(e.message, e.code))
        }
    });

    router.post('/register', async (req, res) => {

        try {

            const { name, email, password } = req.body
            const user = await User.register(email, password, name, 'user')

            const data = {

                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                dateCreated: user.dateCreated,
                dateUpdated: user.dateUpdated,
            }

            res.json(new SuccessResponse(data))

        } catch (e) {

            res.status(e.status || 500).json(new ErrorResponse(e.message, e.code))

        }
    });
}