package routes

import (
	"github.com/guillermoares/agile-engine/backend-golang/src/global"
	"net/http"
)

func GetAccount(w http.ResponseWriter, r *http.Request) {
	RespondWithJSON(w, http.StatusOK, struct {
		Balance float32
	}{global.Account.Balance()})
}
