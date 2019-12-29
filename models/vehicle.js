const mongoose = require("mongoose")
const mongoDb = require('mongodb')

const Vehicle = mongoose.model("Vehicle", {

    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
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

module.exports = { Vehicle }