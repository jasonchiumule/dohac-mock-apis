import { AuthClient, AuthToken, HealthcareService, NurseAttendanceRecord, NurseAttendanceSummary, Provider, QualityIndicator } from '../types';

const API_BASE_URL = 'http://localhost:8080';

class ApiClient {
  private token: string | null = null;

  // Auth API methods
  async registerClient(client: Omit<AuthClient, 'clientId' | 'clientSecret'>): Promise<AuthClient> {
    const response = await fetch(`${API_BASE_URL}/auth/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client),
    });

    if (!response.ok) {
      throw new Error(`Failed to register client: ${response.statusText}`);
    }

    return response.json();
  }

  async getToken(clientId: string, clientSecret: string): Promise<AuthToken> {
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'provider.read quality.read nurses.read',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.statusText}`);
    }

    const authToken = await response.json();
    this.token = authToken.accessToken;
    return authToken;
  }

  // Provider API methods
  async getProviders(): Promise<Provider[]> {
    this.ensureAuthenticated();

    const response = await fetch(`${API_BASE_URL}/provider`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get providers: ${response.statusText}`);
    }

    return response.json();
  }

  async getProviderById(providerId: string): Promise<Provider> {
    this.ensureAuthenticated();

    const response = await fetch(`${API_BASE_URL}/provider/${providerId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get provider: ${response.statusText}`);
    }

    return response.json();
  }

  async getServices(providerId: string): Promise<HealthcareService[]> {
    this.ensureAuthenticated();

    const response = await fetch(`${API_BASE_URL}/provider/${providerId}/services`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get services: ${response.statusText}`);
    }

    return response.json();
  }

  async getServiceById(providerId: string, serviceId: string): Promise<HealthcareService> {
    this.ensureAuthenticated();

    const response = await fetch(`${API_BASE_URL}/provider/${providerId}/services/${serviceId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get service: ${response.statusText}`);
    }

    return response.json();
  }

  // Quality Indicators API methods
  async getQualityIndicators(serviceId: string, quarter?: number, year?: number): Promise<QualityIndicator[]> {
    this.ensureAuthenticated();

    let url = `${API_BASE_URL}/quality/${serviceId}`;
    if (quarter && year) {
      url += `?quarter=${quarter}&year=${year}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get quality indicators: ${response.statusText}`);
    }

    return response.json();
  }

  async submitQualityIndicators(indicator: QualityIndicator): Promise<QualityIndicator> {
    this.ensureAuthenticated();

    const response = await fetch(`${API_BASE_URL}/quality/${indicator.serviceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify(indicator),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit quality indicators: ${response.statusText}`);
    }

    return response.json();
  }

  // Registered Nurses API methods
  async getNurseAttendance(serviceId: string, startDate?: string, endDate?: string): Promise<NurseAttendanceRecord[]> {
    this.ensureAuthenticated();

    let url = `${API_BASE_URL}/nurses/${serviceId}/records`;
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get nurse attendance: ${response.statusText}`);
    }

    return response.json();
  }

  async getNurseAttendanceSummary(serviceId: string, startDate: string, endDate: string): Promise<NurseAttendanceSummary> {
    this.ensureAuthenticated();

    const response = await fetch(`${API_BASE_URL}/nurses/${serviceId}/summary?start_date=${startDate}&end_date=${endDate}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get nurse attendance summary: ${response.statusText}`);
    }

    return response.json();
  }

  async submitNurseAttendance(record: NurseAttendanceRecord): Promise<NurseAttendanceRecord> {
    this.ensureAuthenticated();

    const response = await fetch(`${API_BASE_URL}/nurses/${record.serviceId}/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit nurse attendance: ${response.statusText}`);
    }

    return response.json();
  }

  private ensureAuthenticated() {
    if (!this.token) {
      throw new Error('Not authenticated. Please call getToken() first.');
    }
  }

  setToken(token: string) {
    this.token = token;
  }
}

export const apiClient = new ApiClient();
