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

// New structs for PATCH /RegisteredNurseAttendance/{id} payload

// NonAttendanceTime represents the non-attendance time details for a registered nurse.
type NonAttendanceTime struct {
	AlternateArrangement        string  `json:"alternateArrangement,omitempty"`
	UnavailableEndTime          string  `json:"unavailableEndTime"`
	UnavailableReason           string  `json:"unavailableReason,omitempty"`
	UnavailableStartTime        string  `json:"unavailableStartTime"`
	AbsenceType                 string  `json:"absenceType,omitempty"`
	AccessToClinicalDocumentation *bool   `json:"accessToClinicalDocumentation,omitempty"`
	AccessToSupport             string  `json:"accessToSupport"`
	AuthorityDelegatedTo        string  `json:"authorityDelegatedTo,omitempty"`
	ID                          string  `json:"id,omitempty"` // e.g., "RNU-3583"
}

// AttendanceDay represents the attendance details for a specific day.
type AttendanceDay struct {
	AttendanceDayStatus string              `json:"attendanceDayStatus"`
	ID                  string              `json:"id"` // e.g., "SD-230926-1524"
	NonAttendanceTime   []NonAttendanceTime `json:"nonAttendanceTime,omitempty"`
	ReportingDate       string              `json:"reportingDate"` // Format: "YYYY-MM-DD"
}

// NominatedServiceIdentifier represents the identifier for the nominated service.
type NominatedServiceIdentifier struct {
	System string `json:"system"` // e.g., "https://api.health.gov.au/integrationID"
	Use    string `json:"use,omitempty"`    // e.g., "official"
	Value  string `json:"value"`  // e.g., "SRV-1111"
}

// ReportingPeriodPatch represents the reporting period with string dates for the PATCH payload.
type ReportingPeriodPatch struct {
	End   string `json:"end"`   // Format: "YYYY-MM-DD"
	Start string `json:"start"` // Format: "YYYY-MM-DD"
}

// RegisteredNurseAttendancePatchPayload represents the payload for updating registered nurse attendance.
type RegisteredNurseAttendancePatchPayload struct {
	ActivelyRecruiting              *bool                      `json:"activelyRecruiting,omitempty"`
	AttendanceDays                  []AttendanceDay            `json:"attendanceDays"`
	ID                              string                     `json:"id,omitempty"` // Logical ID of the resource, e.g., "Sub-240708-504"
	NominatedServiceIdentifier      NominatedServiceIdentifier `json:"nominatedServiceIdentifier"`
	ReporterDeclaration             *bool                      `json:"reporterDeclaration,omitempty"`
	ReportingPeriod                 ReportingPeriodPatch       `json:"reportingPeriod"`
	ResourceType                    string                     `json:"resourceType"` // Should be "RegisteredNurseAttendance"
	SubmissionStatus                string                     `json:"submissionStatus"`
	TransferHealthFacilityOther     string                     `json:"transferHealthFacilityOther,omitempty"`
	TransferHealthFacilityType      string                     `json:"transferHealthFacilityType,omitempty"`
	TransferOption                  *bool                      `json:"transferOption,omitempty"`
	VacancyFilled                   *bool                      `json:"vacancyFilled,omitempty"`
	VacancyOpenDuration             string                     `json:"vacancyOpenDuration,omitempty"`
	TotalCoverageHours              *float64                   `json:"totalCoverageHours,omitempty"`
	TotalUnavailableHours           *float64                   `json:"totalUnavailableHours,omitempty"`
	TotalHoursWithoutAltArrangement *float64                   `json:"totalHoursWithoutAltArrangement,omitempty"`
	CoveragePercentage              *float64                   `json:"coveragePercentage,omitempty"`
}