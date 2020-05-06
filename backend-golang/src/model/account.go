package model

import (
	"errors"
	"sync"
)

const (
	INITIAL_BALANCE                  float32 = 0
	TRANSACTION_DOES_NOT_EXIST_ERROR string  = "Transaction doesn't exist"
)

type Account struct {
	RWMutex      sync.RWMutex   `json:"-"`
	Balance      float32        `json:"balance"`
	Transactions []*Transaction `json:"-"`
}

func NewAccount() *Account {
	return &Account{
		Balance:      INITIAL_BALANCE,
		Transactions: []*Transaction{},
	}
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
	account.RWMutex.Lock()
	defer account.RWMutex.Unlock()

	err := transaction.ApplyTo(account)
	if err != nil {
		return err
	}

	account.Transactions = append(account.Transactions, transaction)

	return nil
}
