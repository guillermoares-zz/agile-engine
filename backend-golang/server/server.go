package server

import (
	"fmt"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/guillermoares/agile-engine/backend-golang/server/routes"
	"net"
	"net/http"
)

func StartServer(host, port string) (*http.Server, chan bool) {
	router := mux.NewRouter()
	setRoutes(router)

	corsObj := handlers.AllowedOrigins([]string{"*"})

	server := &http.Server{
		Handler: handlers.CORS(corsObj)(router),
	}

	ready := make(chan bool)

	// Start our server in a goroutine so that it doesn't block.
	go func() {
		fmt.Println("Starting server at " + port)
		listener, err := net.Listen("tcp", fmt.Sprintf("%v:%v", host, port))
		if err != nil {
			panic(err)
		}

		ready <- true

		if err := server.Serve(listener); err != nil {
			fmt.Println(err)
		}
	}()

	return server, ready
}

func setRoutes(router *mux.Router) {
	router.HandleFunc("/", routes.GetAccount).Methods("GET")
	router.HandleFunc("/transactions", routes.GetTransactions).Methods("GET")
	router.HandleFunc("/transactions", routes.PostTransaction).Methods("POST")
	router.HandleFunc("/transactions/{id}", routes.GetTransactionById).Methods("GET")
}
