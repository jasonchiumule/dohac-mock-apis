package nurses

import (
	"fmt"
	"log" // Added for logging
	"net/http"
	"strconv"
	"strings"
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

// updateAttendance updates a registered nurse attendance by processing a JSON payload or an uploaded CSV file.
func updateAttendance(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	contentType := r.Header.Get("Content-Type")

	// Handle CSV PATCH for submission IDs (e.g., "Sub-123-456") separately
	// because they don't correspond to an existing record in our mock data.
	if strings.Contains(contentType, "multipart/form-data") && strings.HasPrefix(id, "Sub-") {
		if err := r.ParseMultipartForm(10 << 20); err != nil {
			render.Status(r, http.StatusBadRequest)
			render.JSON(w, r, map[string]string{"error": "Could not parse multipart form: " + err.Error()})
			return
		}

		file, handler, err := r.FormFile("csv")
		if err != nil {
			render.Status(r, http.StatusBadRequest)
			render.JSON(w, r, map[string]string{"error": "Could not retrieve CSV file: " + err.Error()})
			return
		}
		defer file.Close()

		log.Printf("Received CSV file for submission: %s, Size: %d bytes for ID: %s", handler.Filename, handler.Size, id)

		// Mock a successful response since we are not updating a real record.
		mockResponse := models.RegisteredNurseAttendance{
			ResourceType: "Encounter",
			ID:           id,
			Status:       "completed",
			Subject: models.Reference{
				Reference: "HealthcareService/SVC-54321",
				Display:   "Sunset Residential Care",
			},
			Note: []models.Annotation{
				{
					Text: fmt.Sprintf("CSV file '%s' processed for submission %s at %s.", handler.Filename, id, time.Now().Format(time.RFC3339)),
				},
			},
		}
		render.JSON(w, r, mockResponse)
		return
	}

	// For all other requests (JSON patch, or CSV patch for existing records),
	// we must find the record first.
	var attendanceToUpdate *models.RegisteredNurseAttendance
	for i := range mockAttendances {
		if mockAttendances[i].ID == id {
			attendanceToUpdate = &mockAttendances[i]
			break
		}
	}

	if attendanceToUpdate == nil {
		render.Status(r, http.StatusNotFound)
		render.JSON(w, r, map[string]string{"error": "Registered nurse attendance not found"})
		return
	}

	// Now, handle the specific content type.
	if strings.Contains(contentType, "application/json") {
		// Handle JSON PATCH
		var patchPayload struct {
			Note []models.Annotation `json:"note"`
		}
		if err := render.DecodeJSON(r.Body, &patchPayload); err != nil {
			render.Status(r, http.StatusBadRequest)
			render.JSON(w, r, map[string]string{"error": "Invalid JSON payload: " + err.Error()})
			return
		}
		attendanceToUpdate.Note = patchPayload.Note
		log.Printf("Updated note via JSON for attendance record ID: %s", id)
		render.JSON(w, r, attendanceToUpdate)

	} else if strings.Contains(contentType, "multipart/form-data") {
		// Handle CSV PATCH for an existing record
		if err := r.ParseMultipartForm(10 << 20); err != nil {
			render.Status(r, http.StatusBadRequest)
			render.JSON(w, r, map[string]string{"error": "Could not parse multipart form: " + err.Error()})
			return
		}
		file, handler, err := r.FormFile("csv")
		if err != nil {
			render.Status(r, http.StatusBadRequest)
			render.JSON(w, r, map[string]string{"error": "Could not retrieve CSV file: " + err.Error()})
			return
		}
		defer file.Close()

		log.Printf("Received CSV file: %s, Size: %d bytes for ID: %s", handler.Filename, handler.Size, id)
		attendanceToUpdate.Note = append(attendanceToUpdate.Note, models.Annotation{
			Text: fmt.Sprintf("CSV file '%s' processed at %s.", handler.Filename, time.Now().Format(time.RFC3339)),
		})
		log.Printf("Updated note via CSV for attendance record ID: %s", id)
		render.JSON(w, r, attendanceToUpdate)

	} else {
		render.Status(r, http.StatusUnsupportedMediaType)
		render.JSON(w, r, map[string]string{"error": "Unsupported Content-Type: " + contentType + ". Must be 'application/json' or 'multipart/form-data'."})
	}
}