require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
require('./db');
const userRouter = require('./routers/user')
const deliveryRouter = require('./routers/delivery')
const vehicleRouter = require('./routers/vehichles')
const vehiclePropsRouter = require('./routers/vehicleProps')
const oauthRouter = require('./routers/oauth')
const transitsRouter = require('./routers/transits')
const { HTTPError, ErrorResponse } = require('./lib/responses')
const logger = require('./lib/logger')


const app = express()

// Database
mongoose.connect(`mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(deliveryRouter)
app.use(vehicleRouter)
app.use(vehiclePropsRouter)
app.use(oauthRouter)
app.use(transitsRouter)

// catch 404 and forward it to error handler
app.use((req, res, next) => {
    let err = new HTTPError('Not Found', 404)
    next(err)
})

// error handler
app.use(function (err, req, res) {
    logger.error(err.message)
    res.status(err.status || 500).json(new ErrorResponse(err.message))
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`)
})
