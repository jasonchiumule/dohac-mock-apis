package models

import "time"

// Questionnaire represents a quality indicators questionnaire
type Questionnaire struct {
	ResourceType string              `json:"resourceType"`
	ID           string              `json:"id"`
	Name         string              `json:"name"`
	Title        string              `json:"title"`
	Status       string              `json:"status"`
	Subject      Reference           `json:"subject,omitempty"`
	Date         string              `json:"date"`
	Publisher    string              `json:"publisher"`
	Description  string              `json:"description"`
	Item         []QuestionnaireItem `json:"item"`
}

// QuestionnaireItem represents an item in a questionnaire
type QuestionnaireItem struct {
	LinkID       string              `json:"linkId"`
	Text         string              `json:"text"`
	Type         string              `json:"type"`
	Required     bool                `json:"required"`
	Item         []QuestionnaireItem `json:"item,omitempty"`
	AnswerOption []AnswerOption      `json:"answerOption,omitempty"`
	EnableWhen   []EnableWhen        `json:"enableWhen,omitempty"`
}

// AnswerOption represents possible answers for a questionnaire item
type AnswerOption struct {
	ValueInteger int    `json:"valueInteger,omitempty"`
	ValueString  string `json:"valueString,omitempty"`
	ValueBoolean bool   `json:"valueBoolean,omitempty"`
}

// EnableWhen represents a condition for when a question should be enabled
type EnableWhen struct {
	Question      string `json:"question"`
	Operator      string `json:"operator"`
	AnswerBoolean bool   `json:"answerBoolean,omitempty"`
	AnswerInteger int    `json:"answerInteger,omitempty"`
	AnswerString  string `json:"answerString,omitempty"`
}

// QuestionnaireResponse represents a response to a quality indicators questionnaire
type QuestionnaireResponse struct {
	ResourceType  string                      `json:"resourceType"`
	ID            string                      `json:"id"`
	Questionnaire string                      `json:"questionnaire"`
	Status        string                      `json:"status"`
	Subject       Reference                   `json:"subject"`
	AuthoredOn    time.Time                   `json:"authored"`
	Author        Reference                   `json:"author"`
	Item          []QuestionnaireResponseItem `json:"item"`
}

// QuestionnaireResponseItem represents an item in a questionnaire response
type QuestionnaireResponseItem struct {
	LinkID string                      `json:"linkId"`
	Text   string                      `json:"text"`
	Answer []QuestionnaireItemAnswer   `json:"answer,omitempty"`
	Item   []QuestionnaireResponseItem `json:"item,omitempty"`
}

// QuestionnaireItemAnswer represents an answer to a questionnaire item
type QuestionnaireItemAnswer struct {
	ValueInteger int    `json:"valueInteger,omitempty"`
	ValueString  string `json:"valueString,omitempty"`
	ValueBoolean bool   `json:"valueBoolean,omitempty"`
}
