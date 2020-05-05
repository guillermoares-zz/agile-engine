package tests

import (
	"context"
	"github.com/guillermoares/agile-engine/backend-golang/server"
	"time"
)

func SetUp() func() {
	svr, ready := server.StartServer("8000")
	<-ready

	return func() {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := svr.Shutdown(ctx); err != nil {
			panic("Error shutting down the server")
		}
	}
}
