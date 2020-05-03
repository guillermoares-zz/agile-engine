const express = require('express')
const Model = require('../model/model').default
const Credit = require('../model/credit').default
const Debit = require('../model/debit').default

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
    case 'credit':
      transaction = Credit.Of(amount)
      break
    case 'debit':
      transaction = Debit.Of(amount)
      break
    default:
      return res.status(400).send('Must specify a transaction type')
  }
  
  try {
    Model.Account.apply(transaction) 
  } catch (e) {
    res.status(400).send(e.message)
  }
  
  res.status(200).json(transaction.asJson())
})

router.get('/:id', ({params: {id}}, res) => {
  const transaction = Model.Account.history().getById(id)
  
  if (!transaction)
    return res.status(400).send('Transaction does not exist')
  
  res.status(200).json(transaction.asJson())
})

module.exports = router;
