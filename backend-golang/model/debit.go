package model

import (
	"errors"
	"github.com/google/uuid"
	"time"
)

const TRANSACTION_TYPE_DEBIT = "debit"
const NOT_ENOUGH_FUNDS_ERROR = "not enough funds for debit"

type Debit Transaction

func NewDebit(amount float32) *Debit {
	return &Debit{
		Id:            uuid.New().String(),
		Type:          TRANSACTION_TYPE_DEBIT,
		Amount:        amount,
		EffectiveDate: time.Now(),
	}
}

func (debit Debit) ApplyTo(account *Account) error {
	if account.Balance < debit.Amount {
		return errors.New(NOT_ENOUGH_FUNDS_ERROR)
	}

	account.Balance -= debit.Amount
	debit.EffectiveDate = time.Now()
	return nil
}
