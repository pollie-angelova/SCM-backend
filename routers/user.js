const express = require('express')
const User = require('../models/user')
const auth = require('../lib/auth')
const { SuccessResponse, ErrorResponse, HTTPError, ERROR_CODES } = require('../lib/responses');
const router = new express.Router()

router.post('/users', auth.authorize('admin'), async (req, res) => {
    // ?????? 
    const user = new User(req.body)

    try {

        const { name, email, password, role } = req.body
        const user = await User.register(email, password, name, role)

        const data = {

            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            dateCreated: user.dateCreated,
            dateUpdated: user.dateUpdated,
        }

        res.json(new SuccessResponse(data))

    } catch (err) {

        res.status(err.status || 500).json(new ErrorResponse(err.message, err.code))

    }
})

router.get('/users', auth.authorize('admin'), async (req, res) => {
    try {
        const user = await User.find({})

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
        res.status(err.status || 500).json(new ErrorResponse(err.message, err.code))
    }
})

router.get('/users/:id', auth.authorize('admin'), async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            throw new HTTPError("User Not Found", 404, ERROR_CODES.NOT_FOUND)
        }

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
        res.status(err.status || 500).json(new ErrorResponse(err.message, err.code))
    }
})

router.patch('/users/:id', auth.authorize('admin'), async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {

        throw new BadRequestError("Invalid update operation request", 400, ERROR_CODES.BAD_REQUEST)
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!user) {
            throw new HTTPError("User Not Found", 404, ERROR_CODES.NOT_FOUND)
        }

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

        res.status(err.status || 400).json (new BadRequestError("Bad update request", 400, ERROR_CODES.BAD_REQUEST))
       
    }
})

router.delete('/users/:id', auth.authorize('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            
            throw new HTTPError("User not found", 404, ERROR_CODES.NOT_FOUND)
        }

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

        res.status(err.status || 500).json (new ErrorResponse(err.message, err.code))  
    }
})

module.exports = router