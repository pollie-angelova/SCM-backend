require('dotenv').config()
const express = require('express');
const axios = require('axios');
// const opn = require('opn');
const router = new express.Router()

CLIENT_ID= `383745169524-jblc96764rptfm9cb8itu3kgn6arj34m.apps.googleusercontent.com`
CLIENT_SECRET= `PYmWG3nzzl3Un0GaVd_zAHPB`
PORT=3000
//const OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';
const ID_URL = 'https://oauth2.googleapis.com/tokeninfo';
const REDIRECT_URL = `http://localhost:${process.env.PORT}/api/oauth/code`;


router.get('/api/oauth/code', async(req, res) => {

    try {

        // parse query and check for error
        const queryParams = new URLSearchParams(req.query);
        if (queryParams.get('error')) {
            throw new Error(queryParams.get('error'));
        }

        // get authorization code
        const code = queryParams.get('code');

        // exchange authorization code for tokens
        const tokenData = await axios.post(TOKEN_URL, {
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URL,
            grant_type: 'authorization_code',
        })

        // use id token to fetch user data
        const userData = await axios.get(`${ID_URL}?id_token=${tokenData.data.id_token}`);

        // return result to user
        res.json(userData.data);

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
    
})



module.exports = router