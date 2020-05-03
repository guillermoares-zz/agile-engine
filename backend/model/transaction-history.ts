import Transaction from "./transaction";

export default class TransactionHistory {
  protected _transactions: Transaction[]
  protected _index: Map<string, number>
  
  constructor() {
    this._transactions = []
    this._index = new Map<string, number>()
  }
  
  add(transaction: Transaction): void {
    this._transactions.push(transaction)
    this._index.set(transaction.id(), this._transactions.length - 1)
  }
  
  getById(id: string): Transaction {
    if (!this._index.has(id))
      throw new Error('Transaction does not exist')
    
    return this._transactions[this._index.get(id)]
  }
  
  asJson(): object {
    return this._transactions
      .map(transaction => transaction.asJson())
  }
}