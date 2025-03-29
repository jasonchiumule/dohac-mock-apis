import { useEffect, useState } from 'react';
import { apiClient } from './client';
import { AuthToken, HealthcareService, NurseAttendanceRecord, NurseAttendanceSummary, Provider, QualityIndicator } from '../types';

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

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        // For demo purposes, we'll use mock data
        // In a real app, you would call apiClient.getProviders()
        // const data = await apiClient.getProviders();
        // Import dynamically to avoid circular dependencies
        const { mockProviders } = await import('../utils/mocks');
        setProviders(mockProviders);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch providers');
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  return { providers, loading, error };
}

export function useServices(providerId: string) {
  const [services, setServices] = useState<HealthcareService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      if (!providerId) {
        setServices([]);
        setLoading(false);
        return;
      }
      
      try {
        // For demo purposes, we'll use mock data
        const { mockProviders } = await import('../utils/mocks');
        const provider = mockProviders.find(p => p.providerId === providerId);
        setServices(provider?.services || []);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch services');
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [providerId]);

  return { services, loading, error };
}

export function useQualityIndicators(serviceId: string) {
  const [indicators, setIndicators] = useState<QualityIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchIndicators = async () => {
      if (!serviceId) {
        setIndicators([]);
        setLoading(false);
        return;
      }
      
      try {
        // For demo purposes, we'll use mock data
        const { mockQualityIndicators } = await import('../utils/mocks');
        setIndicators(mockQualityIndicators[serviceId] || []);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch quality indicators');
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchIndicators();
  }, [serviceId]);

  return { indicators, loading, error };
}

export function useNurseAttendance(serviceId: string) {
  const [records, setRecords] = useState<NurseAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!serviceId) {
        setRecords([]);
        setLoading(false);
        return;
      }
      
      try {
        // For demo purposes, we'll use mock data
        const { mockNurseAttendance } = await import('../utils/mocks');
        setRecords(mockNurseAttendance[serviceId] || []);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch nurse attendance records');
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [serviceId]);

  return { records, loading, error };
}

export function useNurseAttendanceSummary(serviceId: string) {
  const [summary, setSummary] = useState<NurseAttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!serviceId) {
        setSummary(null);
        setLoading(false);
        return;
      }
      
      try {
        // For demo purposes, we'll use mock data
        const { mockNurseSummaries } = await import('../utils/mocks');
        setSummary(mockNurseSummaries[serviceId] || null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch nurse attendance summary');
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [serviceId]);

  return { summary, loading, error };
}
