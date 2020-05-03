const express = require('express')
const Model = require('../model/model').default
const Credit = require('../model/credit').default
const Debit = require('../model/debit').default

var router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.status(200).json(Model.TransactionHistory.asJson())
});

router.post('/', ({body: {type, amount}}, res) => {
  let transaction

  switch (type) {
    case 'credit':
      transaction = Credit.Of(amount)
      break
    case 'debit':
      transaction = Debit.Of(amount)
      break
  }
  
  Model.TransactionHistory.add(transaction)
  
  res.send(200).json(transaction.asJson())
})

module.exports = router;
