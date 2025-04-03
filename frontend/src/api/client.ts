import { AuthClient, AuthToken, HealthcareService, NurseAttendanceRecord, NurseAttendanceSummary, Provider, Questionnaire, QuestionnaireResponse } from '../types';
import { config, BACKENDS } from '@/config';

// --- START: Define API Response Interfaces (or import them) ---
interface ApiProviderData {
  id: string;
  name: string;
}

interface ApiTelecom {
  system: 'phone' | 'email' | string;
  value: string;
}

interface ApiAddress {
  line?: string[];
  city?: string;
  state?: string;
  postalCode?: string;
}

interface ApiCodeableConcept {
  text?: string;
}

interface ApiReference {
  reference?: string;
}

interface ApiServiceData {
  id: string;
  name: string;
  type?: ApiCodeableConcept[];
  providedBy?: ApiReference;
  address?: ApiAddress[];
  telecom?: ApiTelecom[];
}

interface ApiNurseAttendanceResource {
  id: string;
  subject?: ApiReference;
  period?: {
    start?: string;
    end?: string;
  };
  performer?: unknown[];
}

interface ApiBundleEntry {
  resource?: ApiNurseAttendanceResource;
}

interface ApiNurseAttendanceBundle {
  entry?: ApiBundleEntry[];
}

// Extended interface to handle both bundle and summary formats
interface ApiNurseAttendanceBundleOrSummary extends ApiNurseAttendanceBundle {
  serviceId?: string;
}

// // Using this in code but defining for completeness
// interface GroupedAttendanceRecord {
//   serviceId: string;
//   date: string;
//   shifts: {
//     shiftId: string;
//     startTime: string;
//     endTime: string;
//     registeredNurses: number;
//     residents: number;
//     minutesPerResident: number;
//   }[];
// }
// --- END: Define API Response Interfaces ---


class ApiClient {
  private token: string | null = null;
  private baseUrl: string = config.baseUrl;
  private transactionIdCounter = 0;
  private currentBackendId: string = "golang";

  private getTransactionId(): string {
    this.transactionIdCounter += 1;
    return `trans-${Date.now()}-${this.transactionIdCounter}`;
  }

  private isMockBackend(): boolean {
    return this.baseUrl === ""; // Mock backend has empty baseUrl
  }

  // private shouldMakeRealApiCalls(): boolean {
  //   return !this.isMockBackend() && this.currentBackendId === "golang";
  // }

  updateBackend(backendId: string) {
    if (BACKENDS[backendId]) {
      this.baseUrl = BACKENDS[backendId].baseUrl;
      this.currentBackendId = backendId;
      console.log(`Updated backend to ${backendId}: ${this.baseUrl}`);
    } else {
      console.error(`Backend ${backendId} not found`);
    }
  }

  async registerClient(client: Omit<AuthClient, 'clientId' | 'clientSecret'>): Promise<AuthClient> {
    console.log(`Registering client with backend: ${this.currentBackendId}`);

    // If mock backend, return mock data immediately
    if (this.isMockBackend()) {
      console.log("Using mock client registration");
      return this.mockRegisterClient(client);
    }

    try {
      const url = `${this.baseUrl}${config.endpoints.auth.registerClient}`;
      console.log(`Making API call to: ${url}`);

      const transactionId = this.getTransactionId();
      console.log(`Transaction ID: ${transactionId}`);

      const requestBody = {
        client_name: client.name,
        software_id: client.softwareId,
        software_version: client.softwareVersion,
        redirect_uris: client.redirectUris
      };

      console.log("Request payload:", requestBody);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'transaction_id': transactionId
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Registration error:", errorBody);
        throw new Error(`Failed to register client: ${response.status} ${response.statusText} - ${errorBody}`);
      }

      // Parse the response data
      const data = await response.json() as {
        client_id: string;
        client_id_issued_at?: number;
        client_name: string;
        software_id: string;
        software_version: string;
        redirect_uris: string[];
      };

      console.log("Registration successful:", data);

      return {
        clientId: data.client_id,
        clientSecret: 'your-secret', // In a real app, this would be provided separately or stored securely
        name: data.client_name,
        softwareId: data.software_id,
        softwareVersion: data.software_version,
        redirectUris: data.redirect_uris
      };
    } catch (error) {
      console.error("Client registration failed:", error);
      throw error;
    }
  }

  // Mock implementation for registration
  private mockRegisterClient(client: Omit<AuthClient, 'clientId' | 'clientSecret'>): Promise<AuthClient> {
    return Promise.resolve({
      clientId: `mock-client-${Date.now()}`,
      clientSecret: 'mock-secret',
      name: client.name,
      softwareId: client.softwareId,
      softwareVersion: client.softwareVersion,
      redirectUris: client.redirectUris
    });
  }

  async getToken(clientId: string, clientSecret: string): Promise<AuthToken> {
    console.log(`Getting token with backend: ${this.currentBackendId}`);

    // If mock backend, return mock data immediately
    if (this.isMockBackend()) {
      console.log("Using mock token response");
      return this.mockGetToken(clientId);
    }

    try {
      const url = `${this.baseUrl}${config.endpoints.auth.getToken}`;
      console.log(`Making token request to: ${url}`);

      const transactionId = this.getTransactionId();
      console.log(`Transaction ID: ${transactionId}`);

      const formData = new URLSearchParams();
      formData.append('grant_type', 'client_credentials');
      formData.append('client_id', clientId);
      formData.append('client_secret', clientSecret);
      formData.append('scope', 'dhac:b2g:all:all ACO:ABN:123');

      console.log("Token request body:", formData.toString());

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'transaction_id': transactionId
        },
        body: formData,
      });

      console.log(`Token response status: ${response.status}`);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Token error:", errorBody);
        throw new Error(`Failed to get token: ${response.status} ${response.statusText} - ${errorBody}`);
      }

      // Parse the response data
      const data = await response.json() as {
        access_token: string;
        token_type: string;
        expires_in: number;
        scope: string;
        refresh_token?: string;
      };

      console.log("Token request successful");

      const authToken = {
        accessToken: data.access_token,
        tokenType: data.token_type,
        expiresIn: data.expires_in,
        refreshToken: data.refresh_token || '', // Use optional chaining
        scope: data.scope
      };

      // Store the token for future requests
      this.token = authToken.accessToken;
      console.log("Token stored for future requests");

      return authToken;
    } catch (error) {
      console.error("Token request failed:", error);
      throw error;
    }
  }

  // Mock implementation for token generation
  private mockGetToken(clientId: string): Promise<AuthToken> {
    // Generate a mock token that includes the client ID and timestamp
    const mockToken = `mock_${clientId}_${Date.now()}`;
    this.token = mockToken; // Store the mock token for future requests

    return Promise.resolve({
      accessToken: mockToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
      refreshToken: '',
      scope: 'dhac:b2g:all:all ACO:ABN:123'
    });
  }

  async getProviders(): Promise<Provider[]> {
    this.ensureAuthenticated();

    // If mock backend, return mock data immediately
    if (this.isMockBackend()) {
      console.log("Using mock providers data");
      // Import the mock data from utils/mocks
      const { mockProviders } = await import('@/utils/mocks');
      return mockProviders;
    }

    try {
      const url = `${this.baseUrl}${config.endpoints.provider.getProviders}`;
      console.log(`Making providers request to: ${url}`);

      const transactionId = this.getTransactionId();
      console.log(`Transaction ID: ${transactionId}`);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'transaction_id': transactionId
        },
      });

      console.log(`Providers response status: ${response.status}`);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Providers error:", errorBody);
        throw new Error(`Failed to get providers: ${response.status} ${response.statusText} - ${errorBody}`);
      }

      // Parse the response data - matches the backend format described in docs
      const data = await response.json();
      console.log("Providers data received:", data);

      // Transform the data format to match frontend expectations
      return this.transformProvidersData(data);
    } catch (error) {
      console.error("Providers request failed:", error);
      throw error;
    }
  }

  // Transform the API's provider format to our frontend format
  private transformProvidersData(apiProviders: ApiProviderData[]): Provider[] {
    console.log("Transforming providers data");

    try {
      return apiProviders.map(apiProvider => {
        return {
          providerId: apiProvider.id, // FHIR ID field
          name: apiProvider.name,     // FHIR name field
          services: []  // Services are fetched separately
        };
      });
    } catch (error) {
      console.error("Error transforming providers data:", error);
      throw new Error(`Failed to transform providers data: ${error}`);
    }
  }

  async getServices(providerId?: string): Promise<HealthcareService[]> {
    this.ensureAuthenticated();

    // If mock backend, return mock data from a specific provider
    if (this.isMockBackend()) {
      console.log("Using mock services data");
      // Import the mock data
      const { mockProviders } = await import('@/utils/mocks');

      if (providerId) {
        // Find the specified provider and return its services
        const provider = mockProviders.find(p => p.providerId === providerId);
        return provider?.services || [];
      } else {
        // Return all services from all providers
        return mockProviders.flatMap(p => p.services);
      }
    }

    try {
      let url = `${this.baseUrl}${config.endpoints.provider.getServices}`;
      if (providerId) {
        url += `?organization=${providerId}`;
      }

      console.log(`Making services request to: ${url}`);

      const transactionId = this.getTransactionId();
      console.log(`Transaction ID: ${transactionId}`);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'transaction_id': transactionId
        },
      });

      console.log(`Services response status: ${response.status}`);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Services error:", errorBody);
        throw new Error(`Failed to get services: ${response.status} ${response.statusText} - ${errorBody}`);
      }

      // Parse the response data
      const data = await response.json();
      console.log("Services data received:", data);

      // Transform the data to match frontend expectations
      return this.transformServicesData(data);
    } catch (error) {
      console.error("Services request failed:", error);
      throw error;
    }
  }

  // Helper function for safe navigation and default value
  private safeGet<T>(getter: () => T, defaultValue: T): T {
    try {
      const value = getter();
      return value !== undefined && value !== null ? value : defaultValue;
    } catch (e) {
      console.error('safeGet error:', e);
      return defaultValue;
    }
  }

  // Transform the API's service format to our frontend format
  private transformServicesData(apiServices: ApiServiceData[]): HealthcareService[] {
    console.log("Transforming services data");

    try {
      return apiServices.map(apiService => {
        return {
          serviceId: apiService.id,
          name: apiService.name,
          type: this.safeGet(() => apiService.type?.[0]?.text || '', ''),
          providerId: this.safeGet(() => {
            const reference = apiService.providedBy?.reference;
            return reference ? reference.split('/')?.[1] : '';
          }, ''),
          address: {
            line1: this.safeGet(() => apiService.address?.[0]?.line?.[0] || '', ''),
            suburb: this.safeGet(() => apiService.address?.[0]?.city || '', ''),
            state: this.safeGet(() => apiService.address?.[0]?.state || '', ''),
            postcode: this.safeGet(() => apiService.address?.[0]?.postalCode || '', '')
          },
          contact: {
            phone: this.safeGet(() => {
              const telecom = apiService.telecom || [];
              const phone = telecom.find((t: ApiTelecom) => t.system === 'phone');
              return phone?.value || '';
            }, ''),
            email: this.safeGet(() => {
              const telecom = apiService.telecom || [];
              const email = telecom.find((t: ApiTelecom) => t.system === 'email');
              return email?.value || '';
            }, '')
          }
        };
      });
    } catch (error) {
      console.error("Error transforming services data:", error);
      throw new Error(`Failed to transform services data: ${error}`);
    }
  }

  async getQuestionnaire(): Promise<Questionnaire[]> {
    this.ensureAuthenticated();

    // If mock backend, use mock data
    if (this.isMockBackend()) {
      console.log("Using mock questionnaire data");

      // Return a mock questionnaire - hardcoded to avoid adding complexity
      return Promise.resolve([{
        resourceType: "Questionnaire",
        id: "QC-20230630",
        name: "quality-indicators-q4-2022-23",
        title: "Quality Indicators Q4 2022-23",
        status: "active",
        subject: {
          reference: ""
        },
        date: "2023-06-30",
        publisher: "Department of Health and Aged Care",
        description: "Quality indicators questionnaire for Q4 2022-23",
        item: [
          {
            linkId: "pressure-injuries",
            text: "Pressure Injuries",
            type: "group",
            required: true,
            item: [
              {
                linkId: "PI-01",
                text: "Number of residents who have developed pressure injuries",
                type: "integer",
                required: true
              }
            ]
          },
          {
            linkId: "physical-restraint",
            text: "Physical Restraint",
            type: "group",
            required: true,
            item: [
              {
                linkId: "PR-01",
                text: "Number of residents who were physically restrained",
                type: "integer",
                required: true
              }
            ]
          }
        ]
      }]);
    }

    try {
      const url = `${this.baseUrl}${config.endpoints.quality.getQualityIndicators}`;
      console.log(`Making questionnaire request to: ${url}`);

      const transactionId = this.getTransactionId();
      console.log(`Transaction ID: ${transactionId}`);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'transaction_id': transactionId
        },
      });

      console.log(`Questionnaire response status: ${response.status}`);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Questionnaire error:", errorBody);
        throw new Error(`Failed to get questionnaire: ${response.status} ${response.statusText} - ${errorBody}`);
      }

      // Parse the response data
      const data = await response.json();
      console.log("Questionnaire data received:", data);

      return data;
    } catch (error) {
      console.error("Questionnaire request failed:", error);
      throw error;
    }
  }

  async submitQuestionnaireResponse(responseData: QuestionnaireResponse): Promise<QuestionnaireResponse> {
    this.ensureAuthenticated();

    // If mock backend, return mock response
    if (this.isMockBackend()) {
      console.log("Using mock questionnaire submission");

      // Return a successful mock response with the same data plus an ID
      return Promise.resolve({
        ...responseData,
        id: `response-${Date.now()}` // Add a mock ID
      });
    }

    try {
      const url = `${this.baseUrl}${config.endpoints.quality.submitQualityIndicators}`;
      console.log(`Submitting questionnaire response to: ${url}`);

      const transactionId = this.getTransactionId();
      console.log(`Transaction ID: ${transactionId}`);
      console.log("Request body:", responseData);

      const apiResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          'transaction_id': transactionId
        },
        body: JSON.stringify(responseData),
      });

      console.log(`Questionnaire submission status: ${apiResponse.status}`);

      if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        console.error("Questionnaire submission error:", errorBody);
        throw new Error(`Failed to submit questionnaire response: ${apiResponse.status} ${apiResponse.statusText} - ${errorBody}`);
      }

      // Parse the response data
      const data = await apiResponse.json();
      console.log("Questionnaire submission successful:", data);

      return data;
    } catch (error) {
      console.error("Questionnaire submission failed:", error);
      throw error;
    }
  }

  async getNurseAttendance(serviceId: string, summary: boolean = false): Promise<ApiNurseAttendanceBundleOrSummary | NurseAttendanceSummary> {
    this.ensureAuthenticated();

    // If mock backend, return mock data
    if (this.isMockBackend()) {
      console.log("Using mock nurse attendance data");

      if (summary) {
        // Return mock summary data
        const { mockNurseSummaries } = await import('@/utils/mocks');
        return mockNurseSummaries[serviceId] || null;
      } else {
        // Return mock attendance records
        const { mockNurseAttendance } = await import('@/utils/mocks');
        return { entry: this.createMockBundle(mockNurseAttendance[serviceId] || []) };
      }
    }

    try {
      let url = `${this.baseUrl}${config.endpoints.nurses.getNurseAttendance}?service=${serviceId}`;
      if (summary) {
        url += '&summary=true';
      }

      console.log(`Making nurse attendance request to: ${url}`);

      const transactionId = this.getTransactionId();
      console.log(`Transaction ID: ${transactionId}`);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'transaction_id': transactionId
        },
      });

      console.log(`Nurse attendance response status: ${response.status}`);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Nurse attendance error:", errorBody);
        throw new Error(`Failed to get nurse attendance: ${response.status} ${response.statusText} - ${errorBody}`);
      }

      // Parse the response data
      const data = await response.json();
      console.log("Nurse attendance data received:", data);

      return data;
    } catch (error) {
      console.error("Nurse attendance request failed:", error);
      throw error;
    }
  }

  // Helper to create a mock bundle structure for testing
  private createMockBundle(records: NurseAttendanceRecord[]): ApiBundleEntry[] {
    // Convert NurseAttendanceRecord[] to a FHIR-like bundle format
    return records.flatMap(record =>
      record.shifts.map(shift => ({
        resource: {
          id: shift.shiftId,
          subject: { reference: `HealthcareService/${record.serviceId}` },
          period: {
            start: `${record.date}T${shift.startTime}:00Z`,
            end: shift.endTime ? `${record.date}T${shift.endTime}:00Z` : undefined
          },
          performer: Array(shift.registeredNurses).fill({ reference: "Practitioner/mock" })
        }
      }))
    );
  }

  transformNurseAttendanceData(apiData: ApiNurseAttendanceBundleOrSummary): NurseAttendanceRecord[] {
    // Handle summary data case
    if (!apiData.entry && apiData.serviceId) {
      // This is already a summary, not a bundle
      return [];
    }

    console.log("Transforming nurse attendance data");

    try {
      // Use optional chaining and provide a default empty array if entry is missing
      const entries = apiData?.entry ?? [];

      // Group entries by service and date
      const recordsByDateAndService: Record<string, NurseAttendanceRecord> = {};

      entries.forEach((entry: ApiBundleEntry) => {
        const resource = entry?.resource;

        // Skip if resource is missing or doesn't have necessary fields
        if (!resource || !resource.id || !resource.subject?.reference || !resource.period?.start) {
          console.warn('Skipping invalid nurse attendance entry:', entry);
          return;
        }

        // Extract serviceId from reference (e.g., "HealthcareService/SVC-54321")
        const serviceId = this.safeGet(() => {
          const reference = resource.subject?.reference;
          return reference ? reference.split('/')?.[1] : '';
        }, '');

        // Extract date from ISO timestamp
        const date = this.safeGet(() => {
          return resource.period?.start?.split('T')?.[0] || '';
        }, '');

        const key = `${serviceId}-${date}`;

        if (!serviceId || !date) {
          console.warn('Could not determine serviceId or date for entry:', entry);
          return; // Skip if key parts are missing
        }

        // Initialize if key doesn't exist
        if (!recordsByDateAndService[key]) {
          recordsByDateAndService[key] = {
            serviceId,
            date,
            shifts: []
          };
        }

        // Calculate minutes per resident based on shift duration
        const startTime = new Date(resource.period.start);
        const endTime = resource.period.end ? new Date(resource.period.end) : new Date(startTime);
        endTime.setHours(endTime.getHours() + (resource.period.end ? 0 : 8)); // Default 8-hour shift if no end time

        const shiftDurationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
        const nurseCount = resource.performer?.length || 0;

        // Estimate resident count - in a real app, this would come from the API
        // Using 60 as a placeholder (standard size for an aged care facility)
        const residentCount = 60;

        // Calculate minutes per resident (nursing time * nurses / resident count)
        const minutesPerResident = residentCount > 0
          ? Math.round((shiftDurationMinutes * nurseCount) / residentCount)
          : 0;

        // Extract time components for display
        const startTimeStr = startTime.toTimeString().substring(0, 5);
        const endTimeStr = endTime.toTimeString().substring(0, 5);

        // Add shift to the grouped record
        recordsByDateAndService[key].shifts.push({
          shiftId: resource.id,
          startTime: startTimeStr,
          endTime: endTimeStr,
          registeredNurses: nurseCount,
          residents: residentCount,
          minutesPerResident: minutesPerResident
        });
      });

      // Return the grouped records as an array
      return Object.values(recordsByDateAndService);
    } catch (error) {
      console.error("Error transforming nurse attendance data:", error);
      throw new Error(`Failed to transform nurse attendance data: ${error}`);
    }
  }

  async getNurseAttendanceSummary(serviceId: string): Promise<NurseAttendanceSummary> {
    // If mock backend, return mock data
    if (this.isMockBackend()) {
      console.log("Using mock nurse summary data");
      const { mockNurseSummaries } = await import('@/utils/mocks');
      return mockNurseSummaries[serviceId] || this.createDefaultSummary(serviceId);
    }

    try {
      // Fetch data with summary flag
      const attendanceData = await this.getNurseAttendance(serviceId, true);

      if (!attendanceData) {
        return this.createDefaultSummary(serviceId);
      }

      console.log("Processing nurse attendance summary:", attendanceData);

      // If we got a FHIR bundle, process it
      if ('entry' in attendanceData) {
        return this.processBundleForSummary(attendanceData, serviceId);
      }

      // If we got a summary object directly (not a bundle), process it
      if ('serviceId' in attendanceData && attendanceData.serviceId === serviceId) {
        return attendanceData as NurseAttendanceSummary;
      }

      // Fallback to a default summary
      return this.createDefaultSummary(serviceId);
    } catch (error) {
      console.error("Nurse summary request failed:", error);
      throw error;
    }
  }

  // Create a default summary when no data is available
  private createDefaultSummary(serviceId: string): NurseAttendanceSummary {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return {
      serviceId,
      period: {
        startDate: thirtyDaysAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      },
      totalMinutesPerResident: 0,
      totalShifts: 0,
      complianceStatus: false
    };
  }

  // Process a FHIR bundle to create a summary
  private processBundleForSummary(bundle: ApiNurseAttendanceBundleOrSummary, serviceId: string): NurseAttendanceSummary {
    const entries = bundle.entry || [];

    // Extract dates to determine period
    const dates = entries
      .map((entry: ApiBundleEntry) => entry.resource?.period?.start)
      .filter((date): date is string => !!date) // Type guard to ensure non-null
      .map((date: string) => date.split('T')[0]);

    const startDate = dates.length > 0
      ? new Date(Math.min(...dates.map((d: string) => new Date(d).getTime())))
      : new Date();

    const endDate = dates.length > 0
      ? new Date(Math.max(...dates.map((d: string) => new Date(d).getTime())))
      : new Date();

    const totalShifts = entries.length;

    // Calculate total nurse minutes
    let totalNurseMinutes = 0;
    let totalResidentCount = 0;

    entries.forEach((entry: ApiBundleEntry) => {
      const resource = entry.resource;
      if (!resource || !resource.period || !resource.period.start) return;

      const start = new Date(resource.period.start);
      const end = resource.period.end ? new Date(resource.period.end) : new Date(start);
      end.setHours(end.getHours() + (resource.period.end ? 0 : 8)); // Default 8-hour shift

      const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      const nurseCount = resource.performer?.length || 0;
      totalNurseMinutes += durationMinutes * nurseCount;

      // Standard facility size estimate
      totalResidentCount += 60;
    });

    // Rest of the function remains the same
    const avgMinutesPerResident = totalResidentCount > 0
      ? Math.round(totalNurseMinutes / totalResidentCount)
      : 0;

    const isCompliant = avgMinutesPerResident >= 35;

    return {
      serviceId,
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      },
      totalMinutesPerResident: avgMinutesPerResident,
      totalShifts,
      complianceStatus: isCompliant
    };
  }

  private ensureAuthenticated() {
    if (!this.token) {
      console.warn("No authentication token found. Using mock token for demo purposes.");

      // Generate a mock token that can be recognized by the backend
      const mockToken = "mock_c88484a9-6cb3-4ad0-b9bd-5563567175ee_20230720151152";

      this.token = mockToken;
      console.log(`Set mock token: ${mockToken.substring(0, 15)}...`);
    }
  }

  setToken(token: string) {
    console.log(`Setting token: ${token.substring(0, 15)}...`);
    this.token = token;
  }

  getTokenStatus(): { isAuthenticated: boolean, tokenPreview: string | null } {
    return {
      isAuthenticated: !!this.token,
      tokenPreview: this.token ? `${this.token.substring(0, 15)}...` : null
    };
  }
}

export const apiClient = new ApiClient();
