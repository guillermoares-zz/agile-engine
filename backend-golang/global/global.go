package global

import "github.com/guillermoares/agile-engine/backend-golang/model"

var Account *model.Account

func init() {
	Account = model.NewAccount()
}
