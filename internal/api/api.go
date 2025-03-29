package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/render"
	"github.com/jasonchiu/dohac-mock-apis/internal/handlers/auth"
	"github.com/jasonchiu/dohac-mock-apis/internal/handlers/nurses"
	"github.com/jasonchiu/dohac-mock-apis/internal/handlers/provider"
	"github.com/jasonchiu/dohac-mock-apis/internal/handlers/quality"
	custommiddleware "github.com/jasonchiu/dohac-mock-apis/internal/middleware"
)

// NewRouter creates a new router with all the registered handlers
func NewRouter() http.Handler {
	r := chi.NewRouter()

	// Middleware
	r.Use(chimiddleware.RequestID)
	r.Use(chimiddleware.RealIP)
	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	r.Use(render.SetContentType(render.ContentTypeJSON))

	// CORS configuration
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "transaction_id"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	})
	r.Use(corsMiddleware.Handler)

	// Public routes that don't require authentication
	r.Group(func(r chi.Router) {
		// Health check
		r.Get("/health", healthCheck)

		// Authentication endpoints
		auth.RegisterHandlers(r)
	})

	// Protected routes that require authentication
	r.Group(func(r chi.Router) {
		r.Use(custommiddleware.AuthMiddleware)

		// Provider and Healthcare Service endpoints
		provider.RegisterHandlers(r)

		// Quality Indicators endpoints
		quality.RegisterHandlers(r)

		// Registered Nurses endpoints
		nurses.RegisterHandlers(r)
	})

	return r
}

// healthCheck is a simple health check endpoint
func healthCheck(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, r, map[string]string{"status": "ok"})
}
