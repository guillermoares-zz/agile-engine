import {v4 as uuid} from 'uuid'
import Transaction from "./transaction";

export default class Credit extends Transaction {
  static Of(amount: number): Credit {
    return new Credit(uuid(), amount, new Date())
  }
  
  type(): string {
    return 'credit'
  }
}