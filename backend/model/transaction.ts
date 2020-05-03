export default abstract class Transaction {
  protected _id: string
  protected _amount: number
  protected _effectiveDate: Date

  protected constructor(id: string, amount: number, date: Date) {
    this._id = id
    this._amount = amount
    this._effectiveDate = date
  }

  id() {
    return this._id
  }

  amount(): number {
    return this._amount
  }

  effectiveDate(): Date {
    return this._effectiveDate
  }
  
  asJson() {
    return {
      id: this._id,
      type: this.type(),
      amount: this._amount,
      effectiveDate: this._effectiveDate.toString()
    }
  }

  abstract type(): string
}