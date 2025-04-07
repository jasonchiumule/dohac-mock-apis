// dohac-mock-apis/frontend2/src/lib/api.ts

// Import types from the schema file
import type {
  Organization,
  HealthcareService,
  Questionnaire,
  // QuestionnaireResponse, // Added for potential POST later, not strictly needed for GETs
  RNAttendanceBundle,
  // No need to import Bundle, Encounter etc. directly if only using RNAttendanceBundle
} from './schema';

// --- Authentication ---
const MOCK_ACCESS_TOKEN = "mock_c88484a9-6cb3-4ad0-b9bd-5563567175ee_20230720151152";
const API_BASE_URL = "/api"; // Adjust if your Go server prefixes differently

// --- Helper for Headers ---
const getAuthHeaders = () => {
  const transactionId = `trans-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`; // More unique ID
  return {
    'Authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
    'transaction_id': transactionId,
    'Accept': 'application/json',
    'Content-Type': 'application/json', // Good practice for GET, required for POST
  };
};

// --- API Fetch Functions ---

/**
 * Fetches the list of providers (Organizations).
 */
export async function fetchProviders(): Promise<Organization[]> {
  const url = `${API_BASE_URL}/Provider`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    const data: Organization[] = await response.json();
    console.log("Fetched Providers:", data); // Log fetched data
    return data;
  } catch (error) {
    console.error("Error fetching providers:", error);
    throw error;
  }
}

/**
 * Fetches the list of healthcare services for a given organization.
 * @param organizationId - The ID of the organization (e.g., "PRV-12345")
 */
export async function fetchHealthcareServices(organizationId: string): Promise<HealthcareService[]> {
  const url = `${API_BASE_URL}/HealthcareService?organization=${encodeURIComponent(organizationId)}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    const data: HealthcareService[] = await response.json();
    console.log(`Fetched Services for ${organizationId}:`, data); // Log fetched data
    return data;
  } catch (error) {
    console.error(`Error fetching healthcare services for ${organizationId}:`, error);
    throw error;
  }
}

/**
 * Fetches the list of available questionnaires.
 */
export async function fetchQuestionnaires(): Promise<Questionnaire[]> {
  const url = `${API_BASE_URL}/Questionnaire`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    const data: Questionnaire[] = await response.json();
    console.log("Fetched Questionnaires:", data); // Log fetched data
    return data;
  } catch (error) {
    console.error("Error fetching questionnaires:", error);
    throw error;
  }
}

/**
 * Fetches Registered Nurse attendance records for a specific service.
 * @param serviceId - The ID of the healthcare service (e.g., "SVC-54321")
 * @param summary - Whether to fetch summary data (defaults to true based on example)
 */
export async function fetchRNAttendance(serviceId: string, summary: boolean = true): Promise<RNAttendanceBundle> {
  const url = `${API_BASE_URL}/RegisteredNurseAttendance?service=${encodeURIComponent(serviceId)}&summary=${summary}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    // Assuming the response is the Bundle structure
    const data: RNAttendanceBundle = await response.json();
    console.log(`Fetched RN Attendance for ${serviceId}:`, data); // Log fetched data
    return data;
  } catch (error) {
    console.error(`Error fetching RN attendance for ${serviceId}:`, error);
    throw error;
  }
}

// --- Potential Future Function (Example) ---
/*
export async function postQuestionnaireResponse(responsePayload: QuestionnaireResponse): Promise<QuestionnaireResponse> {
    const url = `${API_BASE_URL}/QuestionnaireResponse`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(responsePayload),
      });
      if (!response.ok) {
         // Consider checking for 201 Created as well
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      // Depending on what the server returns on POST (e.g., the created object or just status)
      const data: QuestionnaireResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error posting questionnaire response:", error);
      throw error;
    }
}
*/
