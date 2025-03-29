package auth

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"github.com/jasonchiu/dohac-mock-apis/internal/models"
)

// RegisterHandlers registers the authentication handlers
func RegisterHandlers(r chi.Router) {
	r.Route("/oauth2", func(r chi.Router) {
		r.Post("/access-tokens", createAccessToken)
		r.Post("/registration", registerClient)
		r.Route("/registration/{id}", func(r chi.Router) {
			r.Patch("/", updateClient)
			r.Delete("/", deleteClient)
		})
	})
}

// createAccessToken handles token requests
func createAccessToken(w http.ResponseWriter, r *http.Request) {
	// Parse form data for application/x-www-form-urlencoded content type
	if err := r.ParseForm(); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "Invalid form data"})
		return
	}

	// Extract form values
	req := models.TokenRequest{
		GrantType:           r.FormValue("grant_type"),
		ClientID:            r.FormValue("client_id"),
		ClientSecret:        r.FormValue("client_secret"),
		ClientAssertion:     r.FormValue("client_assertion"),
		ClientAssertionType: r.FormValue("client_assertion_type"),
		Scope:               r.FormValue("scope"),
	}

	// Validate required fields
	if req.GrantType == "" || req.ClientID == "" {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "grant_type and client_id are required"})
		return
	}

	// In a real implementation, we would validate the client credentials or JWT
	// For this mock, we'll just return a success response

	// Create mock token response
	resp := models.TokenResponse{
		AccessToken: "mock_" + req.ClientID + "_" + time.Now().Format("20060102150405"),
		TokenType:   "Bearer",
		ExpiresIn:   3600,
		Scope:       req.Scope,
	}

	render.Status(r, http.StatusCreated)
	render.JSON(w, r, resp)
}

// registerClient handles client registration
func registerClient(w http.ResponseWriter, r *http.Request) {
	var req models.ClientRegistrationRequest

	// Decode JSON request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "Invalid request body"})
		return
	}

	// Validate required fields
	if req.ClientName == "" || req.SoftwareID == "" || req.SoftwareVersion == "" {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "client_name, software_id, and software_version are required"})
		return
	}

	// Create mock registration response
	now := time.Now().Unix()
	resp := models.ClientRegistrationResponse{
		ClientID:         "c88484a9-6cb3-4ad0-b9bd-" + time.Now().Format("150405"),
		ClientIDIssuedAt: now,
		ClientName:       req.ClientName,
		SoftwareID:       req.SoftwareID,
		SoftwareVersion:  req.SoftwareVersion,
		RedirectURIs:     req.RedirectURIs,
		JWK:              req.JWK,
		X509:             req.X509,
	}

	render.Status(r, http.StatusOK)
	render.JSON(w, r, resp)
}

// updateClient handles client updates
func updateClient(w http.ResponseWriter, r *http.Request) {
	// Get client ID from URL
	clientID := chi.URLParam(r, "id")
	if clientID == "" {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "Client ID is required"})
		return
	}

	var req models.ClientUpdateRequest

	// Decode JSON request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "Invalid request body"})
		return
	}

	// Create mock update response
	resp := models.ClientRegistrationResponse{
		ClientID:         clientID,
		ClientIDIssuedAt: time.Now().Unix() - 3600, // Issued an hour ago
		ClientName:       req.ClientName,
		SoftwareVersion:  req.SoftwareVersion,
		RedirectURIs:     req.RedirectURIs,
		JWK:              req.JWK,
		X509:             req.X509,
		SoftwareID:       "example-software-id", // This would come from the original registration
	}

	render.Status(r, http.StatusOK)
	render.JSON(w, r, resp)
}

// deleteClient handles client deletion
func deleteClient(w http.ResponseWriter, r *http.Request) {
	// Get client ID from URL
	clientID := chi.URLParam(r, "id")
	if clientID == "" {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "Client ID is required"})
		return
	}

	// In a real implementation, we would delete the client from a database
	// For this mock, we'll just return a success response

	// Return 204 No Content for successful deletion
	w.WriteHeader(http.StatusNoContent)
}
