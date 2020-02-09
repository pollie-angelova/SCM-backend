const mongoose = require('mongoose')

const TRANSIT_STATUS = {
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed'
}

const TransitSchema = new mongoose.Schema({

    courierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    deliveries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delivery',
    }],

    status: {
        type: String,
        enum: [TRANSIT_STATUS.IN_PROGRESS, TRANSIT_STATUS.COMPLETED]
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

const Transit = mongoose.model('Transit', TransitSchema);

module.exports = { 
    Transit,
    TRANSIT_STATUS,
}
