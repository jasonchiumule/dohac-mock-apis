package auth

import (
	"bytes" // Added import
	"encoding/json"
	"fmt" // Added import
	"io"  // Added import
	"log" // Added import
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
	// Log headers
	log.Printf("createAccessToken: Request Headers: %+v", r.Header)

	// Log raw body (useful for debugging client issues like Mule)
	// Note: For 'application/x-www-form-urlencoded', the body is form data, not JSON.
	// Reading it raw here is for debugging, then it's parsed by r.ParseForm().
	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("createAccessToken: Error reading request body: %v", err)
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": "Could not read request body"})
		return
	}
	// IMPORTANT: Restore the body so r.ParseForm() can read it.
	r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
	log.Printf("createAccessToken: Raw Request Body: %s", string(bodyBytes))

	// Parse form data for application/x-www-form-urlencoded content type
	if err := r.ParseForm(); err != nil {
		log.Printf("createAccessToken: Error parsing form: %v. Body: %s", err, string(bodyBytes))
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "Invalid form data"})
		return
	}
	log.Printf("createAccessToken: Parsed Form Data: %+v", r.Form)

	// Extract form values
	req := models.TokenRequest{
		GrantType:           r.FormValue("grant_type"),
		ClientID:            r.FormValue("client_id"),
		ClientSecret:        r.FormValue("client_secret"),
		ClientAssertion:     r.FormValue("client_assertion"),
		ClientAssertionType: r.FormValue("client_assertion_type"),
		Scope:               r.FormValue("scope"),
	}
	log.Printf("createAccessToken: Populated TokenRequest struct: %+v", req)

	// Validate required fields
	if req.GrantType == "" || req.ClientID == "" {
		log.Printf("createAccessToken: Validation failed: grant_type and client_id are required. Request: %+v", req)
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
	log.Printf("createAccessToken: Response Payload: %+v", resp)

	render.Status(r, http.StatusCreated)
	render.JSON(w, r, resp)
}

// registerClient handles client registration
func registerClient(w http.ResponseWriter, r *http.Request) {
	var req models.ClientRegistrationRequest

	// Log headers
	log.Printf("registerClient: Request Headers: %+v", r.Header)

	// Log the raw request body
	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("registerClient: Error reading request body: %v", err)
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": "Could not read request body"})
		return
	}
	// Restore the body for further processing
	r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
	log.Printf("registerClient: Received raw registration request body: %s", string(bodyBytes))

	// Decode JSON request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("registerClient: Error decoding JSON request: %v. Body: %s", err, string(bodyBytes))
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "Invalid request body"})
		return
	}

	log.Printf("registerClient: Decoded registration request: %+v", req)

	// Validate required fields
	// if req.ClientName == "" || req.ClientURI == "" || req.JWT == "" || req.SoftwareID == "" || req.SoftwareVersionID == "" || len(req.RedirectURIs) == 0 || req.X509 == "" {
	// Make JWT and X509 optional by removing them from the validation check
	if req.ClientName == "" || req.ClientURI == "" || req.SoftwareID == "" || req.SoftwareVersionID == "" || len(req.RedirectURIs) == 0 {
		errorMsg := "client_name, client_uri, software_id, software_version_id, and redirect_uris are required"
		log.Printf("registerClient: Validation failed for registration request: %s. Request: %+v", errorMsg, req)
		render.Status(r, http.StatusBadRequest)
		// Update the error message to reflect that JWT and X.509 are no longer listed as strictly required
		render.JSON(w, r, map[string]string{"error": errorMsg})
		return
	}

	// Create mock registration response
	generatedClientID := "c64484a9-6cb3-4ad0-b9bd-" + time.Now().Format("150405") // Example client ID generation

	resp := models.ClientRegistrationResponse{
		ClientName:   req.ClientName,
		ClientID:     generatedClientID,
		ClientSecret: "xxxxxxxxxxxxxx", // Hardcoded client secret
		ClientURI:    fmt.Sprintf("https://svt-iam.health.gov.au:443/am/oauth2/realms/root/realms/dohac-api/register?client_id=%s", generatedClientID),
		RedirectURIs: req.RedirectURIs,
	}
	log.Printf("registerClient: Response Payload: %+v", resp)

	render.Status(r, http.StatusOK) // As per example, output is returned with 200 OK. Could be 201 Created.
	render.JSON(w, r, resp)
}

// updateClient handles client updates
func updateClient(w http.ResponseWriter, r *http.Request) {
	// Get client ID from URL
	clientID := chi.URLParam(r, "id")
	log.Printf("updateClient: ClientID from URL: %s", clientID)
	log.Printf("updateClient: Request Headers: %+v", r.Header)

	if clientID == "" {
		log.Printf("updateClient: Validation failed: Client ID is required but was empty.")
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "Client ID is required"})
		return
	}

	var req models.ClientUpdateRequest

	// Log raw request body
	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("updateClient: Error reading request body: %v", err)
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": "Could not read request body"})
		return
	}
	// Restore the body for further processing
	r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
	log.Printf("updateClient: Raw Request Body: %s", string(bodyBytes))

	// Decode JSON request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("updateClient: Error decoding JSON request: %v. Body: %s", err, string(bodyBytes))
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "Invalid request body"})
		return
	}
	log.Printf("updateClient: Decoded UpdateRequest struct: %+v", req)

	// Create mock update response
	// As ClientRegistrationResponse structure has changed, updateClient response also changes.
	resp := models.ClientRegistrationResponse{
		ClientID:     clientID,
		ClientName:   req.ClientName,                                                                                                          // From ClientUpdateRequest
		ClientSecret: "xxxxxxxxxxxxxx",                                                                                                        // Mocked, consistent with new registration response
		ClientURI:    fmt.Sprintf("https://svt-iam.health.gov.au:443/am/oauth2/realms/root/realms/dohac-api/register?client_id=%s", clientID), // Mocked
		RedirectURIs: req.RedirectURIs,                                                                                                        // From ClientUpdateRequest
	}
	log.Printf("updateClient: Response Payload: %+v", resp)

	render.Status(r, http.StatusOK)
	render.JSON(w, r, resp)
}

// deleteClient handles client deletion
func deleteClient(w http.ResponseWriter, r *http.Request) {
	// Get client ID from URL
	clientID := chi.URLParam(r, "id")
	log.Printf("deleteClient: ClientID from URL: %s", clientID)
	log.Printf("deleteClient: Request Headers: %+v", r.Header)

	if clientID == "" {
		log.Printf("deleteClient: Validation failed: Client ID is required but was empty.")
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "Client ID is required"})
		return
	}

	// In a real implementation, we would delete the client from a database
	// For this mock, we'll just return a success response
	log.Printf("deleteClient: Processed deletion for ClientID: %s. Responding with 204 No Content.", clientID)

	// Return 204 No Content for successful deletion
	w.WriteHeader(http.StatusNoContent)
}