package routes

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/guillermoares/agile-engine/backend-golang/src/global"
	"github.com/guillermoares/agile-engine/backend-golang/src/model"
	"net/http"
)

const (
	POST_TRANSACTION_BODY_ERROR = "Expected body: {type: [\"credit\"|\"debit\"], amount: number}"
)

type PostTransactionBody struct {
	Type   string  `json:"type,omitempty"`
	Amount float32 `json:"amount,omitempty"`
}

func GetTransactions(w http.ResponseWriter, _ *http.Request) {
	RespondWithJSON(w, http.StatusOK, global.Account.Transactions())
}

func GetTransactionById(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	transaction, err := global.Account.GetTransactionWithId(id)
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	RespondWithJSON(w, http.StatusOK, transaction)
}

func PostTransaction(w http.ResponseWriter, r *http.Request) {
	var body PostTransactionBody
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, POST_TRANSACTION_BODY_ERROR)
		return
	}

	if body.Amount <= 0 {
		RespondWithError(w, http.StatusBadRequest, model.INVALID_TRANSACTION_AMOUNT_ERROR)
		return
	}

	transaction := model.NewTransaction(body.Type, body.Amount)
	err = global.Account.Apply(transaction)
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	RespondWithJSON(w, http.StatusOK, transaction)
}
