const mongoose = require('mongoose');
const { Transit, TRANSIT_STATUS } = require('../models/transit')
const { HTTPError, ERROR_CODES } = require('./responses');

/**
 * TransitController manages and interracts with Transit
 * DB object. A transit is a collection of deliveries that
 * need to be delivered in the most optimal way - saving
 * time and fuel. For this reason, Google Maps Distance Matrix API
 * is leveraged to provide the best routes and order or delivery.
 * The order is updated each time a delivery is added to a transit
 * or the delivery status is set to 'delivered'.
 * One delivery can belong to only one transit.
 * One transit can contain many deliveries (up to the capacity of the vehicle).
 */
class TransitController {

    /**
     * Create or update a transit based on delivery.
     * @param {Delivery} delivery 
     */
    static async build(delivery) {

        // TODO: based on the courierId take the vehicle that he/she is driving

        const deliveryId = mongoose.Types.ObjectId(delivery.id);

        let transit = await Transit.findOne({ courierId: delivery.courierId, status: { $ne: TRANSIT_STATUS.COMPLETED } });
        if (!transit) {
            // create new transit
            transit = new Transit({ 
                courierId: delivery.courierId,
                deliveries: [deliveryId],
                status: TRANSIT_STATUS.IN_PROGRESS
            });
        } else {
            // update existing transit with new delivery
            if (!transit.deliveries.includes(deliveryId)) {
                transit.set('deliveries', [...transit.deliveries, deliveryId]);
            }
        }

        // commit and return transit
        await transit.save()

        // Use GM DM API to build optimal route
        await TransitController.optimize(transit)

        return transit;

    }

    static async optimize(transitId) {

        // populate deliveries
        const transit = await Transit.findById(transitId).populate('deliveries');
        
        // TODO: make this deliveries with status new, awaiting_pickup, in_transit
        // take incomplete deliveries to build distance matrix
        const destinations = transit.deliveries.filter(delivery => {
            const status = delivery.history[delivery.history.length - 1].name;
            return status !== 'delivered';
        }).map(delivery => {
            const [srcLon, srcLat] = delivery.source.coordinates;
            const [dstLon, dstLat] = delivery.destination.coordinates;
            return [[srcLat, srcLon], [dstLat, dstLon]];
        });

        console.log(destinations)
        
    }

}

module.exports = {
    TransitController
}