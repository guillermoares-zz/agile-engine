import Transaction from "./transaction";

export default class TransactionHistory {
  protected _transactions: Transaction[] = []
  
  add(transaction: Transaction): void {
    this._transactions.push(transaction)
  }
  
  getById(id: string): Transaction | undefined {
    return this._transactions
      .find(transaction => transaction.id() === id)
  }
  
  asJson(): object {
    return this._transactions
      .map(transaction => transaction.asJson())
  }
}