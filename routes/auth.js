const express = require('express');
const router = express.Router();
var base64 = require('base-64');
const request = require('request');
const redirect_uri = 'http://127.0.0.1:3000/auth/callback'

// redirect to oauth provider
router.get('/login', (req, res, next) => {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_url = 'https://accounts.spotify.com/authorize';
  const response_type = 'code';
  const state = '1234';
  const scope = 'playlist-read-private user-read-email user-top-read';
  const show_dialog = 'true';

  const queryParams = `client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}&show_dialog=${show_dialog}`
  res.redirect(redirect_url + '?' + queryParams);

});


router.get('/callback', function(req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if(!req.query.error) {

    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      method: 'POST',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      json: true
    };

    request(authOptions, (err, response, body) => {
      //console.log(body)
        req.session.access_token = body.access_token;
        req.session.token_type = body.token_type;
        req.session.scope = body.scope;
        req.session.expires_in = body.expires_in;
        req.session.refresh_token = body.refresh_token;
        res.redirect('/profile')
    })
  }
})
