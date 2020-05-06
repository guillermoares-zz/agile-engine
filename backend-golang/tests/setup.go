package tests

import (
	"bytes"
	"context"
	"fmt"
	"github.com/google/uuid"
	"github.com/guillermoares/agile-engine/backend-golang/src/global"
	"github.com/guillermoares/agile-engine/backend-golang/src/model"
	"github.com/guillermoares/agile-engine/backend-golang/src/server"
	"net/http"
	"testing"
	"time"
)

var HOST = "localhost"
var PORT = "3000"

func SetUp() (func(), http.Client) {
	global.Account = model.NewAccount()
	svr, ready := server.StartServer(HOST, PORT)

	// Need this for quick POSTs not to fail with EOF
	transport := http.DefaultTransport.(*http.Transport)
	transport.DisableKeepAlives = true

	client := http.Client{
		Timeout:   time.Second,
		Transport: transport,
	}

	<-ready

	return func() {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := svr.Shutdown(ctx); err != nil {
			panic("Error shutting down the server")
		}
	}, client
}

func endpoint(path string) string {
	return fmt.Sprintf("http://%v:%v%v", HOST, PORT, path)
}

func ToBuffer(jsonString string) *bytes.Buffer {
	return bytes.NewBuffer([]byte(jsonString))
}

func isValidUUID(id string) bool {
	_, err := uuid.Parse(id)
	return err == nil
}

func PostTransaction(t *testing.T, client *http.Client, tType string, amount float32) *http.Response {
	body := ToBuffer(fmt.Sprintf(`{"type": "%v", "amount": %v}`, tType, amount))

	response, err := client.Post(
		endpoint("/transactions"),
		"application/json",
		body)
	if err != nil {
		t.Errorf("Error sending request: %v", err)
		t.FailNow()
	}

	return response
}
