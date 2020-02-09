const mongoose = require('mongoose');
const { Transit, TRANSIT_STATUS } = require('../models/transit')
const { HTTPError, ERROR_CODES } = require('./responses');
const _ = require('lodash');
const maps = new require("@googlemaps/google-maps-services-js");
const mapsClient = new maps.Client({});
const GOOGLE_MAPS_API_KEY = 'AIzaSyDaaDOUqcL8C0Zknoj4QJpBd1WK1l8vTxY';

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
        const locations = transit.deliveries.filter(delivery => {
            const status = delivery.history[delivery.history.length - 1].name;
            return status !== 'delivered';
        }).map(delivery => {
            const [srcLon, srcLat] = delivery.source.coordinates;
            const [dstLon, dstLat] = delivery.destination.coordinates;
            return { source: [srcLat, srcLon].join(','), destination: [dstLat, dstLon].join(',') };
        });

        try {

            const origin = locations[0].source;
            const destination = locations[locations.length - 1].destination;
            let waypoints = [];
            locations.forEach(({ source, destination }) => {
                waypoints.push(source)
                waypoints.push(destination);
            })
            waypoints = waypoints.filter(wp => !origin.includes(wp) && !destination.includes(wp))
            

            const matrix = await mapsClient.directions({
                params: {
                    origin: origin.split(','),
                    destination: destination.split(','),
                    waypoints: _.uniqWith(waypoints, _.isEqual).map(wp => wp.split(',')),
                    optimizeWaypoints: true,
                    travelMode: 'DRIVING',
                    avoidHighways: false,
                    avoidTolls: true,
                    key: process.env.GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY
                },
                timeout: 5000 // milliseconds
            })

            const route = matrix.data.routes[0];
            const legs = route.legs.map(leg => ({
                distance: leg.distance.value,
                duration: leg.duration.value,
                startAddress: leg.start_address,
                startLocation: [leg.start_location.lng, leg.start_location.lat],
                endAddress: leg.end_address,
                endLocation: [leg.end_location.lng, leg.end_location.lat]
            }))
            
            transit.set('legs', legs);
            await transit.save();

        } catch (err) {
            console.error(err);
        }
        
    
    }

}

module.exports = {
    TransitController
}