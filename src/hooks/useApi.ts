import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute
  };
}

// Specialized hooks for common operations
export function useCards(filters: any = {}) {
  return useApi(
    () => apiService.getCards(filters),
    [JSON.stringify(filters)]
  );
}

export function useStreams() {
  return useApi(() => apiService.getStreams());
}

export function useDashboardKPIs() {
  return useApi(() => apiService.getDashboardKPIs());
}

export function useBatches() {
  return useApi(() => apiService.getBatches());
}