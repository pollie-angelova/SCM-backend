const mangoose = require('mongoose')

const DeliveryStatusSchema = new mangoose.Schema({
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
        type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recepientId: {
        type: Schema.Types.ObjectId,
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

const Delivery = mangoose.model('Delivery', DeliverySchema);
const DeliveryStatus = mangoose.model('DeliveryStatus', DeliveryStatusSchema);

module.exports = { Delivery, DeliveryStatus }