const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', (req, res, next) => {
  req.session.access_token = null;
  var url;
res.redirect('../')

})





module.exports = router;
