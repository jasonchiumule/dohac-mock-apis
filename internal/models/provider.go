package models

// Provider represents a healthcare provider
type Provider struct {
	ID           string            `json:"id"`
	ResourceType string            `json:"resourceType"`
	Identifier   []Identifier      `json:"identifier"`
	Active       bool              `json:"active"`
	Type         []CodeableConcept `json:"type"`
	Name         string            `json:"name"`
	Telecom      []ContactPoint    `json:"telecom,omitempty"`
	Address      []Address         `json:"address,omitempty"`
	PartOf       *Reference        `json:"partOf,omitempty"`
}

// HealthcareService represents a healthcare service
type HealthcareService struct {
	ID                   string            `json:"id"`
	ResourceType         string            `json:"resourceType"`
	Identifier           []Identifier      `json:"identifier"`
	Active               bool              `json:"active"`
	ProvidedBy           Reference         `json:"providedBy"`
	Category             []CodeableConcept `json:"category,omitempty"`
	Type                 []CodeableConcept `json:"type,omitempty"`
	Name                 string            `json:"name"`
	Comment              string            `json:"comment,omitempty"`
	ServiceProvisionCode []CodeableConcept `json:"serviceProvisionCode,omitempty"`
	Location             []Reference       `json:"location,omitempty"`
}

// Common FHIR resource elements
type Identifier struct {
	System string `json:"system"`
	Value  string `json:"value"`
}

type CodeableConcept struct {
	Coding []Coding `json:"coding"`
	Text   string   `json:"text,omitempty"`
}

type Coding struct {
	System  string `json:"system"`
	Code    string `json:"code"`
	Display string `json:"display,omitempty"`
}

type ContactPoint struct {
	System string `json:"system"`
	Value  string `json:"value"`
	Use    string `json:"use,omitempty"`
}

type Address struct {
	Use        string   `json:"use,omitempty"`
	Type       string   `json:"type,omitempty"`
	Line       []string `json:"line"`
	City       string   `json:"city"`
	State      string   `json:"state"`
	PostalCode string   `json:"postalCode"`
	Country    string   `json:"country,omitempty"`
}

type Reference struct {
	Reference string `json:"reference"`
	Display   string `json:"display,omitempty"`
}
