package model

const (
	INITIAL_BALANCE float32 = 0
)

type Account struct {
	Balance float32 `json:"balance"`
	History AccountHistory
}

func NewAccount() *Account {
	return &Account{Balance: INITIAL_BALANCE}
}

func (account *Account) Apply(transaction *Transaction) {
	account.History.Add(transaction)
}
