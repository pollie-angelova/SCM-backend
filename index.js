require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const opn = require('opn');
require('./db');
const userRouter = require('./routers/user')
const deliveryRouter = require('./routers/delivery')
const vehicleRouter = require('./routers/vehichles')
const vehiclePropsRouter = require('./routers/vehicleProps')
const oauthRouter = require('./routers/oauth')
const { HTTPError, ErrorResponse } = require('./lib/responses')
const logger = require('./lib/logger')

const app = express()

// Database
mongoose.connect(`mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const REDIRECT_URL = process.env.CLIENT_REDIRECT;

app.use(express.json())
app.use(userRouter)
app.use(deliveryRouter)
app.use(vehicleRouter)
app.use(vehiclePropsRouter)
app.use(oauthRouter)

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

// app.listen(port, () => {
//     console.log('Server is up on port ' + port)
// })

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`)
    
    // open browser and navigate to Google sign in
    const params = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        redirect_uri: REDIRECT_URL,
        scope: 'profile email',
        access_type: 'online',
        response_type: 'code',
        state: Math.round(Math.random() * 10000000),
    })
    opn(`${OAUTH_URL}?${params.toString()}`);
})
