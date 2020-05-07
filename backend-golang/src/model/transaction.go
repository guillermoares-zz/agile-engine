package model

import (
	"errors"
	"github.com/google/uuid"
	"time"
)

const (
	TRANSACTION_TYPE_CREDIT          = "credit"
	TRANSACTION_TYPE_DEBIT           = "debit"
	NOT_ENOUGH_FUNDS_ERROR           = "not enough funds for debit"
	INVALID_TRANSACTION_TYPE_ERROR   = `transaction type must be either "credit" or "debit"`
	INVALID_TRANSACTION_AMOUNT_ERROR = `transaction amount must be >= 0`
)

type Transaction struct {
	Id            string    `json:"id"`
	Type          string    `json:"type"`
	Amount        float32   `json:"amount"`
	EffectiveDate time.Time `json:"effectiveDate"`
}

func NewTransaction(tType string, amount float32) *Transaction {
	return &Transaction{
		Id:     uuid.New().String(),
		Type:   tType,
		Amount: amount,
	}
}

func (transaction *Transaction) applyTo(account *Account) error {
	switch transaction.Type {
	case TRANSACTION_TYPE_CREDIT:
		account.balance += transaction.Amount
	case TRANSACTION_TYPE_DEBIT:
		if account.balance < transaction.Amount {
			return errors.New(NOT_ENOUGH_FUNDS_ERROR)
		}

		account.balance -= transaction.Amount
	default:
		return errors.New(INVALID_TRANSACTION_TYPE_ERROR)
	}

	transaction.EffectiveDate = time.Now()

	return nil
}
