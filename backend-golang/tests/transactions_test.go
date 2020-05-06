package tests

import (
	"encoding/json"
	"fmt"
	"github.com/guillermoares/agile-engine/backend-golang/model"
	"github.com/guillermoares/agile-engine/backend-golang/server/routes"
	"io/ioutil"
	"net/http"
	"testing"
	"time"
)

func TestGETTransactions(t *testing.T) {
	tearDown, client := SetUp()
	defer tearDown()

	response, err := client.Get(endpoint("/transactions"))
	if err != nil {
		t.Errorf("Error sending request: %v", err)
		return
	}
	defer response.Body.Close()

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

func TestPostTransaction(t *testing.T) {
	tearDown, client := SetUp()
	defer tearDown()

	body := ToBuffer(`{"type": "credit", "amount": 30}`)

	response, err := client.Post(
		endpoint("/transactions"),
		"application/json",
		body)
	if err != nil {
		t.Errorf("Error sending request: %v", err)
		return
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		bodyBytes, _ := ioutil.ReadAll(response.Body)
		fmt.Println(string(bodyBytes))
		t.Errorf("Expected status code %v, but got %v", http.StatusOK, response.StatusCode)
	}

	var transaction model.Transaction
	err = json.NewDecoder(response.Body).Decode(&transaction)
	if err != nil {
		t.Errorf("Couldn't decode response body into a transaction")
		return
	}

	if !isValidUUID(transaction.Id) {
		t.Errorf("Expected transaction id to be a valid UUID, but got \"%v\"", transaction.Id)
	}

	if transaction.Type != "credit" {
		t.Errorf("Expected transaction type to be \"credit\", but got \"%v\"", transaction.Type)
	}

	if transaction.Amount != 30 {
		t.Errorf("Expected transaction amount to be 30, but got %v", transaction.Amount)
	}

	if time.Now().Sub(transaction.EffectiveDate) >= (5 * time.Second) {
		t.Errorf("Expected transaction to had been effective within 5 seconds since now, but it was effective %v ago", transaction.EffectiveDate.Sub(time.Now()))
	}
}

func TestPostTransactionFailsIfTypeMissing(t *testing.T) {
	tearDown, client := SetUp()
	defer tearDown()

	body := ToBuffer(`{"amount": 30}`)

	response, err := client.Post(
		endpoint("/transactions"),
		"application/json",
		body)
	if err != nil {
		t.Errorf("Error sending request: %v", err)
		return
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %v, but got %v", http.StatusBadRequest, response.StatusCode)
	}

	var errorResponse struct{ Error string }
	err = json.NewDecoder(response.Body).Decode(&errorResponse)
	if err != nil {
		t.Errorf("Couldn't decode response body into a errorResponse")
		return
	}

	if errorResponse.Error != model.INVALID_TRANSACTION_TYPE_ERROR {
		t.Errorf(`Expected error errorResponse to be "%v", but got "%v"`, model.INVALID_TRANSACTION_TYPE_ERROR, errorResponse)
	}
}

func TestPostTransactionFailsIfAmountMissing(t *testing.T) {
	tearDown, client := SetUp()
	defer tearDown()

	body := ToBuffer(`{"type": "credit"}`)

	response, err := client.Post(
		endpoint("/transactions"),
		"application/json",
		body)
	if err != nil {
		t.Errorf("Error sending request: %v", err)
		return
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %v, but got %v", http.StatusBadRequest, response.StatusCode)
	}

	var errorResponse struct{ Error string }
	err = json.NewDecoder(response.Body).Decode(&errorResponse)
	if err != nil {
		t.Errorf("Couldn't decode response body into a errorResponse")
		return
	}

	if errorResponse.Error != model.INVALID_TRANSACTION_AMOUNT_ERROR {
		t.Errorf(`Expected error errorResponse to be "%v", but got "%v"`, model.INVALID_TRANSACTION_AMOUNT_ERROR, errorResponse)
	}
}

func TestPostTransactionFailsIfBodyMalformed(t *testing.T) {
	tearDown, client := SetUp()
	defer tearDown()

	body := ToBuffer(`not a json`)

	response, err := client.Post(
		endpoint("/transactions"),
		"application/json",
		body)
	if err != nil {
		t.Errorf("Error sending request: %v", err)
		return
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %v, but got %v", http.StatusBadRequest, response.StatusCode)
	}

	var errorResponse struct{ Error string }
	err = json.NewDecoder(response.Body).Decode(&errorResponse)
	if err != nil {
		t.Errorf("Couldn't decode response body into a errorResponse")
		return
	}

	if errorResponse.Error != routes.POST_TRANSACTION_BODY_ERROR {
		t.Errorf(`Expected error errorResponse to be "%v", but got "%v"`, routes.POST_TRANSACTION_BODY_ERROR, errorResponse)
	}
}
