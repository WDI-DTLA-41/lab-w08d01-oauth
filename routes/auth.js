const express = require('express');
const router = express.Router();
const request = require('request');

// NEED TO REGISTER AS A FACEBOOK DEVELOPER TO 'REGISTER' AN APP


const redirect_uri = 'http://localhost:3000/auth'

// USING BARRETT DEV ACCOUNT TO CREATE ID AND SECRET

//if you use localhost:
// in Facebook-->Settings-->Basic, in field "App Domains" write "localhost", then click to "+Add Platform" choose "Web Site",
// it will create two fields "Mobile Site URL" and "Site URL", in "Site URL" write again "localhost".

// redirect to oauth provider
router.get('/login', (req, res, next) => {
  let redirect_url = 'https://www.facebook.com/v2.8/dialog/oauth?'
  let client_id = process.env.FB_CLIENT_ID
  let client_secret = process.env.FB_CLIENT_SECRET
  // console.log(client_id)
  // console.log(client_secret)
  let state = 'pikachu'

  let queryParams = `client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}`
  res.redirect(redirect_url + queryParams)
});

router.get('/', (req, res, next) =>{
  const code = req.query.code
  const state = req.query.state
  // let scope = 'user'
  let client_id = process.env.FB_CLIENT_ID
  let client_secret = process.env.FB_CLIENT_SECRET
  let url = `https://graph.facebook.com/v2.8/oauth/access_token?client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${client_secret}&code=${code}&state=${state}`

// console.log(data);
// const options = {
//   method: 'GET',
//   url: 'https://graph.facebook.com/v2.8/oauth/access_token?',
//   json: data
// }
// console.log(options);
  request(url, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      console.log(body);
      var info = JSON.parse(body);
      req.session.access_token = info.access_token
      // res.redirect('https://www.facebook.com/connect/login_success.html#' + req.session.access_token); //
      res.redirect('/profile'); //
    }
  })
})

module.exports = router;
