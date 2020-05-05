package tests

import (
	"encoding/json"
	"github.com/guillermoares/agile-engine/backend-golang/model"
	"net/http"
	"testing"
	"time"
)

func TestGETBalance(t *testing.T) {
	tearDown := SetUp()
	defer tearDown()

	client := http.Client{
		Timeout: time.Second,
	}

	response, err := client.Get("http://localhost:8000/")
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

	expectedAccount := model.Account{Balance: 0}
	if *account != expectedAccount {
		t.Errorf("Expected response body to be %v, but got %v", expectedAccount, *account)
	}
}

func TestGETBalance0(t *testing.T) {
	TestGETBalance(t)
}

func TestGETBalance1(t *testing.T) {
	TestGETBalance(t)
}

func TestGETBalance2(t *testing.T) {
	TestGETBalance(t)
}
