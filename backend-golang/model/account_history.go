package model

type AccountHistory struct {
	Transactions []AccountAppliable
}

func (history *AccountHistory) Add(accountAppliable AccountAppliable) {
	history.Transactions = append(history.Transactions, accountAppliable)
}
