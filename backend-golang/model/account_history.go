package model

type AccountHistory struct {
	Transactions []*Transaction
}

func (history *AccountHistory) Add(transaction *Transaction) {
	history.Transactions = append(history.Transactions, transaction)
}
