package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jasonchiu/dohac-mock-apis/internal/api"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	router := api.NewRouter()

	fmt.Printf("Server started on port %s\n", port)
	fmt.Println("Press Ctrl+C to stop")

	log.Fatal(http.ListenAndServe(":"+port, router))
}
