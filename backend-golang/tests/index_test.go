package tests

import (
	"encoding/json"
	"github.com/guillermoares/agile-engine/backend-golang/src/model"
	"net/http"
	"testing"
)

func TestGetBalance(t *testing.T) {
	tearDown, client := SetUp()
	defer tearDown()

	response, err := client.Get(endpoint("/"))
	if err != nil {
		t.Errorf("Error sending request: %v", err)
		return
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %v, but got %v", http.StatusOK, response.StatusCode)
	}

	account := &model.Account{}
	err = json.NewDecoder(response.Body).Decode(account)
	if err != nil {
		t.Errorf("Couldn't decode response body into an Account")
		return
	}

	if account.Balance != model.INITIAL_BALANCE {
		t.Errorf("Expected account balance to be %v, but got %v", model.INITIAL_BALANCE, account.Balance)
	}
}

func TestGetBalanceChangesWithTransactions(t *testing.T) {
	tearDown, client := SetUp()
	defer tearDown()

	response := PostTransaction(t, &client, model.TRANSACTION_TYPE_CREDIT, 30)
	defer response.Body.Close()
	response = PostTransaction(t, &client, model.TRANSACTION_TYPE_DEBIT, 20)
	defer response.Body.Close()
	response = PostTransaction(t, &client, model.TRANSACTION_TYPE_CREDIT, 100)
	defer response.Body.Close()
	response = PostTransaction(t, &client, model.TRANSACTION_TYPE_DEBIT, 10)
	defer response.Body.Close()

	response, err := client.Get(endpoint("/"))
	if err != nil {
		t.Errorf("Error sending request: %v", err)
		return
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %v, but got %v", http.StatusOK, response.StatusCode)
	}

	account := &model.Account{}
	err = json.NewDecoder(response.Body).Decode(account)
	if err != nil {
		t.Errorf("Couldn't decode response body into an Account")
		return
	}

	if account.Balance != 100 {
		t.Errorf("Expected account balance to be %v, but got %v", 100, account.Balance)
	}
}
