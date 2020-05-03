import {v4 as uuid} from 'uuid'
import Transaction from "./transaction";
import Account from "./account"

export default class Credit extends Transaction {
  static Of(amount: number): Credit {
    return new Credit(uuid(), amount, new Date())
  }
  
  type(): string {
    return 'credit'
  }

  applyTo(account: Account): void {
    account.deposit(this._amount)
  }
}