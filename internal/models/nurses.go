package models

import "time"

// RegisteredNurseAttendance represents a registered nurse attendance record
type RegisteredNurseAttendance struct {
	ResourceType string            `json:"resourceType"`
	ID           string            `json:"id"`
	Identifier   []Identifier      `json:"identifier"`
	Status       string            `json:"status"`
	Subject      Reference         `json:"subject"`
	Period       Period            `json:"period"`
	Performer    []Reference       `json:"performer"`
	ReasonCode   []CodeableConcept `json:"reasonCode,omitempty"`
	Note         []Annotation      `json:"note,omitempty"`
}

// Bundle represents a FHIR bundle of resources
type Bundle struct {
	ResourceType string        `json:"resourceType"`
	ID           string        `json:"id"`
	Type         string        `json:"type"`
	Total        int           `json:"total"`
	Link         []BundleLink  `json:"link"`
	Entry        []BundleEntry `json:"entry"`
}

// BundleLink represents a link in a FHIR bundle
type BundleLink struct {
	Relation string `json:"relation"`
	URL      string `json:"url"`
}

// BundleEntry represents an entry in a FHIR bundle
type BundleEntry struct {
	FullURL  string `json:"fullUrl"`
	Resource any    `json:"resource"`
}

// Annotation represents a text note
type Annotation struct {
	Text string `json:"text"`
}

// Period represents a time period
type Period struct {
	Start time.Time `json:"start"`
	End   time.Time `json:"end,omitempty"`
}

// AttendanceSummary represents a summary of registered nurse attendance
type AttendanceSummary struct {
	ID             string    `json:"id"`
	ServiceID      string    `json:"serviceId"`
	ServiceName    string    `json:"serviceName"`
	Date           time.Time `json:"date"`
	TotalHours     float64   `json:"totalHours"`
	DailyRequired  bool      `json:"dailyRequired"`
	CompliantDay   bool      `json:"compliantDay"`
	CompliantWeek  bool      `json:"compliantWeek"`
	CompliantMonth bool      `json:"compliantMonth"`
}
