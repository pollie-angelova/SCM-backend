const mongoose = require('mongoose')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'diplomna'

mongoose.connect('mongodb://127.0.0.1:27017/diplomna', {
    useNewUrlParser: true,
    useCreateIndex: true
})

