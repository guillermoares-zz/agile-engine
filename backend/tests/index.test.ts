import axios from 'axios'
import app from '../app'
import Model from "../model/model";
import Account from "../model/account";

describe("Account API", () => {
  const INITIAL_BALANCE = 300
  const HOST = 'localhost'
  const PORT = 3000;
  const client = axios.create({
    baseURL: `http://${HOST}:${PORT}`,
    timeout: 1000
  })
  let server;

  beforeEach(async () => {
    Model.Account = new Account(INITIAL_BALANCE)
    await new Promise(res => server = app.listen(PORT, HOST, res))
  })

  afterEach(async () => {
    await new Promise(res => server.close(res))
  })

  test('GET / fetches the current account balance', async () => {
    const res = await client.get('/')
    
    expect(res.status).toBe(200)
    expect(res.data).toEqual(INITIAL_BALANCE)
  })

  test('GET / Account balance increases after credit', async () => {
    await client.post('/transactions', {type: 'credit', amount: 100})

    const res = await client.get('/')

    expect(res.status).toBe(200)
    expect(res.data).toEqual(INITIAL_BALANCE + 100)
  })

  test('GET / Account balance decreases after debit', async () => {
    await client.post('/transactions', {type: 'debit', amount: 100})

    const res = await client.get('/')

    expect(res.status).toBe(200)
    expect(res.data).toEqual(INITIAL_BALANCE - 100)
  })
})