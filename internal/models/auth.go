package models

// Authentication models

// TokenRequest represents an OAuth token request
type TokenRequest struct {
	GrantType           string `json:"grant_type"`
	ClientID            string `json:"client_id"`
	ClientSecret        string `json:"client_secret,omitempty"`
	ClientAssertion     string `json:"client_assertion,omitempty"`
	ClientAssertionType string `json:"client_assertion_type,omitempty"`
	Scope               string `json:"scope,omitempty"`
}

// TokenResponse represents an OAuth token response
type TokenResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int    `json:"expires_in"`
	Scope       string `json:"scope,omitempty"`
}

// ClientRegistrationRequest represents a client registration request
type ClientRegistrationRequest struct {
	ClientName      string   `json:"client_name"`
	SoftwareID      string   `json:"software_id"`
	SoftwareVersion string   `json:"software_version"`
	RedirectURIs    []string `json:"redirect_uris,omitempty"`
	JWK             string   `json:"jwk,omitempty"`
	X509            string   `json:"x509,omitempty"`
}

// ClientRegistrationResponse represents a client registration response
type ClientRegistrationResponse struct {
	ClientID         string   `json:"client_id"`
	ClientIDIssuedAt int64    `json:"client_id_issued_at"`
	ClientName       string   `json:"client_name"`
	SoftwareID       string   `json:"software_id"`
	SoftwareVersion  string   `json:"software_version"`
	RedirectURIs     []string `json:"redirect_uris,omitempty"`
	JWK              string   `json:"jwk,omitempty"`
	X509             string   `json:"x509,omitempty"`
}

// ClientUpdateRequest represents a client update request
type ClientUpdateRequest struct {
	ClientName      string   `json:"client_name,omitempty"`
	SoftwareVersion string   `json:"software_version,omitempty"`
	RedirectURIs    []string `json:"redirect_uris,omitempty"`
	JWK             string   `json:"jwk,omitempty"`
	X509            string   `json:"x509,omitempty"`
}
