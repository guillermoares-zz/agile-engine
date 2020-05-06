package tests

import (
	"fmt"
	"github.com/guillermoares/agile-engine/backend-golang/model"
	"io/ioutil"
	"net/http"
	"testing"
)

func TestReadWriteBalanceConcurrently(t *testing.T) {
	teardown, client := SetUp()
	defer teardown()

	readCount := 1000
	writeCount := 1000

	readDone := make(chan bool)
	writeDone := make(chan bool)

	go func() {
		for i := 0; i < readCount; i++ {
			response, err := client.Get(endpoint("/"))
			if err != nil {
				t.Errorf("Error sending request: %v", err)
				return
			}
			defer response.Body.Close()

			if response.StatusCode != http.StatusOK {
				t.Errorf("Expected status code %v, but got %v", http.StatusOK, response.StatusCode)
			}
		}

		readDone <- true
	}()

	go func() {
		for i := 0; i < writeCount; i++ {
			body := ToBuffer(fmt.Sprintf(`{"type": "%v", "amount": 30}`, model.TRANSACTION_TYPE_CREDIT))

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
		}

		writeDone <- true
	}()

	<-readDone
	<-writeDone
}

func TestReadWriteTransactionHistoryConcurrently(t *testing.T) {
	teardown, client := SetUp()
	defer teardown()

	readCount := 1000
	writeCount := 1000

	readDone := make(chan bool)
	writeDone := make(chan bool)

	go func() {
		for i := 0; i < readCount; i++ {
			response, err := client.Get(endpoint("/transactions"))
			if err != nil {
				t.Errorf("Error sending request: %v", err)
				return
			}
			defer response.Body.Close()

			if response.StatusCode != http.StatusOK {
				t.Errorf("Expected status code %v, but got %v", http.StatusOK, response.StatusCode)
			}
		}

		readDone <- true
	}()

	go func() {
		for i := 0; i < writeCount; i++ {
			body := ToBuffer(fmt.Sprintf(`{"type": "%v", "amount": 30}`, model.TRANSACTION_TYPE_CREDIT))

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
		}

		writeDone <- true
	}()

	<-readDone
	<-writeDone
}
