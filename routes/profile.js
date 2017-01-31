const express = require('express');
const router = express.Router();
const request = require('request');


router.get('/', (req, res, next) => {
  const access_token = req.session.access_token;
  const url = `https://graph.facebook.com/debug_token?input_token=${access_token}&access_token=${access_token}`
  // console.log(url);

  request(url, (err, response, body) => {
    // const user = JSON.parse(body);
    // console.log(body);
    console.log(JSON.parse(body))
    var data = JSON.parse(body)
    console.log(data.data.user_id);
    var userID = data.data.user_id;
    console.log(userID);
  var graphURL = `https://graph.facebook.com/v2.5/me?fields=name,picture,link&access_token=${access_token}`
    request(graphURL, (err, response, body) => {
      console.log(body);
      var user = JSON.parse(body);
      console.log(user)
      res.render('profile', {user: user});
    })
  })

});

module.exports = router;
