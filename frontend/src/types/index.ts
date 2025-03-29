// Auth API Types
export interface AuthClient {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  name: string;
  contacts: string[];
  scopes: string[];
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
