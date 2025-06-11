import type {
  Organization,
  HealthcareService,
  Questionnaire,
  QuestionnaireResponse,
  RNAttendanceBundle,
  Encounter,
  EncounterPatchPayload,
} from './schema';

// --- Authentication ---
const MOCK_ACCESS_TOKEN = "mock_c88484a9-6cb3-4ad0-b9bd-5563567175ee_20230720151152";
// REMOVED: const API_BASE_URL = "/api"; Base URL will be passed as a parameter

// --- Helper for Headers ---
const getAuthHeaders = (includeContentTypeJson = true) => {
  const transactionId = `trans-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`; // More unique ID
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
    'transaction_id': transactionId,
    'Accept': 'application/json',
  };
  if (includeContentTypeJson) {
    headers['Content-Type'] = 'application/json'; // Ensure this is set for POST/PATCH with JSON
  }
  return headers;
};

// --- API Fetch Functions ---

/**
 * Fetches the list of providers (Organizations).
 * @param baseUrl - The base URL for the API endpoint. Defaults to "/api".
 */
export async function fetchProviders(baseUrl: string = "/api"): Promise<Organization[]> {
  const url = `${baseUrl}/Provider`; // Use baseUrl parameter
  console.log(`Fetching Providers from: ${url}`);
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
 * @param baseUrl - The base URL for the API endpoint. Defaults to "/api".
 */
export async function fetchHealthcareServices(organizationId: string, baseUrl: string = "/api"): Promise<HealthcareService[]> {
  const url = `${baseUrl}/HealthcareService?organization=${encodeURIComponent(organizationId)}`; // Use baseUrl parameter
  console.log(`Fetching HealthcareServices from: ${url}`);
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
 * @param baseUrl - The base URL for the API endpoint. Defaults to "/api".
 */
export async function fetchQuestionnaires(baseUrl: string = "/api"): Promise<Questionnaire[]> {
  const url = `${baseUrl}/Questionnaire`; // Use baseUrl parameter
  console.log(`Fetching Questionnaires from: ${url}`);
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
 * @param baseUrl - The base URL for the API endpoint. Defaults to "/api".
 */
export async function fetchRNAttendance(serviceId: string, summary: boolean = true, baseUrl: string = "/api"): Promise<RNAttendanceBundle> {
  const url = `${baseUrl}/RegisteredNurseAttendance?service=${encodeURIComponent(serviceId)}&summary=${summary}`; // Use baseUrl parameter
  console.log(`Fetching RN Attendance from: ${url}`);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText} - ${errorBody}`);
    }
    const data: RNAttendanceBundle = await response.json();
    console.log(`Fetched RN Attendance for ${serviceId}:`, data); // Log fetched data
    return data;
  } catch (error) {
    console.error(`Error fetching RN attendance for ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Posts a QuestionnaireResponse to the mock API.
 * @param responsePayload - The QuestionnaireResponse object to submit.
 * @param baseUrl - The base URL for the API endpoint. Defaults to "/api".
 */
export async function postQuestionnaireResponse(responsePayload: QuestionnaireResponse, baseUrl: string = "/api"): Promise<any> { // Return type might be the created resource or just status confirmation
  const url = `${baseUrl}/QuestionnaireResponse`; // Use baseUrl parameter
  console.log(`Posting Questionnaire Response to: ${url}`);
  console.log("Payload:", JSON.stringify(responsePayload, null, 2)); // Log payload
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(true), // Explicitly include Content-Type for JSON
      body: JSON.stringify(responsePayload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Response Body:", errorBody);
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}. ${errorBody}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      // Check if body has content before trying to parse
      const textBody = await response.text();
      if (textBody) {
        try {
          const data = JSON.parse(textBody);
          console.log("Posted Questionnaire Response Result:", data);
          return data;
        } catch (parseError) {
          console.error("Failed to parse JSON response body:", parseError);
          // Decide how to handle - maybe return success status as below, or throw specific error
          return { success: true, status: response.status, message: "Received non-empty, non-JSON response", body: textBody };
        }
      } else {
        console.log(`Posted Questionnaire Response successfully (Status: ${response.status}, Empty JSON body).`);
        return { success: true, status: response.status, message: "Empty JSON body" };
      }
    } else {
      // Handle non-JSON responses (e.g., plain text, or empty body with status 201/204)
      const responseBody = await response.text(); // Read text body even if not JSON
      console.log(`Posted Questionnaire Response successfully (Status: ${response.status}, Content-Type: ${contentType || 'N/A'}). Response body:`, responseBody || '(empty)');
      return { success: true, status: response.status, body: responseBody }; // Return success indicator and potentially the body
    }
  } catch (error) {
    console.error("Error posting questionnaire response:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to post questionnaire response: ${errorMessage}`);
  }
}

/**
 * Updates (Patches) a specific Registered Nurse attendance record (Encounter).
 * @param recordId - The ID of the Encounter record to update (e.g., "RN-12345")
 * @param patchPayload - The payload containing the fields to update.
 * @param baseUrl - The base URL for the API endpoint. Defaults to "/api".
 */
export async function patchNurseAttendance(recordId: string, patchPayload: EncounterPatchPayload, baseUrl: string = "/api"): Promise<Encounter> {
  const url = `${baseUrl}/RegisteredNurseAttendance/${encodeURIComponent(recordId)}`;
  console.log(`Patching RN Attendance record ${recordId} with JSON at: ${url}`);
  console.log("Payload:", JSON.stringify(patchPayload, null, 2));

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getAuthHeaders(true), // Set Content-Type to application/json
      body: JSON.stringify(patchPayload), // Send JSON string directly
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Response Body:", errorBody);
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}. ${errorBody}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const textBody = await response.text();
      if (textBody) {
        try {
          const data: Encounter = JSON.parse(textBody);
          console.log(`Patched RN Attendance record ${recordId} Result:`, data);
          return data;
        } catch (parseError) {
          console.error("Failed to parse JSON response body for PATCH:", parseError);
          throw new Error("API did not return valid JSON as expected after successful PATCH.");
        }
      } else {
        console.warn(`Patched RN Attendance successfully (Status: ${response.status}), but response body was empty.`);
        throw new Error("API returned an empty body after successful PATCH.");
      }

    } else {
      console.warn(`Patched RN Attendance successfully (Status: ${response.status}), but response body was not JSON or was empty. Content-Type: ${contentType}`);
      throw new Error("API did not return JSON as expected after successful PATCH.");
    }
  } catch (error) {
    console.error(`Error patching RN attendance record ${recordId}:`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to patch RN attendance record: ${errorMessage}`);
  }
}

/**
 * Updates (Patches) a specific Registered Nurse attendance record (Encounter) using a CSV file.
 * @param recordId - The ID of the Encounter record to update (e.g., "Sub-123-456")
 * @param csvFile - The CSV file to upload.
 * @param baseUrl - The base URL for the API endpoint. Defaults to "/api".
 */
export async function patchNurseAttendanceWithCsv(recordId: string, csvFile: File, baseUrl: string = "/api"): Promise<Encounter> {
  const url = `${baseUrl}/RegisteredNurseAttendance/${encodeURIComponent(recordId)}`;
  console.log(`Patching RN Attendance record ${recordId} with CSV file at: ${url}`);
  console.log("File:", csvFile.name, "Type:", csvFile.type, "Size:", csvFile.size);

  const formData = new FormData();
  formData.append('csv', csvFile);

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getAuthHeaders(false), // Do NOT include Content-Type for FormData
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Response Body:", errorBody);
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}. ${errorBody}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const textBody = await response.text();
      if (textBody) {
        try {
          const data: Encounter = JSON.parse(textBody);
          console.log(`Patched RN Attendance record ${recordId} with CSV Result:`, data);
          return data;
        } catch (parseError) {
          console.error("Failed to parse JSON response body for CSV PATCH:", parseError);
          throw new Error("API did not return valid JSON as expected after successful CSV PATCH.");
        }
      } else {
        console.warn(`Patched RN Attendance with CSV successfully (Status: ${response.status}), but response body was empty.`);
        throw new Error("API returned an empty body after successful CSV PATCH.");
      }
    } else {
      console.warn(`Patched RN Attendance with CSV successfully (Status: ${response.status}), but response body was not JSON or was empty. Content-Type: ${contentType}`);
      throw new Error("API did not return JSON as expected after successful CSV PATCH.");
    }
  } catch (error) {
    console.error(`Error patching RN attendance record ${recordId} with CSV:`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to patch RN attendance record with CSV: ${errorMessage}`);
  }
}