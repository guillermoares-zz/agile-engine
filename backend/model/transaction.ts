import Account from './account'

export default abstract class Transaction {
  protected _id: string
  protected _amount: number
  protected _effectiveDate: Date

  protected constructor(id: string, amount: number) {
    this._id = id
    this._amount = amount
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
  
  setEffectiveDate(date: Date): void {
    this._effectiveDate = date
  }
  
  asJson() {
    return {
      id: this._id,
      type: this.type(),
      amount: this._amount,
      effectiveDate: this._effectiveDate && this._effectiveDate.toISOString()
    }
  }

  abstract type(): string
  abstract applyTo(account: Account): void
}