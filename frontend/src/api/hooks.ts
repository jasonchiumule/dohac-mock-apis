import { useEffect, useState } from 'react';
import { apiClient } from './client';
import { AuthClient, AuthToken, HealthcareService, NurseAttendanceRecord, NurseAttendanceSummary, Provider, QualityIndicator, Questionnaire } from '../types';
import { useDemoContext } from '@/context/DemoContext';
import { mockNurseAttendance, mockNurseSummaries, mockProviders, mockQualityIndicators } from '@/utils/mocks';

export function useAuth() {
  const [token, setToken] = useState<AuthToken | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const authenticate = async (clientId: string, clientSecret: string) => {
    setLoading(true);
    setError(null);
    try {
      const authToken = await apiClient.getToken(clientId, clientSecret);
      setToken(authToken);
      return authToken;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to authenticate');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { token, authenticate, loading, error };
}

export function useRegisterClient() {
  const [client, setClient] = useState<AuthClient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const register = async (clientData: Omit<AuthClient, 'clientId' | 'clientSecret'>) => {
    setLoading(true);
    setError(null);
    try {
      const registeredClient = await apiClient.registerClient(clientData);
      setClient(registeredClient);
      return registeredClient;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to register client');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { client, register, loading, error };
}

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { demoState } = useDemoContext();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        if (demoState.connected) {
          // Use real API in connected state
          const data = await apiClient.getProviders();
          setProviders(data);
        } else {
          // Use mock data in disconnected state
          setProviders(mockProviders);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch providers');
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [demoState.connected]);

  return { providers, loading, error };
}

export function useServices(providerId: string) {
  const [services, setServices] = useState<HealthcareService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { demoState } = useDemoContext();

  useEffect(() => {
    const fetchServices = async () => {
      if (!providerId) {
        setServices([]);
        setLoading(false);
        return;
      }
      
      try {
        if (demoState.connected) {
          // Use real API in connected state
          const data = await apiClient.getServices(providerId);
          setServices(data);
        } else {
          // Use mock data in disconnected state
          const provider = mockProviders.find(p => p.providerId === providerId);
          setServices(provider?.services || []);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch services');
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [providerId, demoState.connected]);

  return { services, loading, error };
}

export function useQuestionnaire() {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { demoState } = useDemoContext();

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      if (!demoState.connected) {
        setQuestionnaire(null);
        setLoading(false);
        return;
      }
      
      try {
        const data = await apiClient.getQuestionnaire();
        if (data && data.length > 0) {
          setQuestionnaire(data[0]); // Use the first questionnaire
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch questionnaire');
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaire();
  }, [demoState.connected]);

  return { questionnaire, loading, error };
}

export function useQualityIndicators(serviceId: string) {
  const [indicators, setIndicators] = useState<QualityIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { demoState } = useDemoContext();

  useEffect(() => {
    const fetchIndicators = async () => {
      if (!serviceId) {
        setIndicators([]);
        setLoading(false);
        return;
      }
      
      try {
        if (demoState.connected) {
          // In a real implementation, we would transform the questionnaire responses
          // into quality indicators. For now, we'll use mock data even in connected state.
          setIndicators(mockQualityIndicators[serviceId] || []);
        } else {
          // Use mock data in disconnected state
          setIndicators(mockQualityIndicators[serviceId] || []);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch quality indicators');
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchIndicators();
  }, [serviceId, demoState.connected]);

  return { indicators, loading, error };
}

export function useNurseAttendance(serviceId: string) {
  const [records, setRecords] = useState<NurseAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { demoState } = useDemoContext();

  useEffect(() => {
    const fetchRecords = async () => {
      if (!serviceId) {
        setRecords([]);
        setLoading(false);
        return;
      }
      
      try {
        if (demoState.connected) {
          // Use real API in connected state
          const data = await apiClient.getNurseAttendance(serviceId);
          const transformedData = apiClient.transformNurseAttendanceData(data);
          setRecords(transformedData);
        } else {
          // Use mock data in disconnected state
          setRecords(mockNurseAttendance[serviceId] || []);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch nurse attendance records');
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [serviceId, demoState.connected]);

  return { records, loading, error };
}

export function useNurseAttendanceSummary(serviceId: string) {
  const [summary, setSummary] = useState<NurseAttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { demoState } = useDemoContext();

  useEffect(() => {
    const fetchSummary = async () => {
      if (!serviceId) {
        setSummary(null);
        setLoading(false);
        return;
      }
      
      try {
        if (demoState.connected) {
          // Use real API in connected state
          const data = await apiClient.getNurseAttendanceSummary(serviceId);
          setSummary(data);
        } else {
          // Use mock data in disconnected state
          setSummary(mockNurseSummaries[serviceId] || null);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch nurse attendance summary');
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [serviceId, demoState.connected]);

  return { summary, loading, error };
}
