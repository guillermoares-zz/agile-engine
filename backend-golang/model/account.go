package model

const (
	INITIAL_BALANCE float32 = 0
)

type Account struct {
	Balance float32        `json:"balance"`
	History AccountHistory `json:"-"`
}

type AccountAppliable interface {
	ApplyTo(account *Account) error
}

func NewAccount() *Account {
	return &Account{Balance: INITIAL_BALANCE}
}

func (account *Account) Apply(appliable AccountAppliable) error {
	err := appliable.ApplyTo(account)
	if err != nil {
		return err
	}

	account.History.Add(appliable)

	return nil
}
