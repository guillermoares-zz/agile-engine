import {v4 as uuid} from 'uuid'
import Transaction from "./transaction";

export default class Debit extends Transaction {
  static Of(amount: number): Debit {
    return new Debit(uuid(), amount, new Date())
  }

  type(): string {
    return 'debit'
  }
}