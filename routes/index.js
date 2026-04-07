var express = require('express');
var router = express.Router();
var app = require('../app');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var serverless = require('serverless-http');

module.exports = router;
module.exports = serverless(app);