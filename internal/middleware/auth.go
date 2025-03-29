package middleware

import (
	"net/http"
	"strings"

	"github.com/go-chi/render"
)

// AuthMiddleware is a simplified JWT authentication middleware
// In a real application, this would validate JWT tokens properly
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Skip auth for the authentication endpoints
		if strings.HasPrefix(r.URL.Path, "/oauth2") {
			next.ServeHTTP(w, r)
			return
		}

		// Get the authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			render.Status(r, http.StatusUnauthorized)
			render.JSON(w, r, map[string]string{"error": "Authorization header is required"})
			return
		}

		// Check if it's a Bearer token
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			render.Status(r, http.StatusUnauthorized)
			render.JSON(w, r, map[string]string{"error": "Authorization header must be Bearer token"})
			return
		}

		// For mock API, we'll accept any token that starts with "mock_"
		token := parts[1]
		if !strings.HasPrefix(token, "mock_") {
			render.Status(r, http.StatusUnauthorized)
			render.JSON(w, r, map[string]string{"error": "Invalid token"})
			return
		}

		// Pass request to the next handler
		next.ServeHTTP(w, r)
	})
}
