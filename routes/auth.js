const express = require('express');
const router = express.Router();
const request = require('request');

// redirect to oauth provider
const redirect_uri = 'http://127.0.0.1:3000/auth/callback';

router.get('/login', (req, res, next) => {
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const redirect_url = 'https://accounts.google.com/o/oauth2/v2/auth';
  const scope = 'profile email';
  const state = 'cats';
  const response_type = 'code';
  const queryParams = `client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}&response_type=${response_type}`;
  res.redirect(`${redirect_url}?${queryParams}`);
});

router.get('/callback', (req, res, next) => {
  const code = req.query.code;
  const state = req.query.state;
  const data = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    code: code,
    redirect_uri: redirect_uri,
    grant_type: 'authorization_code',
    access_type: 'offline'
  };
  const options = {
    method: 'POST',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: data
  }
  request(options, (err, response, body) =>{
    if(!err && response.statusCode === 200){
      req.session.access_token = body.access_token;
      res.redirect('/profile');
    } else {
      res.send(body);
    }
  });
});

module.exports = router;
