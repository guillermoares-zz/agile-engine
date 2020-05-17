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
	rwMutex                sync.RWMutex
	transactions           []*Transaction
	indexesByTransactionId map[string]int
	balance                float32
}

func NewAccount() *Account {
	return &Account{
		balance:                INITIAL_BALANCE,
		transactions:           []*Transaction{},
		indexesByTransactionId: map[string]int{},
	}
}

func (account *Account) Balance() float32 {
	account.rwMutex.RLock()
	defer account.rwMutex.RUnlock()

	return account.balance
}

func (account *Account) Transactions() []*Transaction {
	account.rwMutex.RLock()
	defer account.rwMutex.RUnlock()

	return account.transactions
}

func (account *Account) GetTransactionWithId(id string) (*Transaction, error) {
	account.rwMutex.RLock()
	defer account.rwMutex.RUnlock()

	if transactionIndex, ok := account.indexesByTransactionId[id]; ok {
		return account.transactions[transactionIndex], nil
	}

	return nil, errors.New(TRANSACTION_DOES_NOT_EXIST_ERROR)
}

func (account *Account) Apply(transaction *Transaction) error {
	account.rwMutex.Lock()
	defer account.rwMutex.Unlock()

	err := transaction.applyTo(account)
	if err != nil {
		return err
	}

	account.indexesByTransactionId[transaction.Id] = len(account.transactions)
	account.transactions = append(account.transactions, transaction)

	return nil
}
