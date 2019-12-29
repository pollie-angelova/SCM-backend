const express = require('express')
const Vehicle = require('../models/vehicle')
const auth = require('../lib/auth')
const { SuccessResponse, ErrorResponse, HTTPError, ERROR_CODES } = require('../lib/responses')
const router = new express.Router()

router.post('/vehicles', auth.authorize('admin'), async (req, res) => {
    const vehicle = new Vehicle(req.body)

    try {
        await vehicle.save()
        
        const data = {
            id: vehicle.id,
            deliver: vehicle.deliver,
            location: vehicle.location,
            dateCreated: vehicle.dateCreated,
            dateUpdated: vehicle.dateUpdated
        }
        
        res.json(new SuccessResponse(data))
    } catch (e) {

        res.status(e.status || 400).json (new BadRequestError("Bad update request", 400, ERROR_CODES.BAD_REQUEST))
    }
})

router.get('/vehicles', auth.authorize('admin'), async (req, res) => {
    try {
        const vehicles = await Vehicle.find({})

        const data = vehicles.map(vehicle =>({
            id: vehicle.id,
            deliver: vehicle.deliver,
            location: vehicle.location,
            dateCreated: vehicle.dateCreated,
            dateUpdated: vehicle.dateUpdated
        }))
    
        res.json(new SuccessResponse(data))

    } catch (e) {
        res.status(e.status || 500).json(new ErrorResponse(e.message, e.code))
    }
})

router.get('/vehicles/:id', auth.authorize('admin', 'courier'), async (req, res) => {
    const _id = req.params.id

    try {
        const vehicles = await Vehicle.findById(_id)

        if (!vehicles) {
            throw new HTTPError("Vehicle Not Found", 404, ERROR_CODES.NOT_FOUND)
        }
        
        const data = vehicles.map(vehicle =>({
            id: vehicle.id,
            deliver: vehicle.deliver,
            location: vehicle.location,
            dateCreated: vehicle.dateCreated,
            dateUpdated: vehicle.dateUpdated
        }))
    
        res.json(new SuccessResponse(data))

    } catch (e) {
        res.status(e.status || 500).json(new ErrorResponse(e.message, e.code))
    }
})

router.patch('/vehicles/:id', auth.authorize('admin', 'courier'), async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['deliver', 'location']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {

        throw new BadRequestError("Invalid update operation request", 400, ERROR_CODES.BAD_REQUEST)
    }

    try {
        const vehicles = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

       if (!vehicles) {
            throw new HTTPError("Vehicle Not Found", 404, ERROR_CODES.NOT_FOUND)
        }

        const data = vehicles.map(vehicle =>({

            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            dateCreated: user.dateCreated,
            dateUpdated: user.dateUpdated,
        }))

        res.json(new SuccessResponse(data))
      
    } catch (e) {
        res.status(e.status || 400).json (new BadRequestError("Bad update request", 400, ERROR_CODES.BAD_REQUEST))
    }
})

router.delete('/vehicles/:id', auth.authorize('admin'), async (req, res) => {
    try {
        const vehicles = await Vehicle.findByIdAndDelete(req.params.id)

        if (!vehicles) {
            throw new HTTPError("Vehicle Not Found", 404, ERROR_CODES.NOT_FOUND)
        }

        const data = vehicles.map(vehicle =>({

            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            dateCreated: user.dateCreated,
            dateUpdated: user.dateUpdated,
        }))

        res.json(new SuccessResponse(data))

    } catch (e) {
        res.status(e.status || 500).json (new ErrorResponse(e.message, e.code))  
    }
})

module.exports = router