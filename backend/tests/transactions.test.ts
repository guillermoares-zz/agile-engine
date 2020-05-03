import axios from 'axios'
import app from '../app'
import Credit from "../model/credit";
import Debit from "../model/debit";
import isValidUUID from 'uuid-validate'
import TransactionHistory from "../model/transaction-history";
import Model from "../model/model";

describe('Transactions API', () => {
  const HOST = 'localhost'
  const PORT = 3000

  let server
  const client = axios.create({
    baseURL: `http://${HOST}:${PORT}`,
    timeout: 1000
  })

  beforeEach(async () => {
    Model.TransactionHistory = new TransactionHistory()
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
        .catch(err => {console.log(err.response.data); return err.response})
    
    const res = await client.get('/transactions')
      .catch(err => {console.log(err.response.data); return err.response})

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
    const transaction = (await client.post('/transactions', {type: 'credit', amount: 30})).data
    
    const res = await client.get(`/transactions/${transaction.id}`)
    
    expect(transaction).toEqual(res.data)
  })

  test("GET /transactions/:id fails if transaction doesn't exist", async () => {
    const res = await client.get(`/transactions/12345`)
      .catch(err => err.response)

    expect(res.data).toEqual("Transaction does not exist")
  })
  
})