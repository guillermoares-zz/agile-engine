import Transaction from "./transaction";
import {TRANSACTION_DOES_NOT_EXIST} from "../constants";

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
    transaction.setEffectiveDate(new Date())
  }
  
  getById(id: string): Transaction {
    if (!this._index.has(id))
      throw new Error(TRANSACTION_DOES_NOT_EXIST)
    
    return this._transactions[this._index.get(id)]
  }
  
  asJson(): object {
    return this._transactions
      .map(transaction => transaction.asJson())
  }
}