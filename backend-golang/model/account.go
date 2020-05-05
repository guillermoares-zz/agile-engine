package model

type Account struct {
	Balance float32 `json:"balance"`
	History AccountHistory
}

func NewAccount() *Account {
	return &Account{Balance: 0}
}
