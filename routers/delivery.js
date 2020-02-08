const express = require('express')
const {Delivery} = require('../models/delivery')
const {User} = require('../models/user')
const auth = require('../lib/auth')
const { SuccessResponse, ErrorResponse, HTTPError, BadRequestError, ERROR_CODES } = require('../lib/responses');
const router = new express.Router()

router.post('/deliveries', auth.authorize('user', 'admin'), async (req, res) => {
    
    try {

        const delivery = new Delivery(req.body)
        
        await delivery.save()

        const data = {
            id: delivery.id,
            source: delivery.source,
            destination: delivery.destination,
            description: delivery.role,
            senderId: delivery.senderId,
            recepientId: delivery.recepientId,
            courierId: delivery.courierId,
            weight: delivery.weight,
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

        const { role } = await User.findById(req.user.sub);
        const where = {}
        if (role === 'courier') {
            where['courierId'] = req.user.sub
        } else if (role === 'user') {
            where['senderId'] = req.user.sub
        }

        const deliveries = await Delivery.find(where)
            .populate('senderId')
            .populate('recepientId')
            .populate('courierId')

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
            courierId: delivery.courierId,
            weight: delivery.weight,
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
        const delivery = await Delivery.findById(_id)
            .populate('senderId')
            .populate('recepientId')
            .populate('courierId')

        if(!delivery){
            throw new HTTPError("Delivery Not Found", 404, ERROR_CODES.NOT_FOUND)
        }

        const data = {

            id: delivery.id,
            source: delivery.source,
            destination: delivery.destination,
            description: delivery.role,
            senderId: delivery.senderId,
            recepientId: delivery.recepientId,
            courierId: delivery.courierId,
            weight: delivery.weight,
            history: delivery.history,
            dateCreated: delivery.dateCreated,
            dateUpdated: delivery.dateUpdated,
        }

        res.json(new SuccessResponse(data))

    } catch (e) {
        res.status(e.status || 500).json(new ErrorResponse(e.message, e.code))
    }
})

router.patch('/deliveries/:id', auth.authorize('admin', 'courier'), async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['history']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        throw new BadRequestError("Invalid update operation request", 400, ERROR_CODES.BAD_REQUEST)
    }

    try {
        const delivery = await Delivery.findByIdAndUpdate(req.params.id, {...req.body, user: req.user.sub }, {new: true})
            .populate('senderId')
            .populate('recepientId')
            .populate('courierId')

        if (!delivery) {
            throw new HTTPError("Delovery not found", 404, ERROR_CODES.NOT_FOUND)
        }

        const data = {
            id: delivery.id,
            source: delivery.source,
            destination: delivery.destination,
            description: delivery.role,
            senderId: delivery.senderId,
            recepientId: delivery.recepientId,
            courierId: delivery.courierId,
            weight: delivery.weight,
            history: delivery.history,
            dateCreated: delivery.dateCreated,
            dateUpdated: delivery.dateUpdated,
        }

        res.json(new SuccessResponse(data))
    } catch (e) {
        res.status(e.status || 400).json(new BadRequestError("Bad update request", 400, ERROR_CODES.BAD_REQUEST))
    }
})

router.delete('/deliveries/:id', auth.authorize('admin'), async (req, res) => {
    try {
        const delivery = await Delivery.findByIdAndDelete(req.params.id)

        if (!delivery) {
            throw new HTTPError("Delivery to delete not found", 404, ERROR_CODES.NOT_FOUND)
        }

        res.json(new SuccessResponse())

    } catch (e) {

        res.status(e.status || 500).json(new ErrorResponse(e.message, e.code))
    }
})

module.exports = router