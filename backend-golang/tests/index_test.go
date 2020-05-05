package tests

import (
	"encoding/json"
	"github.com/guillermoares/agile-engine/backend-golang/global"
	"github.com/guillermoares/agile-engine/backend-golang/model"
	"net/http"
	"testing"
)

func TestGET(t *testing.T) {
	tearDown, client := SetUp()
	defer tearDown()

	response, err := client.Get(endpoint("/"))
	if err != nil {
		t.Errorf("Error sending request: %v", err)
		return
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %v, but got %v", http.StatusOK, response.StatusCode)
	}

	account := &model.Account{}
	err = json.NewDecoder(response.Body).Decode(account)
	if err != nil {
		t.Errorf("Couldn't decode response body into an Account")
		return
	}

	if account.Balance != global.INITIAL_BALANCE {
		t.Errorf("Expected account balance to be %v, but got %v", global.INITIAL_BALANCE, account.Balance)
	}
}
