require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const userRouter = require('./routers/user')
const deliveryRouter = require('./routers/delivery')
const vehicleRouter = require('./routers/vehichles')
const vehiclePropsRouter = require('./routers/vehicleProps')
const oauthRouter = require('./routers/oauth')
const transitsRouter = require('./routers/transits')
const { HTTPError, ErrorResponse } = require('./lib/responses')
const logger = require('./lib/logger')


const app = express()

// Database connection
mongoose.connect(`mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    logger.info('Successfully connected to DB')
}).catch(err => {
    logger.error(`DB connetion error: ${err.message}`)
});

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
    logger.info(`SCM backend listening on port ${process.env.PORT}!`)
})
