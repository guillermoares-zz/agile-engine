package model

import "errors"

const (
	INITIAL_BALANCE                  float32 = 0
	TRANSACTION_DOES_NOT_EXIST_ERROR string  = "Transaction doesn't exist"
)

type Account struct {
	Balance      float32        `json:"balance"`
	Transactions []*Transaction `json:"-"`
}

func NewAccount() *Account {
	return &Account{Balance: INITIAL_BALANCE}
}

func (account Account) GetTransactionWithId(id string) (*Transaction, error) {
	for _, transaction := range account.Transactions {
		if transaction.Id == id {
			return transaction, nil
		}
	}

	return nil, errors.New(TRANSACTION_DOES_NOT_EXIST_ERROR)
}

func (account *Account) Apply(transaction *Transaction) error {
	err := transaction.ApplyTo(account)
	if err != nil {
		return err
	}

	account.Transactions = append(account.Transactions, transaction)

	return nil
}
