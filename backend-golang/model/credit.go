package model

import (
	"github.com/google/uuid"
	"time"
)

const TRANSACTION_TYPE_CREDIT = "credit"

type Credit Transaction

func NewCredit(amount float32) *Credit {
	return &Credit{
		Id:            uuid.New().String(),
		Type:          TRANSACTION_TYPE_CREDIT,
		Amount:        amount,
		EffectiveDate: time.Now(),
	}
}

func (credit Credit) ApplyTo(account *Account) error {
	account.Balance += credit.Amount
	credit.EffectiveDate = time.Now()
	return nil
}
