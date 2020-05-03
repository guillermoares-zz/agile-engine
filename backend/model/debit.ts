import {v4 as uuid} from 'uuid'
import Transaction from "./transaction";
import Account from "./account"

export default class Debit extends Transaction {
  static Of(amount: number): Debit {
    return new Debit(uuid(), amount, new Date())
  }

  type(): string {
    return 'debit'
  }

  applyTo(account: Account): void {
    account.withdraw(this._amount)
  }
}