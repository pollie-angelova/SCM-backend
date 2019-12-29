const mongoose = require('mongoose')

const DeliveryStatusSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['new', 'awaiting_pickup', 'in_transit', 'awaiting_devivery', 'delivered']
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const DeliverySchema = new mongoose.Schema({

    source: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true

        },
    },
    destination: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true

        },
    },
    description: {
        type: String
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recepientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    history: {
        type: [DeliveryStatusSchema]
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    }

})

const Delivery = mongoose.model('Delivery', DeliverySchema);
const DeliveryStatus = mongoose.model('DeliveryStatus', DeliveryStatusSchema);

module.exports = { Delivery, DeliveryStatus }