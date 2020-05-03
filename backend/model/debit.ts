import {v4 as uuid} from 'uuid'
import Transaction from "./transaction";
import Account from "./account"
import TransactionType from "./transaction-type";

export default class Debit extends Transaction {
  static Of(amount: number): Debit {
    return new Debit(uuid(), amount, new Date())
  }

  type(): string {
    return TransactionType.DEBIT
  }

  applyTo(account: Account): void {
    account.withdraw(this._amount)
  }
}