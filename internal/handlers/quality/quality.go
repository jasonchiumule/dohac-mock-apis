package quality

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"github.com/jasonchiu/dohac-mock-apis/internal/models"
)

// Mock data for questionnaires
var mockQuestionnaires = []models.Questionnaire{
	{
		ResourceType: "Questionnaire",
		ID:           "QC-20230630",
		Name:         "quality-indicators-q4-2022-23",
		Title:        "Quality Indicators Q4 2022-23",
		Status:       "active",
		Date:         "2023-06-30",
		Publisher:    "Department of Health and Aged Care",
		Description:  "Quality indicators questionnaire for Q4 2022-23",
		Item: []models.QuestionnaireItem{
			{
				LinkID:   "pressure-injuries",
				Text:     "Pressure Injuries",
				Type:     "group",
				Required: true,
				Item: []models.QuestionnaireItem{
					{
						LinkID:   "PI-01",
						Text:     "Number of residents who have developed a Stage 1 pressure injury during the quarter",
						Type:     "integer",
						Required: true,
					},
					{
						LinkID:   "PI-02",
						Text:     "Number of residents who have developed a Stage 2 pressure injury during the quarter",
						Type:     "integer",
						Required: true,
					},
					{
						LinkID:   "PI-03",
						Text:     "Number of residents who have developed a Stage 3 pressure injury during the quarter",
						Type:     "integer",
						Required: true,
					},
					{
						LinkID:   "PI-04",
						Text:     "Number of residents who have developed a Stage 4 pressure injury during the quarter",
						Type:     "integer",
						Required: true,
					},
					{
						LinkID:   "PI-05",
						Text:     "Any comments on pressure injuries data collection?",
						Type:     "string",
						Required: false,
					},
				},
			},
			{
				LinkID:   "physical-restraint",
				Text:     "Physical Restraint",
				Type:     "group",
				Required: true,
				Item: []models.QuestionnaireItem{
					{
						LinkID:   "PR-01",
						Text:     "Number of residents who were physically restrained during the quarter",
						Type:     "integer",
						Required: true,
					},
					{
						LinkID:   "PR-02",
						Text:     "Any comments on physical restraint data collection?",
						Type:     "string",
						Required: false,
					},
				},
			},
			{
				LinkID:   "unplanned-weight-loss",
				Text:     "Unplanned Weight Loss",
				Type:     "group",
				Required: true,
				Item: []models.QuestionnaireItem{
					{
						LinkID:   "UPWL-01",
						Text:     "Number of residents who experienced unplanned weight loss during the quarter",
						Type:     "integer",
						Required: true,
					},
					{
						LinkID:   "UPWL-02",
						Text:     "Number of residents who experienced consecutive unplanned weight loss",
						Type:     "integer",
						Required: true,
					},
					{
						LinkID:   "UPWL-03",
						Text:     "Any comments on unplanned weight loss data collection?",
						Type:     "string",
						Required: false,
					},
				},
			},
			{
				LinkID:   "falls-and-major-injury",
				Text:     "Falls and Major Injury",
				Type:     "group",
				Required: true,
				Item: []models.QuestionnaireItem{
					{
						LinkID:   "FMI-01",
						Text:     "Number of residents who experienced a fall during the quarter",
						Type:     "integer",
						Required: true,
					},
					{
						LinkID:   "FMI-02",
						Text:     "Number of residents who experienced a fall resulting in major injury",
						Type:     "integer",
						Required: true,
					},
					{
						LinkID:   "FMI-03",
						Text:     "Any comments on falls and major injury data collection?",
						Type:     "string",
						Required: false,
					},
				},
			},
			{
				LinkID:   "medication-management",
				Text:     "Medication Management",
				Type:     "group",
				Required: true,
				Item: []models.QuestionnaireItem{
					{
						LinkID:   "MM-01",
						Text:     "Number of residents who were prescribed antipsychotic medications",
						Type:     "integer",
						Required: true,
					},
					{
						LinkID:   "MM-02",
						Text:     "Number of residents who experienced a significant medication error",
						Type:     "integer",
						Required: true,
					},
					{
						LinkID:   "MM-03",
						Text:     "Any comments on medication management data collection?",
						Type:     "string",
						Required: false,
					},
				},
			},
		},
	},
}

// Mock data for questionnaire responses
var mockResponses = []models.QuestionnaireResponse{
	{
		ResourceType:  "QuestionnaireResponse",
		ID:            "QR-12345",
		Questionnaire: "QC-20230630",
		Status:        "completed",
		Subject: models.Reference{
			Reference: "HealthcareService/SVC-54321",
			Display:   "Sunset Residential Care",
		},
		AuthoredOn: time.Date(2023, 7, 15, 10, 30, 0, 0, time.UTC),
		Author: models.Reference{
			Reference: "Organization/PRV-12345",
			Display:   "Sunset Aged Care",
		},
		Item: []models.QuestionnaireResponseItem{
			{
				LinkID: "pressure-injuries",
				Text:   "Pressure Injuries",
				Item: []models.QuestionnaireResponseItem{
					{
						LinkID: "PI-01",
						Text:   "Number of residents who have developed a Stage 1 pressure injury during the quarter",
						Answer: []models.QuestionnaireItemAnswer{
							{
								ValueInteger: 2,
							},
						},
					},
					{
						LinkID: "PI-02",
						Text:   "Number of residents who have developed a Stage 2 pressure injury during the quarter",
						Answer: []models.QuestionnaireItemAnswer{
							{
								ValueInteger: 1,
							},
						},
					},
					{
						LinkID: "PI-03",
						Text:   "Number of residents who have developed a Stage 3 pressure injury during the quarter",
						Answer: []models.QuestionnaireItemAnswer{
							{
								ValueInteger: 0,
							},
						},
					},
					{
						LinkID: "PI-04",
						Text:   "Number of residents who have developed a Stage 4 pressure injury during the quarter",
						Answer: []models.QuestionnaireItemAnswer{
							{
								ValueInteger: 0,
							},
						},
					},
					{
						LinkID: "PI-05",
						Text:   "Any comments on pressure injuries data collection?",
						Answer: []models.QuestionnaireItemAnswer{
							{
								ValueString: "Improved prevention measures implemented in this quarter.",
							},
						},
					},
				},
			},
			// More items for other categories...
		},
	},
}

// RegisterHandlers registers the quality indicators handlers
func RegisterHandlers(r chi.Router) {
	r.Route("/Questionnaire", func(r chi.Router) {
		r.Get("/", getQuestionnaires)
		r.Get("/{id}", getQuestionnaireByID)
	})

	r.Route("/QuestionnaireResponse", func(r chi.Router) {
		r.Get("/", getQuestionnaireResponses)
		r.Post("/", createQuestionnaireResponse)
		r.Get("/{id}", getQuestionnaireResponseByID)
	})
}

// getQuestionnaires returns all questionnaires
func getQuestionnaires(w http.ResponseWriter, r *http.Request) {
	// Optional organization filter
	// org := r.URL.Query().Get("organization")
	// subject := r.URL.Query().Get("subject")

	// In a real implementation, we would filter by organization and subject
	// For this mock, we'll just return all questionnaires
	render.JSON(w, r, mockQuestionnaires)
}

// getQuestionnaireByID returns a questionnaire by ID
func getQuestionnaireByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	// Find questionnaire by ID
	for _, q := range mockQuestionnaires {
		if q.ID == id {
			render.JSON(w, r, q)
			return
		}
	}

	// If no questionnaire is found, return 404
	render.Status(r, http.StatusNotFound)
	render.JSON(w, r, map[string]string{"error": "Questionnaire not found"})
}

// getQuestionnaireResponses returns all questionnaire responses
func getQuestionnaireResponses(w http.ResponseWriter, r *http.Request) {
	// Optional filters
	// org := r.URL.Query().Get("organization")
	// subject := r.URL.Query().Get("subject")
	// startDate := r.URL.Query().Get("reporting-start")
	// endDate := r.URL.Query().Get("reporting-end")

	// In a real implementation, we would filter by these parameters
	// For this mock, we'll just return all responses
	render.JSON(w, r, mockResponses)
}

// getQuestionnaireResponseByID returns a questionnaire response by ID
func getQuestionnaireResponseByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	// Find response by ID
	for _, resp := range mockResponses {
		if resp.ID == id {
			render.JSON(w, r, resp)
			return
		}
	}

	// If no response is found, return 404
	render.Status(r, http.StatusNotFound)
	render.JSON(w, r, map[string]string{"error": "Questionnaire response not found"})
}

// createQuestionnaireResponse creates a new questionnaire response
func createQuestionnaireResponse(w http.ResponseWriter, r *http.Request) {
	var resp models.QuestionnaireResponse

	// Decode JSON request
	if err := json.NewDecoder(r.Body).Decode(&resp); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "Invalid request body"})
		return
	}

	// Validate required fields
	if resp.Questionnaire == "" || resp.Subject.Reference == "" {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "questionnaire and subject are required"})
		return
	}

	// In a real implementation, we would validate the response against the questionnaire
	// and save it to a database

	// Generate ID if not provided
	if resp.ID == "" {
		resp.ID = "QR-" + time.Now().Format("20060102150405")
	}

	// Set status to completed if not specified
	if resp.Status == "" {
		resp.Status = "completed"
	}

	// Set authored date if not specified
	if resp.AuthoredOn.IsZero() {
		resp.AuthoredOn = time.Now()
	}

	// Add to mock responses
	mockResponses = append(mockResponses, resp)

	render.Status(r, http.StatusCreated)
	render.JSON(w, r, resp)
}
