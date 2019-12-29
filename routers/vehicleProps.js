const express = require('express')
const VehicleProps = require('../models/vehicleProperty')

const router = new express.Router()
const auth = require('../lib/auth')
router.post('/vehicles/:id/properties',auth.authorize('admin'), async (req, res) => {
    const vehicleProp = new VehicleProps(req.body)

    try {
        await vehicleProp.save()

        const data = {

            id: vehicleProp.id,
            vehicleId: vehicleProp.vehicleId,
            propertyName: vehicleProp.propertyName,
            propertyValue: vehicleProp.propertyValue,
            dateCreated: vehicleProp.dateCreated,
            dateUpdated: vehicleProp.dateUpdated,
        }

        res.json(new SuccessResponse(data))
        
    } catch (e) {
        res.status(err.status || 400).json (new BadRequestError("Bad update request", 400, ERROR_CODES.BAD_REQUEST))
    }
})

router.get('/vehicles/:id/properties', auth.authorize('admin'),async (req, res) => {
    try {
        const vehicleProp = await VehicleProps.find({})

        const data = {

            id: vehicleProp.id,
            vehicleId: vehicleProp.vehicleId,
            propertyName: vehicleProp.propertyName,
            propertyValue: vehicleProp.propertyValue,
            dateCreated: vehicleProp.dateCreated,
            dateUpdated: vehicleProp.dateUpdated,
        }

        res.json(new SuccessResponse(data))
    
    } catch (e) {
        res.status(err.status || 500).json(new ErrorResponse(err.message, err.code))
    }
})

router.get('/vehicles/:id/properties/:propertyId',auth.authorize('admin'), async (req, res) => {
    const _id = req.params.id

    try {
        const vehicleProp = await VehicleProps.findById(_id)

        if (!vehicleProp) {
            throw new HTTPError("Vehicle Not Found", 404, ERROR_CODES.NOT_FOUND)
        }

        const data = {

            id: vehicleProp.id,
            vehicleId: vehicleProp.vehicleId,
            propertyName: vehicleProp.propertyName,
            propertyValue: vehicleProp.propertyValue,
            dateCreated: vehicleProp.dateCreated,
            dateUpdated: vehicleProp.dateUpdated,
        }

        res.json(new SuccessResponse(data))

    } catch (e) {
        res.status(err.status || 500).json(new ErrorResponse(err.message, err.code))
    }
})

router.patch('/vehicles/:id/properties/:propertyId',auth.authorize('admin'), async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['propertyName', 'propertyValue']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {

        throw new BadRequestError("Invalid update operation request", 400, ERROR_CODES.BAD_REQUEST)
    }

    try {
        const vehicleProp = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

       if (!vehicleProp) {
            throw new HTTPError("Vehicle Property Not Found", 404, ERROR_CODES.NOT_FOUND)
        }

        const data = {

            id: vehicleProp.id,
            vehicleId: vehicleProp.vehicleId,
            propertyName: vehicleProp.propertyName,
            propertyValue: vehicleProp.propertyValue,
            dateCreated: vehicleProp.dateCreated,
            dateUpdated: vehicleProp.dateUpdated,
        }

        res.json(new SuccessResponse(data))
    
    } catch (e) {
        res.status(err.status || 400).json (new BadRequestError("Bad update request", 400, ERROR_CODES.BAD_REQUEST))
    }
})

router.delete('/vehicles/:id/properties/:propertyId',auth.authorize('admin'), async (req, res) => {
    try {
        const vehicleProp = await VehicleProps.findByIdAndDelete(req.params.id)

        if (!vehicleProp) {
            throw new HTTPError("Vehicle Property Not Found", 404, ERROR_CODES.NOT_FOUND)
        }

        const data = {

            id: vehicleProp.id,
            vehicleId: vehicleProp.vehicleId,
            propertyName: vehicleProp.propertyName,
            propertyValue: vehicleProp.propertyValue,
            dateCreated: vehicleProp.dateCreated,
            dateUpdated: vehicleProp.dateUpdated,
        }

        res.json(new SuccessResponse(data))
    
    } catch (e) {
        res.status(err.status || 500).json (new ErrorResponse(err.message, err.code))  
    }
})

module.exports = router