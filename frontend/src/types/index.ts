// Auth API Types
export interface AuthClient {
  clientId: string;
  clientSecret: string;
  name: string;
  softwareId: string;
  softwareVersion: string;
  redirectUris: string[];
}

export interface AuthToken {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
}

// Provider API Types
export interface Provider {
  providerId: string;
  name: string;
  services: HealthcareService[];
}

export interface HealthcareService {
  serviceId: string;
  name: string;
  type: string;
  providerId?: string; // Reference to the provider
  address: Address;
  contact: Contact;
}

export interface Address {
  line1: string;
  line2?: string;
  suburb: string;
  state: string;
  postcode: string;
}

export interface Contact {
  phone: string;
  email: string;
}

// Quality Indicators API Types
export interface QualityIndicator {
  serviceId: string;
  reportingPeriod: {
    quarter: number;
    year: number;
  };
  submissionDate: string;
  indicators: {
    pressureInjuries: IndicatorData;
    physicalRestraint: IndicatorData;
    unplannedWeightLoss: IndicatorData;
    fallsMajorInjury: IndicatorData;
    medicationManagement: IndicatorData;
  };
}

export interface IndicatorData {
  value: number;
  nationalAverage: number;
  target: number;
}

// Quality Questionnaire API Types (from API)
export interface Questionnaire {
  resourceType: string;
  id: string;
  name: string;
  title: string;
  status: string;
  subject: {
    reference: string;
  };
  date: string;
  publisher: string;
  description: string;
  item: QuestionnaireItemGroup[];
}

export interface QuestionnaireItemGroup {
  linkId: string;
  text: string;
  type: string;
  required: boolean;
  item: QuestionnaireItem[];
}

export interface QuestionnaireItem {
  linkId: string;
  text: string;
  type: string;
  required: boolean;
}

export interface QuestionnaireResponse {
  questionnaire: string;
  status: string;
  subject: {
    reference: string;
    display: string;
  };
  author: {
    reference: string;
    display: string;
  };
  item: QuestionnaireResponseItemGroup[];
}

export interface QuestionnaireResponseItemGroup {
  linkId: string;
  text: string;
  item: QuestionnaireResponseItem[];
}

export interface QuestionnaireResponseItem {
  linkId: string;
  text: string;
  answer: Array<{
    valueInteger?: number;
    valueString?: string;
  }>;
}

// Registered Nurses API Types
export interface NurseAttendanceRecord {
  serviceId: string;
  date: string;
  shifts: NurseShift[];
}

export interface NurseShift {
  shiftId: string;
  startTime: string;
  endTime: string;
  registeredNurses: number;
  residents: number;
  minutesPerResident: number;
}

export interface NurseAttendanceSummary {
  serviceId: string;
  period: {
    startDate: string;
    endDate: string;
  };
  totalMinutesPerResident: number;
  totalShifts: number;
  complianceStatus: boolean;
}

// Dashboard-specific types
export interface ComplianceStatus {
  status: 'compliant' | 'at-risk' | 'non-compliant';
  percentage: number;
}

export interface ServiceCompliance {
  service: HealthcareService;
  qualityStatus: ComplianceStatus;
  nurseStatus: ComplianceStatus;
  reportingStatus: {
    lastReported: string;
    nextDue: string;
    daysRemaining: number;
  };
}

export interface QualityTrend {
  period: string;
  pressureInjuries: number;
  physicalRestraint: number;
  unplannedWeightLoss: number;
  fallsMajorInjury: number;
  medicationManagement: number;
}

export interface StaffingImpact {
  period: string;
  nurseMinutes: number;
  qualityScore: number;
}
