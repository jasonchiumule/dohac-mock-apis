// dohac-mock-apis/frontend2/src/api.ts

// Define a basic type for the Provider based on the example response
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

// --- Authentication ---
// NOTE: In a real application, you would fetch this token dynamically
// after a proper authentication flow. For this mock example,
// we'll use the hardcoded token from the documentation.
const MOCK_ACCESS_TOKEN = "mock_c88484a9-6cb3-4ad0-b9bd-5563567175ee_20230720151152";

// Base URL for the API (relative path works since Go serves the SPA)
const API_BASE_URL = "/api"; // Adjust if your Go server prefixes differently

/**
 * Fetches the list of providers.
 */
export async function fetchProviders(): Promise<Provider[]> {
  const url = `${API_BASE_URL}/Provider`;
  const transactionId = `trans-${Date.now()}`; // Generate a unique ID

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        // Include the mock Authorization token
        'Authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
        // Include a transaction ID as shown in the examples
        'transaction_id': transactionId,
        // Indicate we expect JSON back
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Throw an error with status text if the response is not OK
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const data: Provider[] = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching providers:", error);
    // Re-throw the error so the component can catch it
    throw error;
  }
}
