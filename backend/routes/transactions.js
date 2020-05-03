const express = require('express')
const Model = require('../model/model').default
const Credit = require('../model/credit').default
const Debit = require('../model/debit').default
const TransactionType = require('../model/transaction-type').default

var router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.status(200).json(Model.Account.history().asJson())
});

router.post('/', ({body: {type, amount}}, res) => {
  if (typeof amount !== 'number')
    return res.status(400).send('Must specify an amount')

  let transaction

  switch (type) {
    case TransactionType.CREDIT:
      transaction = Credit.Of(amount)
      break
    case TransactionType.DEBIT:
      transaction = Debit.Of(amount)
      break
    default:
      return res.status(400).send('Must specify a transaction type')
  }

  try {
    Model.Account.apply(transaction)
  } catch (e) {
    if (e.message === 'Not enough funds')
      res.status(400).send(e.message)
  }

  res.status(200).json(transaction.asJson())
})

router.get('/:id', ({params: {id}}, res) => {
  let transaction
  
  try {
    transaction = Model.Account.history().getById(id)
  } catch (e) {
    if (e.message === 'Transaction does not exist')
      return res.status(400).send(e.message)
  }

  res.status(200).json(transaction.asJson())
})

module.exports = router;
