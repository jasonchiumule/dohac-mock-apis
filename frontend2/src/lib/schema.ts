// dohac-mock-apis/frontend2/src/lib/schema.ts

// --- Common FHIR-like & Utility Interfaces ---

/** Represents an identifier with a system and value. */
export interface Identifier {
  system: string;
  value: string;
}

/** Represents a coded concept with system, code, and display name. */
export interface Coding {
  system: string;
  code: string;
  display: string;
}

/** Represents a type definition, often using coded concepts. */
export interface Type {
  coding?: Coding[];
  text?: string;
}

/** Represents a reference to another resource (e.g., Organization, HealthcareService). */
export interface Reference {
  reference: string; // e.g., "Organization/PRV-12345" or "HealthcareService/SVC-54321"
  display?: string;
}

/** Represents contact information (phone, email, etc.). */
export interface Telecom {
  system: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other';
  value: string;
  use: 'home' | 'work' | 'temp' | 'old' | 'mobile';
}

/** Represents a physical address. */
export interface Address {
  use: 'home' | 'work' | 'temp' | 'old' | 'billing';
  type: 'postal' | 'physical' | 'both';
  line: string[];
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/** Represents a link within a FHIR Bundle. */
export interface BundleLink {
  relation: 'self' | 'first' | 'previous' | 'next' | 'last' | string; // Allow other relations
  url: string;
}

/** Represents an entry within a FHIR Bundle. Contains a specific resource. */
export interface BundleEntry<TResource = any> {
  fullUrl?: string;
  resource: TResource; // The actual resource (e.g., Encounter, Organization)
}

/** Represents a FHIR Bundle resource, used for collections of resources. */
export interface Bundle<TResource = any> {
  resourceType: 'Bundle';
  id?: string;
  type: 'document' | 'message' | 'transaction' | 'transaction-response' | 'batch' | 'batch-response' | 'history' | 'searchset' | 'collection';
  total?: number; // Typically used with 'searchset'
  link?: BundleLink[];
  entry?: BundleEntry<TResource>[];
}


// --- Authentication API Interfaces ---

/** Request body for registering a new client application. */
export interface RegistrationRequest {
  client_name: string;
  software_id: string;
  software_version: string;
  redirect_uris: string[];
}

/** Response body after successful client registration. */
export interface RegistrationResponse {
  client_id: string;
  client_id_issued_at: number; // Unix timestamp
  client_name: string;
  software_id: string;
  software_version: string;
  redirect_uris: string[];
}

/** Parameters for requesting an access token (sent as x-www-form-urlencoded). */
export interface AccessTokenRequestParams {
  grant_type: 'client_credentials'; // Or other grant types if supported
  client_id: string;
  client_secret: string; // Handle securely!
  scope: string; // e.g., "dhac:b2g:all:all ACO:ABN:123"
}

/** Response body containing the access token. */
export interface AccessTokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number; // Duration in seconds
  scope: string;
}


// --- Provider & Healthcare Service API Interfaces ---

/**
 * Represents an Organization resource (often a healthcare provider).
 * Based on the /api/Provider endpoint example response.
 */
export interface Organization {
  resourceType: 'Organization';
  id: string;
  identifier?: Identifier[];
  active?: boolean;
  type?: Type[];
  name: string;
  telecom?: Telecom[];
  address?: Address[];
}

/** Represents a code for service provision conditions. */
export interface ServiceProvisionCode {
  coding?: Coding[];
  text?: string;
}

/**
 * Represents a HealthcareService resource.
 * Based on the /api/HealthcareService endpoint example response.
 */
export interface HealthcareService {
  resourceType: 'HealthcareService';
  id: string;
  identifier?: Identifier[];
  active?: boolean;
  providedBy?: Reference; // Reference to the Organization providing the service
  category?: Type[];
  type?: Type[];
  name: string;
  comment?: string;
  serviceProvisionCode?: ServiceProvisionCode[];
}


// --- Quality Indicators API Interfaces ---

/** Represents a single item (question or group) within a Questionnaire. */
export interface QuestionnaireItem {
  linkId: string;
  text: string;
  type: 'group' | 'display' | 'boolean' | 'decimal' | 'integer' | 'date' | 'dateTime' | 'time' | 'string' | 'text' | 'url' | 'choice' | 'open-choice' | 'attachment' | 'reference' | 'quantity';
  required?: boolean;
  repeats?: boolean;
  readOnly?: boolean;
  item?: QuestionnaireItem[]; // Nested items for 'group' type
}

/**
 * Represents a Questionnaire resource.
 * Based on the /api/Questionnaire endpoint example response.
 */
export interface Questionnaire {
  resourceType: 'Questionnaire';
  id: string; // e.g., "QC-20230630"
  url?: string;
  version?: string;
  name?: string; // e.g., "quality-indicators-q4-2022-23"
  title?: string; // e.g., "Quality Indicators Q4 2022-23"
  status: 'draft' | 'active' | 'retired' | 'unknown';
  subjectType?: string[];
  date?: string; // ISO 8601 DateTime
  publisher?: string;
  description?: string;
  item?: QuestionnaireItem[];
}

/** Represents a single answer within a QuestionnaireResponse item. */
export interface QuestionnaireResponseAnswer {
  valueBoolean?: boolean;
  valueDecimal?: number;
  valueInteger?: number;
  valueDate?: string; // ISO 8601 Date
  valueDateTime?: string; // ISO 8601 DateTime
  valueTime?: string; // ISO 8601 Time
  valueString?: string;
  valueUri?: string;
  valueAttachment?: any;
  valueCoding?: Coding;
  valueQuantity?: any;
  valueReference?: Reference;
  item?: QuestionnaireResponseItem[]; // For nested answers
}

/** Represents an item (answered question or group) within a QuestionnaireResponse. */
export interface QuestionnaireResponseItem {
  linkId: string; // Corresponds to QuestionnaireItem.linkId
  text?: string; // Question text
  answer?: QuestionnaireResponseAnswer[];
  item?: QuestionnaireResponseItem[]; // Nested items for groups
}

/**
 * Represents a QuestionnaireResponse resource.
 * Based on the POST /api/QuestionnaireResponse request body example.
 */
export interface QuestionnaireResponse {
  resourceType: 'QuestionnaireResponse';
  id?: string;
  identifier?: Identifier;
  questionnaire: string; // e.g., "QC-20230630"
  status: 'in-progress' | 'completed' | 'amended' | 'entered-in-error' | 'stopped';
  subject?: Reference;
  encounter?: Reference;
  authored?: string; // ISO 8601 DateTime
  author?: Reference;
  source?: Reference;
  item?: QuestionnaireResponseItem[];
}


// --- Registered Nurse Attendance API Interfaces ---

/** Represents the 'period' of an Encounter. */
export interface EncounterPeriod {
  start: string; // ISO 8601 DateTime
  end?: string;  // ISO 8601 DateTime
}

/** Represents a performer in an Encounter. */
export interface EncounterPerformer {
  period?: EncounterPeriod;
  actor: Reference; // e.g., Practitioner/RN-P12345
}

/** Represents the reason for an Encounter. */
export interface EncounterReason {
  value?: Type[]; // Reason coding or text
}

/**
 * Represents an Encounter resource, used here for RN Attendance.
 * Based on the /api/RegisteredNurseAttendance response entries.
 */
export interface Encounter {
  resourceType: 'Encounter';
  id: string; // e.g., "RN-12345"
  identifier?: Identifier[];
  status: 'planned' | 'arrived' | 'triaged' | 'in-progress' | 'onleave' | 'finished' | 'cancelled' | 'entered-in-error' | 'unknown';
  class?: Coding;
  subject?: Reference; // e.g., HealthcareService/SVC-54321
  performer?: EncounterPerformer[]; // Based on example
  period?: EncounterPeriod;
  reasonCode?: EncounterReason[]; // Based on example
  serviceProvider?: Reference;
}

// Specific Bundle type for RN Attendance response
export type RNAttendanceBundle = Bundle<Encounter>;

export interface Provider {
  id: string;
  resourceType: string;
  name: string;
  // Add other fields as needed based on the actual response structure
  // identifier?: { system: string; value: string }[];
  // active?: boolean;
  // type?: { coding?: { system: string; code: string; display: string }[]; text?: string }[];
  // telecom?: { system: string; value: string; use: string }[];
  // address?: { use: string; type: string; line: string[]; city: string; state: string; postalCode: string; country: string }[];
}
