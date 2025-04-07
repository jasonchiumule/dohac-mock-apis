// Import types from the schema file
import type {
  Organization,
  HealthcareService,
  Questionnaire,
  QuestionnaireResponse, // <-- Add this import
  RNAttendanceBundle,
  Encounter, // <-- Import Encounter if needed for return type of PATCH
  EncounterPatchPayload, // <-- Import the new patch payload type
  // No need to import Bundle, Encounter etc. directly if only using RNAttendanceBundle
} from './schema';

// --- Authentication ---
const MOCK_ACCESS_TOKEN = "mock_c88484a9-6cb3-4ad0-b9bd-5563567175ee_20230720151152";
// Ensure your Vite proxy is set up correctly if running dev server on different port than Go backend
const API_BASE_URL = "/api"; // Assumes proxy is set up or running on same origin

// --- Helper for Headers ---
const getAuthHeaders = () => {
  const transactionId = `trans-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`; // More unique ID
  return {
    'Authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
    'transaction_id': transactionId,
    'Accept': 'application/json',
    'Content-Type': 'application/json', // Ensure this is set for POST
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
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText} - ${errorBody}`);
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
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText} - ${errorBody}`);
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
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText} - ${errorBody}`);
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
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText} - ${errorBody}`);
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


// --- NEW FUNCTION ---
/**
 * Posts a QuestionnaireResponse to the mock API.
 * @param responsePayload - The QuestionnaireResponse object to submit.
 */
export async function postQuestionnaireResponse(responsePayload: QuestionnaireResponse): Promise<any> { // Return type might be the created resource or just status confirmation
  const url = `${API_BASE_URL}/QuestionnaireResponse`;
  console.log("Posting Questionnaire Response:", JSON.stringify(responsePayload, null, 2)); // Log payload
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(), // Content-Type is already application/json here
      body: JSON.stringify(responsePayload),
    });

    // Check if the response is successful (200 OK or 201 Created)
    if (!response.ok) {
      const errorBody = await response.text(); // Try to get error details from the body
      console.error("API Error Response Body:", errorBody);
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}. ${errorBody}`);
    }

    // Try parsing JSON, but handle cases where the body might be empty (e.g., on a 201 Created with no content)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      console.log("Posted Questionnaire Response Result:", data);
      return data; // Return the parsed JSON data (likely the created/updated resource)
    } else {
      console.log(`Posted Questionnaire Response successfully (Status: ${response.status}, No JSON body in response).`);
      return { success: true, status: response.status }; // Return success indicator if no JSON
    }
  } catch (error) {
    console.error("Error posting questionnaire response:", error);
    // Check if it's an Error object before accessing message
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to post questionnaire response: ${errorMessage}`); // Re-throw a more specific error
  }
}
// --- End of NEW FUNCTION ---

// --- NEW FUNCTION for PATCH ---
/**
 * Updates (Patches) a specific Registered Nurse attendance record (Encounter).
 * @param recordId - The ID of the Encounter record to update (e.g., "RN-12345")
 * @param patchPayload - The payload containing the fields to update.
 */
export async function patchNurseAttendance(recordId: string, patchPayload: EncounterPatchPayload): Promise<Encounter> {
  const url = `${API_BASE_URL}/RegisteredNurseAttendance/${encodeURIComponent(recordId)}`;
  console.log(`Patching RN Attendance record ${recordId}:`, JSON.stringify(patchPayload, null, 2));
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getAuthHeaders(), // Content-Type is needed for PATCH
      body: JSON.stringify(patchPayload),
    });

    // Check if the response is successful (typically 200 OK for PATCH)
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Response Body:", errorBody);
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}. ${errorBody}`);
    }

    // Assuming PATCH returns the updated Encounter resource
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data: Encounter = await response.json();
      console.log(`Patched RN Attendance record ${recordId} Result:`, data);
      return data; // Return the updated resource
    } else {
      console.warn(`Patched RN Attendance successfully (Status: ${response.status}), but response body was not JSON or was empty.`);
      throw new Error("API did not return JSON as expected after successful PATCH.");
    }
  } catch (error) {
    console.error(`Error patching RN attendance record ${recordId}:`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to patch RN attendance record: ${errorMessage}`); // Re-throw a more specific error
  }
}
