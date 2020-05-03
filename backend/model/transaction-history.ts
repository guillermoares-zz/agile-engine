import Transaction from "./transaction";

export default class TransactionHistory {
  protected _transactions: Transaction[] = []
  
  add(transaction: Transaction): void {
    this._transactions.push(transaction)
  }
  
  asJson(): object {
    return this._transactions
      .map(transaction => transaction.asJson())
  }
}