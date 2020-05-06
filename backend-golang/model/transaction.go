package model

import (
	"errors"
	"github.com/google/uuid"
	"time"
)

const (
	TRANSACTION_TYPE_CREDIT          = "credit"
	TRANSACTION_TYPE_DEBIT           = "debit"
	INVALID_TRANSACTION_TYPE_ERROR   = `transaction type must be either "credit" or "debit"`
	INVALID_TRANSACTION_AMOUNT_ERROR = `transaction amount must be >= 0`
)

type Transaction struct {
	Id            string
	Type          string
	Amount        float32
	EffectiveDate time.Time
}

func NewTransaction(tType string, amount float32) (*Transaction, error) {
	if (tType != TRANSACTION_TYPE_CREDIT) && (tType != TRANSACTION_TYPE_DEBIT) {
		return nil, errors.New(INVALID_TRANSACTION_TYPE_ERROR)
	}

	if amount <= 0 {
		return nil, errors.New(INVALID_TRANSACTION_AMOUNT_ERROR)
	}

	transaction := &Transaction{
		Id:            uuid.New().String(),
		Type:          tType,
		Amount:        amount,
		EffectiveDate: time.Now(),
	}

	return transaction, nil
}
