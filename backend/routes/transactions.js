const express = require('express')
const Model = require('../model/model').default
const Credit = require('../model/credit').default
const Debit = require('../model/debit').default
const TransactionType = require('../model/transaction-type').default
const {
  MUST_SPECIFY_AMOUNT,
  MUST_SPECIFY_TRANSACTION_TYPE,
  NOT_ENOUGH_FUNDS,
  TRANSACTION_DOES_NOT_EXIST
} = require('../constants')

var router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.status(200).json(Model.Account.history().asJson())
});

router.post('/', ({body: {type, amount}}, res) => {
  if (typeof amount !== 'number')
    return res.status(400).send(MUST_SPECIFY_AMOUNT)

  let transaction

  switch (type) {
    case TransactionType.CREDIT:
      transaction = Credit.Of(amount)
      break
    case TransactionType.DEBIT:
      transaction = Debit.Of(amount)
      break
    default:
      return res.status(400).send(MUST_SPECIFY_TRANSACTION_TYPE)
  }

  try {
    Model.Account.apply(transaction)
  } catch (e) {
    if (e.message === NOT_ENOUGH_FUNDS)
      return res.status(400).send(e.message)

    throw e
  }

  res.status(200).json(transaction.asJson())
})

router.get('/:id', ({params: {id}}, res) => {
  let transaction

  try {
    transaction = Model.Account.history().getById(id)
  } catch (e) {
    if (e.message === TRANSACTION_DOES_NOT_EXIST)
      return res.status(400).send(e.message)

    throw e
  }

  res.status(200).json(transaction.asJson())
})

module.exports = router;
