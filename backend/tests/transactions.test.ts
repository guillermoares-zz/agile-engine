import axios from 'axios'
import app from '../app'
import Credit from "../model/credit";
import Debit from "../model/debit";
import isValidUUID from 'uuid-validate'
import Model from "../model/model";
import Account from "../model/account";
import TransactionType from "../model/transaction-type";
import {
  MUST_SPECIFY_AMOUNT,
  MUST_SPECIFY_TRANSACTION_TYPE,
  NOT_ENOUGH_FUNDS,
  TRANSACTION_DOES_NOT_EXIST
} from "../constants";

describe('Transactions API', () => {
  const HOST = 'localhost'
  const PORT = 3000

  let server
  const client = axios.create({
    baseURL: `http://${HOST}:${PORT}`,
    timeout: 1000
  })

  beforeEach(async () => {
    Model.Account = new Account()
    await new Promise(res => server = app.listen(PORT, HOST, res))
  })

  afterEach(async () => {
    await new Promise(res => server.close(res))
  })

  test('GET /transactions fetches the transaction history', async () => {
    const expectedTransactions = [
      Credit.Of(100),
      Debit.Of(50),
      Credit.Of(200),
      Debit.Of(150)
    ]

    for (let t of expectedTransactions)
      await client.post('/transactions', {
        type: t.type(),
        amount: t.amount()
      })
    
    const res = await client.get('/transactions')

    expect(res.status).toBe(200)
    expect(res.data.length).toBe(4)
    res.data
      .forEach(t => {
        expect(isValidUUID(t.id, 4)).toBeTruthy()
        expect(new Date().getTime() - new Date(t.effectiveDate).getTime())
          .toBeLessThan(5000)
      })

    expectedTransactions
      .forEach((t, i) => {
        expect(t.type()).toEqual(res.data[i].type)
        expect(t.amount()).toEqual(res.data[i].amount)
      })
  })
  
  test('GET /transactions/:id fetches a transaction by ID', async () => {
    const transaction = (await client.post('/transactions', {type: TransactionType.CREDIT, amount: 30})).data
    
    const res = await client.get(`/transactions/${transaction.id}`)
    
    expect(transaction).toEqual(res.data)
  })

  test("GET /transactions/:id fails if transaction doesn't exist", async () => {
    const res = await client.get(`/transactions/12345`)
      .catch(err => err.response)

    expect(res.data).toEqual(TRANSACTION_DOES_NOT_EXIST)
  })

  async function testPOSTFor(transactionType) {
    const body = {
      'type': transactionType,
      'amount': 0
    }

    let res = await client.post('/transactions', body)

    expect(res.status).toBe(200)
    expect(res.data.type).toEqual(body.type)
    expect(res.data.amount).toEqual(body.amount)
    expect(isValidUUID(res.data.id, 4)).toBeTruthy()
    expect(new Date().getTime() - new Date(res.data.effectiveDate).getTime())
      .toBeLessThan(5000)

    res = await client.get('/transactions')

    expect(res.status).toBe(200)
    expect(res.data.length).toBe(1)
    expect(res.data[0].type).toEqual(body.type)
    expect(res.data[0].amount).toEqual(body.amount)
    expect(isValidUUID(res.data[0].id, 4)).toBeTruthy()
    expect(new Date().getTime() - new Date(res.data[0].effectiveDate).getTime())
      .toBeLessThan(5000)
  }

  test("POST /transactions commits a new transaction (credit)", async () => {
    await testPOSTFor(TransactionType.CREDIT)
  })

  test("POST /transactions commits a new transaction (debit)", async () => {
    await testPOSTFor(TransactionType.DEBIT)
  })

  test("POST /transactions fails if no amount is specified", async () => {
    const res = await client.post('/transactions', {type: TransactionType.CREDIT})
      .catch(err => err.response)

    expect(res.status).toBe(400)
    expect(res.data).toEqual(MUST_SPECIFY_AMOUNT)
  })

  test("POST /transactions fails if no transaction type is specified", async () => {
    const res = await client.post('/transactions', {amount: 999})
      .catch(err => err.response)

    expect(res.status).toBe(400)
    expect(res.data).toEqual(MUST_SPECIFY_TRANSACTION_TYPE)
  })

  test("POST /transactions fails if balance is not enough for debit", async () => {
    const res = await client.post('/transactions', {type: TransactionType.DEBIT, amount: 1})
      .catch(err => err.response)

    expect(res.status).toBe(400)
    expect(res.data).toEqual(NOT_ENOUGH_FUNDS)
  })
})