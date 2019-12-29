const express = require('express');
const axios = require('axios');
const router = new express.Router();

const TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';
const ID_URL = 'https://oauth2.googleapis.com/tokeninfo';

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
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.CLIENT_REDIRECT,
            grant_type: 'authorization_code',
        })

        // use id token to fetch user data
        const userData = await axios.get(`${ID_URL}?id_token=${tokenData.data.id_token}`);

        // return result to user
        res.json(userData.data);

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
    
})



module.exports = router