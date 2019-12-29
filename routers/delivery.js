const express = require('express')
const Delivery = require('../models/user')
const auth = require('../lib/auth')
const { SuccessResponse, ErrorResponse, HTTPError, BadRequestError, ERROR_CODES } = require('../lib/responses');
const router = new express.Router()

router.post('/deliveries', auth.authorize('user', 'admin'), async (req, res) => {
    const delivery = new Delivery(req.body)

    try {
        
        await delivery.save()

        const data = {

            id: delivery.id,
            source: delivery.source,
            destination: delivery.destination,
            description: delivery.role,
            senderId: delivery.senderId,
            recepientId: delivery.recepientId,
            history: delivery.history,
            dateCreated: delivery.dateCreated,
            dateUpdated: delivery.dateUpdated,
        }

        res.json(new SuccessResponse(data))

    } catch (e) {
        res.status(e.status || 400).json(new BadRequestError("Bad update request", 400, ERROR_CODES.BAD_REQUEST))
    }
})

router.get('/deliveries', auth.authorize('user', 'admin', 'courier'), async (req, res) => {
    try {
        const deliveries = await Delivery.find({})

        if(!deliveries){
            throw new HTTPError("Delivery NOT Found", 404, ERROR_CODES.NOT_FOUND)
        }

        const data = deliveries.map(delivery => ({

            id: delivery.id,
            source: delivery.source,
            destination: delivery.destination,
            description: delivery.role,
            senderId: delivery.senderId,
            recepientId: delivery.recepientId,
            history: delivery.history,
            dateCreated: delivery.dateCreated,
            dateUpdated: delivery.dateUpdated,
        }))

        res.json(new SuccessResponse(data))

    } catch (e) {
        res.status(e.status || 500).json(new ErrorResponse(e.message, e.code))
    }
})

router.get('/deliveries/:id', auth.authorize('user', 'admin', 'courier'), async (req, res) => {
    const _id = req.params.id

    try {
        const deliveries = await Delivery.findById(_id)

        if(!deliveries){
            throw new HTTPError("Delivery Not Found", 404, ERROR_CODES.NOT_FOUND)
        }

        const data = deliveries.map(delivery =>({

            id: delivery.id,
            source: delivery.source,
            destination: delivery.destination,
            description: delivery.role,
            senderId: delivery.senderId,
            recepientId: delivery.recepientId,
            history: delivery.history,
            dateCreated: delivery.dateCreated,
            dateUpdated: delivery.dateUpdated,
        }))

        res.json(new SuccessResponse(data))

    } catch (e) {
        res.status(e.status || 500).json(new ErrorResponse(e.message, e.code))
    }
})

router.patch('/deliveries/:id', auth.authorize('admin', 'courier'), async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['status']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        throw new BadRequestError("Invalid update operation request", 400, ERROR_CODES.BAD_REQUEST)
    }

    try {
        const deliveries = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!deliveries) {
            throw new HTTPError("Delovery not found", 404, ERROR_CODES.NOT_FOUND)
        }

        const data = deliveries.map(delivery =>({

            id: delivery.id,
            source: delivery.source,
            destination: delivery.destination,
            description: delivery.role,
            senderId: delivery.senderId,
            recepientId: delivery.recepientId,
            history: delivery.history,
            dateCreated: delivery.dateCreated,
            dateUpdated: delivery.dateUpdated,
        }))

        res.json(new SuccessResponse(data))
    } catch (e) {
        res.status(e.status || 400).json(new BadRequestError("Bad update request", 400, ERROR_CODES.BAD_REQUEST))
    }
})

router.delete('/deliveries/:id', auth.authorize('admin'), async (req, res) => {
    try {
        const deliveries = await Delivery.findByIdAndDelete(req.params.id)

        if (!deliveries) {
            throw new HTTPError("Delivery to delete not found", 404, ERROR_CODES.NOT_FOUND)
        }

        const data = deliveries.map(delivery => ({

            id: delivery.id,
            source: delivery.source,
            destination: delivery.destination,
            description: delivery.role,
            senderId: delivery.senderId,
            recepientId: delivery.recepientId,
            history: delivery.history,
            dateCreated: delivery.dateCreated,
            dateUpdated: delivery.dateUpdated,
        }))

        res.json(new SuccessResponse(data))

    } catch (e) {

        res.status(e.status || 500).json(new ErrorResponse(e.message, e.code))
    }
})

module.exports = router