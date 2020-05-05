package routes

import (
	"github.com/guillermoares/agile-engine/backend-golang/global"
	"net/http"
)

func GetAccount(w http.ResponseWriter, r *http.Request) {
	RespondWithJSON(w, http.StatusOK, global.Account)
}
