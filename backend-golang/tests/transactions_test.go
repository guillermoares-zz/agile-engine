package tests

import (
	"encoding/json"
	"github.com/guillermoares/agile-engine/backend-golang/model"
	"net/http"
	"testing"
)

func TestGETTransactions(t *testing.T) {
	tearDown, client := SetUp()
	defer tearDown()

	response, err := client.Get(endpoint("/transactions"))
	if err != nil {
		t.Errorf("Error sending request: %v", err)
		return
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %v, but got %v", http.StatusOK, response.StatusCode)
	}

	var transactions []model.Transaction
	err = json.NewDecoder(response.Body).Decode(&transactions)
	if err != nil {
		t.Errorf("Couldn't decode response body into a transactions array")
		return
	}

	if len(transactions) != 0 {
		t.Errorf("Expected no transactions, but got %v", transactions)
	}
}
