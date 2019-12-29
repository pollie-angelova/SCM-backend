const express = require('express')
const _ = require('lodash')
const VehicleProps = require('../models/vehicleProperty')
const { SuccessResponse, ErrorResponse, HTTPError,BadRequestError, ERROR_CODES } = require('../lib/responses')
const router = new express.Router()
const auth = require('../lib/auth')

router.post('/vehicles/:id/properties',auth.authorize('admin'), async (req, res) => {

    try {

        if (_.isEmpty(req.body.propertyName)) {
            throw new HTTPError('propertyName is required', 400, ERROR_CODES.INVALID_DATA);
        }
    
        if (_.isEmpty(req.body.propertyValue)) {
            throw new HTTPError('propertyValue is required', 400, ERROR_CODES.INVALID_DATA);
        }
    
        const vehicleProp = new VehicleProps({
            vehicleId: req.props.id,
            propertyName: req.body.propertyName,
            propertyValue: req.body.propertyValue,
        })

        await vehicleProp.save();

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
        res.status(e.status || 500).json (new ErrorResponse(e.message))
    }

})

router.get('/vehicles/:id/properties', auth.authorize('admin'),async (req, res) => {
    try {
        const vehicleProps = await VehicleProps.find({ vehicleId: req.props.id })

        const data = vehicleProps.map(vehicleProp=>({
            id: vehicleProp.id,
            vehicleId: vehicleProp.vehicleId,
            propertyName: vehicleProp.propertyName,
            propertyValue: vehicleProp.propertyValue,
            dateCreated: vehicleProp.dateCreated,
            dateUpdated: vehicleProp.dateUpdated,
        }))

        res.json(new SuccessResponse(data))
    
    } catch (e) {
        res.status(e.status || 500).json(new ErrorResponse(e.message, e.code))
    }
})

router.get('/vehicles/:id/properties/:propertyId',auth.authorize('admin'), async (req, res) => {
    const _id = req.params.prpertyId

    try {
        const vehicleProp = await VehicleProps.findById(_id)

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
        res.status(e.status || 500).json(new ErrorResponse(e.message, e.code))
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
        const vehicleProp = await VehicleProps.findByIdAndUpdate(req.params.propertyId, req.body, { new: true, runValidators: true })
       
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
        res.status(e.status || 400).json (new BadRequestError("Bad update request", 400, ERROR_CODES.BAD_REQUEST))
    }
})

router.delete('/vehicles/:id/properties/:propertyId',auth.authorize('admin'), async (req, res) => {
    try {
        const vehicleProps = await VehicleProps.findByIdAndDelete(req.params.id)

        // TODO: check result
        console.log(vehicleProps)
        if (!vehicleProps) {
            throw new HTTPError("Vehicle Property Not Found", 404, ERROR_CODES.NOT_FOUND)
        }

        res.json(new SuccessResponse())
    
    } catch (e) {
        res.status(e.status || 500).json (new ErrorResponse(e.message, e.code))  
    }
})

module.exports = router