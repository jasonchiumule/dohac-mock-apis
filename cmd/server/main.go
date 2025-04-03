package main

import (
	"context"
	"embed"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jasonchiu/dohac-mock-apis/internal/api"
)

//go:embed all:spa
var spaFiles embed.FS

func main() {
	// Setup context with cancellation for graceful shutdown
	_, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Setup signal handling for graceful shutdown
	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, os.Interrupt, syscall.SIGTERM)

	// Get port from environment
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Create API router
	apiRouter := api.NewRouter()

	// Create a main router for the application
	router := chi.NewRouter()

	// Mount the API router under /api
	router.Mount("/api", apiRouter)

	// Get the spa subdirectory from embedded files
	spa, err := fs.Sub(spaFiles, "spa")
	if err != nil {
		log.Fatal(err)
	}

	// Create file server for SPA
	fileServer := http.FileServer(http.FS(spa))

	// Handle static files with appropriate paths
	router.Handle("/assets/*", fileServer)
	router.Handle("/favicon.ico", fileServer)
	router.Handle("/robots.txt", fileServer)
	router.Handle("/vite.svg", fileServer)

	// Serve index.html for all other routes (SPA routing)
	router.HandleFunc("/*", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		indexFile, err := spa.Open("index.html")
		if err != nil {
			http.Error(w, "Could not open index.html", http.StatusInternalServerError)
			return
		}
		defer indexFile.Close()
		http.ServeContent(w, r, "index.html", time.Now(), indexFile.(io.ReadSeeker))
	})

	// Create HTTP server
	srv := &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	// Start the HTTP server in a goroutine
	go func() {
		fmt.Printf("Server started on port %s\n", port)
		fmt.Println("Press Ctrl+C to stop")

		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("HTTP server error: %v", err)
		}
	}()

	// Wait for interrupt signal
	<-signalChan
	log.Println("Received shutdown signal, gracefully shutting down...")

	// Create a deadline for shutdown
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()

	// Shutdown the HTTP server
	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("Server shutdown error: %v", err)
	}

	// Trigger context cancellation to stop background tasks
	cancel()
	log.Println("Server gracefully stopped")
}
