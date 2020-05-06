package model

import (
	"time"
)

const (
	INVALID_TRANSACTION_TYPE_ERROR   = `transaction type must be either "credit" or "debit"`
	INVALID_TRANSACTION_AMOUNT_ERROR = `transaction amount must be >= 0`
)

type Transaction struct {
	Id            string
	Type          string
	Amount        float32
	EffectiveDate time.Time
}
