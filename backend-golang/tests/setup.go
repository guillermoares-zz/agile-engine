package tests

import (
	"bytes"
	"context"
	"fmt"
	"github.com/google/uuid"
	"github.com/guillermoares/agile-engine/backend-golang/server"
	"net/http"
	"time"
)

var HOST = "localhost"
var PORT = "8000"

func SetUp() (func(), http.Client) {
	svr, ready := server.StartServer(HOST, PORT)

	client := http.Client{
		Timeout: time.Second,
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

type Json map[string]interface{}
