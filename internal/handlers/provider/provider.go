package provider

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"github.com/jasonchiu/dohac-mock-apis/internal/models"
)

// Mock data for providers
var mockProviders = []models.Provider{
	{
		ID:           "PRV-12345",
		ResourceType: "Organization",
		Identifier: []models.Identifier{
			{
				System: "http://ns.health.gov.au/id/hi/hpio",
				Value:  "8003627500000328",
			},
			{
				System: "http://ns.health.gov.au/id/provider/naps",
				Value:  "PRV-12345",
			},
		},
		Active: true,
		Type: []models.CodeableConcept{
			{
				Coding: []models.Coding{
					{
						System:  "http://terminology.hl7.org/CodeSystem/organization-type",
						Code:    "prov",
						Display: "Healthcare Provider",
					},
				},
				Text: "Healthcare Provider",
			},
		},
		Name: "Sunset Aged Care",
		Telecom: []models.ContactPoint{
			{
				System: "phone",
				Value:  "0398765432",
				Use:    "work",
			},
			{
				System: "email",
				Value:  "info@sunsetagedcare.com.au",
				Use:    "work",
			},
		},
		Address: []models.Address{
			{
				Use:  "work",
				Type: "physical",
				Line: []string{
					"123 Sunset Boulevard",
				},
				City:       "Melbourne",
				State:      "VIC",
				PostalCode: "3000",
				Country:    "Australia",
			},
		},
	},
	{
		ID:           "PRV-67890",
		ResourceType: "Organization",
		Identifier: []models.Identifier{
			{
				System: "http://ns.health.gov.au/id/hi/hpio",
				Value:  "8003627500000329",
			},
			{
				System: "http://ns.health.gov.au/id/provider/naps",
				Value:  "PRV-67890",
			},
		},
		Active: true,
		Type: []models.CodeableConcept{
			{
				Coding: []models.Coding{
					{
						System:  "http://terminology.hl7.org/CodeSystem/organization-type",
						Code:    "prov",
						Display: "Healthcare Provider",
					},
				},
				Text: "Healthcare Provider",
			},
		},
		Name: "Golden Years Care",
		Telecom: []models.ContactPoint{
			{
				System: "phone",
				Value:  "0399876543",
				Use:    "work",
			},
			{
				System: "email",
				Value:  "info@goldenyearscare.com.au",
				Use:    "work",
			},
		},
		Address: []models.Address{
			{
				Use:  "work",
				Type: "physical",
				Line: []string{
					"456 Golden Road",
				},
				City:       "Sydney",
				State:      "NSW",
				PostalCode: "2000",
				Country:    "Australia",
			},
		},
	},
}

// Mock data for healthcare services
var mockHealthcareServices = []models.HealthcareService{
	{
		ID:           "SVC-54321",
		ResourceType: "HealthcareService",
		Identifier: []models.Identifier{
			{
				System: "http://ns.health.gov.au/id/service/aged-care",
				Value:  "SVC-54321",
			},
		},
		Active: true,
		ProvidedBy: models.Reference{
			Reference: "Organization/PRV-12345",
			Display:   "Sunset Aged Care",
		},
		Category: []models.CodeableConcept{
			{
				Coding: []models.Coding{
					{
						System:  "http://terminology.hl7.org/CodeSystem/service-category",
						Code:    "8",
						Display: "Aged Care Service",
					},
				},
				Text: "Aged Care Service",
			},
		},
		Type: []models.CodeableConcept{
			{
				Coding: []models.Coding{
					{
						System:  "http://terminology.hl7.org/CodeSystem/service-type",
						Code:    "124",
						Display: "Residential Aged Care",
					},
				},
				Text: "Residential Aged Care",
			},
		},
		Name:    "Sunset Residential Care",
		Comment: "Providing high quality residential aged care",
		ServiceProvisionCode: []models.CodeableConcept{
			{
				Coding: []models.Coding{
					{
						System:  "http://terminology.hl7.org/CodeSystem/service-provision-conditions",
						Code:    "free",
						Display: "Free",
					},
				},
				Text: "Government Funded",
			},
		},
	},
	{
		ID:           "SVC-98765",
		ResourceType: "HealthcareService",
		Identifier: []models.Identifier{
			{
				System: "http://ns.health.gov.au/id/service/aged-care",
				Value:  "SVC-98765",
			},
		},
		Active: true,
		ProvidedBy: models.Reference{
			Reference: "Organization/PRV-12345",
			Display:   "Sunset Aged Care",
		},
		Category: []models.CodeableConcept{
			{
				Coding: []models.Coding{
					{
						System:  "http://terminology.hl7.org/CodeSystem/service-category",
						Code:    "8",
						Display: "Aged Care Service",
					},
				},
				Text: "Aged Care Service",
			},
		},
		Type: []models.CodeableConcept{
			{
				Coding: []models.Coding{
					{
						System:  "http://terminology.hl7.org/CodeSystem/service-type",
						Code:    "125",
						Display: "Home Care",
					},
				},
				Text: "Home Care",
			},
		},
		Name:    "Sunset Home Care",
		Comment: "Providing support services in the home",
		ServiceProvisionCode: []models.CodeableConcept{
			{
				Coding: []models.Coding{
					{
						System:  "http://terminology.hl7.org/CodeSystem/service-provision-conditions",
						Code:    "free",
						Display: "Free",
					},
				},
				Text: "Government Funded",
			},
		},
	},
	{
		ID:           "SVC-24680",
		ResourceType: "HealthcareService",
		Identifier: []models.Identifier{
			{
				System: "http://ns.health.gov.au/id/service/aged-care",
				Value:  "SVC-24680",
			},
		},
		Active: true,
		ProvidedBy: models.Reference{
			Reference: "Organization/PRV-67890",
			Display:   "Golden Years Care",
		},
		Category: []models.CodeableConcept{
			{
				Coding: []models.Coding{
					{
						System:  "http://terminology.hl7.org/CodeSystem/service-category",
						Code:    "8",
						Display: "Aged Care Service",
					},
				},
				Text: "Aged Care Service",
			},
		},
		Type: []models.CodeableConcept{
			{
				Coding: []models.Coding{
					{
						System:  "http://terminology.hl7.org/CodeSystem/service-type",
						Code:    "124",
						Display: "Residential Aged Care",
					},
				},
				Text: "Residential Aged Care",
			},
		},
		Name:    "Golden Years Residential Care",
		Comment: "Quality care in a comfortable environment",
		ServiceProvisionCode: []models.CodeableConcept{
			{
				Coding: []models.Coding{
					{
						System:  "http://terminology.hl7.org/CodeSystem/service-provision-conditions",
						Code:    "free",
						Display: "Free",
					},
				},
				Text: "Government Funded",
			},
		},
	},
}

// RegisterHandlers registers the provider handlers
func RegisterHandlers(r chi.Router) {
	r.Route("/Provider", func(r chi.Router) {
		r.Get("/", getProviders)
		r.Get("/{id}", getProviderByID)
	})

	r.Route("/HealthcareService", func(r chi.Router) {
		r.Get("/", getHealthcareServices)
		r.Get("/{id}", getHealthcareServiceByID)
	})
}

// getProviders returns all providers
func getProviders(w http.ResponseWriter, r *http.Request) {
	// In a real implementation, we would fetch providers from a database
	// and filter by organization based on the JWT claims
	render.JSON(w, r, mockProviders)
}

// getProviderByID returns a provider by ID
func getProviderByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	// Find provider by ID
	for _, provider := range mockProviders {
		if provider.ID == id {
			render.JSON(w, r, provider)
			return
		}
	}

	// If no provider is found, return 404
	render.Status(r, http.StatusNotFound)
	render.JSON(w, r, map[string]string{"error": "Provider not found"})
}

// getHealthcareServices returns all healthcare services
func getHealthcareServices(w http.ResponseWriter, r *http.Request) {
	// Optional provider ID filter
	providerID := r.URL.Query().Get("organization")

	if providerID == "" {
		// Return all services if no provider ID is specified
		render.JSON(w, r, mockHealthcareServices)
		return
	}

	// Filter services by provider ID
	var filteredServices []models.HealthcareService
	for _, service := range mockHealthcareServices {
		// Check if the service's providedBy reference matches the provider ID
		if service.ProvidedBy.Reference == "Organization/"+providerID {
			filteredServices = append(filteredServices, service)
		}
	}

	render.JSON(w, r, filteredServices)
}

// getHealthcareServiceByID returns a healthcare service by ID
func getHealthcareServiceByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	// Find service by ID
	for _, service := range mockHealthcareServices {
		if service.ID == id {
			render.JSON(w, r, service)
			return
		}
	}

	// If no service is found, return 404
	render.Status(r, http.StatusNotFound)
	render.JSON(w, r, map[string]string{"error": "Healthcare Service not found"})
}
