package routes

import (
	"github.com/guillermoares/agile-engine/backend-golang/global"
	"net/http"
)

func GetTransactions(w http.ResponseWriter, r *http.Request) {
	RespondWithJSON(w, http.StatusOK, global.Account.History.Transactions)
}
