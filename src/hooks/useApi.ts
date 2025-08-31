import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(
  apiCall: () => Promise<any>,
  options: UseApiOptions = {}
): UseApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall();
      setState({
        data: response,
        loading: false,
        error: null,
      });
      
      if (options.onSuccess) {
        options.onSuccess(response);
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.error?.message || error.message
        : 'An unexpected error occurred';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      
      if (options.onError) {
        options.onError(errorMessage);
      }
    }
  };

  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
  }, []);

  return {
    ...state,
    refetch: execute,
  };
}

export function useMutation<T>(
  apiCall: (...args: any[]) => Promise<any>,
  options: UseApiOptions = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall(...args);
      setState({
        data: response,
        loading: false,
        error: null,
      });
      
      if (options.onSuccess) {
        options.onSuccess(response);
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.error?.message || error.message
        : 'An unexpected error occurred';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      
      if (options.onError) {
        options.onError(errorMessage);
      }
      
      throw error;
    }
  };

  return {
    ...state,
    mutate,
    reset: () => setState({ data: null, loading: false, error: null }),
  };
}