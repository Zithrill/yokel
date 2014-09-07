'use strict';

var express = require('express');
var controller = require('./businesses.controller');

var router = express.Router();

router.get('/:object', controller.index);

module.exports = router;