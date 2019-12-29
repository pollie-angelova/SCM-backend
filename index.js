const express = require('express')
const opn = require('opn');
require('dotenv').config()
require('./db')
const userRouter = require('./routers/user')
const deliveryRouter = require('./routers/delivery')
const vehicleRouter = require('./routers/vehichles')
const vehiclePropsRouter = require('./routers/vehicleProps')
const googleSignInRouter = require('./routers/google-sign-in')

const app = express()
const port = process.env.PORT || 3000


const OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const REDIRECT_URL = `http://localhost:${port}/api/oauth/code`;

app.use(express.json())
app.use(userRouter)
app.use(deliveryRouter)
app.use(vehicleRouter)
app.use(vehiclePropsRouter)
app.use(googleSignInRouter)

// catch 404 and forward it to error handler
app.use((req, res, next) => {
    let err = new HTTPError('Not Found', 404)
    next(err)
})

// error handler
app.use(function (err, req, res, next) {
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