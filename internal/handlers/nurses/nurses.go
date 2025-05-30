package nurses

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"github.com/jasonchiu/dohac-mock-apis/internal/models"
)

// Mock data for nurse attendances
var mockAttendances = []models.RegisteredNurseAttendance{
	{
		ResourceType: "Encounter",
		ID:           "RN-12345",
		Identifier: []models.Identifier{
			{
				System: "http://ns.health.gov.au/id/attendance/rn",
				Value:  "RN-12345",
			},
		},
		Status: "finished",
		Subject: models.Reference{
			Reference: "HealthcareService/SVC-54321",
			Display:   "Sunset Residential Care",
		},
		Period: models.Period{
			Start: time.Date(2023, 7, 1, 7, 0, 0, 0, time.UTC),
			End:   time.Date(2023, 7, 1, 15, 0, 0, 0, time.UTC),
		},
		Performer: []models.Reference{
			{
				Reference: "Practitioner/RN-P12345",
				Display:   "Jane Smith",
			},
		},
		ReasonCode: []models.CodeableConcept{
			{
				Coding: []models.Coding{
					{
						System:  "http://terminology.hl7.org/CodeSystem/encounter-reason",
						Code:    "routine",
						Display: "Routine",
					},
				},
				Text: "Regular shift",
			},
		},
	},
	{
		ResourceType: "Encounter",
		ID:           "RN-23456",
		Identifier: []models.Identifier{
			{
				System: "http://ns.health.gov.au/id/attendance/rn",
				Value:  "RN-23456",
			},
		},
		Status: "finished",
		Subject: models.Reference{
			Reference: "HealthcareService/SVC-54321",
			Display:   "Sunset Residential Care",
		},
		Period: models.Period{
			Start: time.Date(2023, 7, 1, 15, 0, 0, 0, time.UTC),
			End:   time.Date(2023, 7, 1, 23, 0, 0, 0, time.UTC),
		},
		Performer: []models.Reference{
			{
				Reference: "Practitioner/RN-P67890",
				Display:   "John Doe",
			},
		},
		ReasonCode: []models.CodeableConcept{
			{
				Coding: []models.Coding{
					{
						System:  "http://terminology.hl7.org/CodeSystem/encounter-reason",
						Code:    "routine",
						Display: "Routine",
					},
				},
				Text: "Evening shift",
			},
		},
	},
	{
		ResourceType: "Encounter",
		ID:           "RN-34567",
		Identifier: []models.Identifier{
			{
				System: "http://ns.health.gov.au/id/attendance/rn",
				Value:  "RN-34567",
			},
		},
		Status: "finished",
		Subject: models.Reference{
			Reference: "HealthcareService/SVC-24680",
			Display:   "Golden Years Residential Care",
		},
		Period: models.Period{
			Start: time.Date(2023, 7, 1, 7, 0, 0, 0, time.UTC),
			End:   time.Date(2023, 7, 1, 15, 0, 0, 0, time.UTC),
		},
		Performer: []models.Reference{
			{
				Reference: "Practitioner/RN-P13579",
				Display:   "Emily Johnson",
			},
		},
		ReasonCode: []models.CodeableConcept{
			{
				Coding: []models.Coding{
					{
						System:  "http://terminology.hl7.org/CodeSystem/encounter-reason",
						Code:    "routine",
						Display: "Routine",
					},
				},
				Text: "Morning shift",
			},
		},
	},
}

// RegisterHandlers registers the registered nurses handlers
func RegisterHandlers(r chi.Router) {
	r.Route("/RegisteredNurseAttendance", func(r chi.Router) {
		r.Get("/", getAttendances)
		r.Route("/{id}", func(r chi.Router) {
			r.Get("/", getAttendanceByID)
			r.Patch("/", updateAttendance)
		})
	})
}

// getAttendances returns all registered nurse attendances
func getAttendances(w http.ResponseWriter, r *http.Request) {
	// Optional filters
	// organization := r.URL.Query().Get("organization")
	service := r.URL.Query().Get("service")
	// reportingPeriod := r.URL.Query().Get("reporting-period")
	summary := r.URL.Query().Get("summary")
	countStr := r.URL.Query().Get("_count")
	pageStr := r.URL.Query().Get("page")

	// Parse pagination parameters
	count := 10
	page := 1
	if countStr != "" {
		var err error
		count, err = strconv.Atoi(countStr)
		if err != nil || count <= 0 {
			count = 10
		}
	}
	if pageStr != "" {
		var err error
		page, err = strconv.Atoi(pageStr)
		if err != nil || page <= 0 {
			page = 1
		}
	}

	if summary == "true" {
		// Return summary data
		summaries := []models.AttendanceSummary{
			{
				ID:             "SUM-12345",
				ServiceID:      "SVC-54321",
				ServiceName:    "Sunset Residential Care",
				Date:           time.Date(2023, 7, 1, 0, 0, 0, 0, time.UTC),
				TotalHours:     16.0,
				DailyRequired:  true,
				CompliantDay:   true,
				CompliantWeek:  true,
				CompliantMonth: true,
			},
			{
				ID:             "SUM-23456",
				ServiceID:      "SVC-24680",
				ServiceName:    "Golden Years Residential Care",
				Date:           time.Date(2023, 7, 1, 0, 0, 0, 0, time.UTC),
				TotalHours:     8.0,
				DailyRequired:  true,
				CompliantDay:   true,
				CompliantWeek:  true,
				CompliantMonth: true,
			},
		}
		render.JSON(w, r, summaries)
		return
	}

	// Filter attendances by service
	var filteredAttendances []models.RegisteredNurseAttendance
	if service != "" {
		for _, attendance := range mockAttendances {
			if attendance.Subject.Reference == "HealthcareService/"+service {
				filteredAttendances = append(filteredAttendances, attendance)
			}
		}
	} else {
		filteredAttendances = mockAttendances
	}

	// Create bundle of attendances
	bundle := models.Bundle{
		ResourceType: "Bundle",
		ID:           "bundle-rn-attendances",
		Type:         "searchset",
		Total:        len(filteredAttendances),
		Link: []models.BundleLink{
			{
				Relation: "self",
				URL:      "https://api.health.gov.au/RegisteredNurseAttendance",
			},
		},
	}

	// Add entries to bundle
	for _, attendance := range filteredAttendances {
		bundle.Entry = append(bundle.Entry, models.BundleEntry{
			FullURL:  "https://api.health.gov.au/RegisteredNurseAttendance/" + attendance.ID,
			Resource: attendance,
		})
	}

	render.JSON(w, r, bundle)
}

// getAttendanceByID returns a registered nurse attendance by ID
func getAttendanceByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	// Find attendance by ID
	for _, attendance := range mockAttendances {
		if attendance.ID == id {
			render.JSON(w, r, attendance)
			return
		}
	}

	// If no attendance is found, return 404
	render.Status(r, http.StatusNotFound)
	render.JSON(w, r, map[string]string{"error": "Registered nurse attendance not found"})
}

// updateAttendance updates a registered nurse attendance
func updateAttendance(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	// Decode the request body
	var payload models.RegisteredNurseAttendancePatchPayload
	if err := render.DecodeJSON(r.Body, &payload); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": "Invalid request payload: " + err.Error()})
		return
	}

	// For this mock, we are not validating the id against mockAttendances
	// or actually updating any data. We just acknowledge the PATCH request.

	// transaction_id header can be retrieved using r.Header.Get("transaction_id")
	// For now, we are not using it as per the focused request.

	responseMessage := map[string]string{
		"message": fmt.Sprintf("successful PATCH to /RegisteredNurseAttendance/%s", id),
	}
	render.JSON(w, r, responseMessage)
}