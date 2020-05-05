package model

type Account struct {
	Balance float32 `json:"balance"`
}

func NewAccount() *Account {
	return &Account{Balance: 0}
}
