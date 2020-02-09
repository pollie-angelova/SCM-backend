const express = require('express')
const auth = require('../lib/auth')
const { Transit, TRANSIT_STATUS } = require('../models/transit')
const { SuccessResponse, ErrorResponse, HTTPError, ERROR_CODES } = require('../lib/responses');
const router = new express.Router()

router.get('/transits', auth.authorize('admin'), async (req, res) => {
    try {

        const transits = await Transit
            .find({ status: { $ne: TRANSIT_STATUS.COMPLETED } })
            .populate('deliveries')
            .populate('courierId');

        const data = transits.map(transit => ({
            id: transit.id,
            courierId: transit.courierId,
            deliveries: transit.deliveries,
            legs: transit.legs,
            dateCreated: transit.dateCreated,
            dateUpdated: transit.dateUpdated,
        }));

        res.json(new SuccessResponse(data));

    } catch (e) {
        res.status(e.status || 500).json(new ErrorResponse(e.message, e.code));
    }
})

module.exports = router
