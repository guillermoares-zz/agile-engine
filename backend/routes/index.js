var express = require('express');
var router = express.Router();
const Model = require("../model/model").default

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200).json(Model.Account.balance())
});

module.exports = router;
