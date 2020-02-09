const express = require('express')
const auth = require('../lib/auth')
const { Transit } = require('../models/transit')
const { SuccessResponse, ErrorResponse, HTTPError, ERROR_CODES } = require('../lib/responses');
const router = new express.Router()

router.get('/transits', auth.authorize('admin'), async (req, res) => {
    try {

        const transits = await Transit.find().populate('deliveries');
        const data = transits.map(transit => ({
            id: transit.id,
            deliveries: transit.deliveries,
            dateCreated: transit.dateCreated,
            dateUpdated: transit.dateUpdated,
        }));

        res.json(new SuccessResponse(data));

    } catch (e) {
        res.status(e.status || 500).json(new ErrorResponse(e.message, e.code));
    }
})

module.exports = router
