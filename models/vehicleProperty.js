const mongoose = require('mongoose')

const VehicleProperty = mongoose.model('VehiculeProperty', {
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    propertyName: {
        type: String,
        enum: ['capacity'],
        required: true
    },

    //in kg 
    propertyValue: {
        type: Number,
        required: true
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

module.exports = { VehicleProperty }