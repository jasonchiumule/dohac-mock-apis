/**
 * API Configuration
 * 
 * This file contains configuration for connecting to different backend implementations.
 * Change the ACTIVE_BACKEND value to switch between different backend environments.
 */

export type BackendConfig = {
  name: string;
  baseUrl: string;
  endpoints: {
    auth: {
      registerClient: string;
      getToken: string;
    };
    provider: {
      getProviders: string;
      getProviderById: string;
      getServices: string;
      getServiceById: string;
    };
    quality: {
      getQualityIndicators: string;
      submitQualityIndicators: string;
    };
    nurses: {
      getNurseAttendance: string;
      getNurseAttendanceSummary: string;
      submitNurseAttendance: string;
    };
  };
};

export const BACKENDS: Record<string, BackendConfig> = {
  // Go backend implementation
  golang: {
    name: "Go Backend",
    baseUrl: "http://localhost:8080",
    endpoints: {
      auth: {
        registerClient: "/oauth2/registration",
        getToken: "/oauth2/access-tokens",
      },
      provider: {
        getProviders: "/Provider",
        getProviderById: "/Provider/:id",
        getServices: "/HealthcareService",
        getServiceById: "/HealthcareService/:id",
      },
      quality: {
        getQualityIndicators: "/Questionnaire",
        submitQualityIndicators: "/QuestionnaireResponse",
      },
      nurses: {
        getNurseAttendance: "/RegisteredNurseAttendance",
        getNurseAttendanceSummary: "/RegisteredNurseAttendance?summary=true",
        submitNurseAttendance: "/RegisteredNurseAttendance",
      },
    },
  },
  // Java middleware backend implementation
  java: {
    name: "Java Middleware",
    baseUrl: "http://localhost:8081/api",
    endpoints: {
      auth: {
        registerClient: "/auth/register",
        getToken: "/auth/token",
      },
      provider: {
        getProviders: "/providers",
        getProviderById: "/providers/:id",
        getServices: "/providers/:id/services",
        getServiceById: "/providers/:id/services/:serviceId",
      },
      quality: {
        getQualityIndicators: "/quality/:serviceId",
        submitQualityIndicators: "/quality/:serviceId/submit",
      },
      nurses: {
        getNurseAttendance: "/nurses/:serviceId/records",
        getNurseAttendanceSummary: "/nurses/:serviceId/summary",
        submitNurseAttendance: "/nurses/:serviceId/records",
      },
    },
  },
  // Mock implementation (for before state)
  mock: {
    name: "Mock Data Only",
    baseUrl: "",
    endpoints: {
      auth: {
        registerClient: "",
        getToken: "",
      },
      provider: {
        getProviders: "",
        getProviderById: "",
        getServices: "",
        getServiceById: "",
      },
      quality: {
        getQualityIndicators: "",
        submitQualityIndicators: "",
      },
      nurses: {
        getNurseAttendance: "",
        getNurseAttendanceSummary: "",
        submitNurseAttendance: "",
      },
    },
  },
};

// Set the active backend here
export const ACTIVE_BACKEND = "golang";

// Export the active configuration
export const config = BACKENDS[ACTIVE_BACKEND];