package routes

import (
	"encoding/json"
	"github.com/guillermoares/agile-engine/backend-golang/global"
	"github.com/guillermoares/agile-engine/backend-golang/model"
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
	RespondWithJSON(w, http.StatusOK, global.Account.History.Transactions)
}

func PostTransaction(w http.ResponseWriter, r *http.Request) {
	var body PostTransactionBody
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, POST_TRANSACTION_BODY_ERROR)
		return
	}

	transaction, err := model.NewTransaction(body.Type, body.Amount)
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	RespondWithJSON(w, http.StatusOK, transaction)
}
