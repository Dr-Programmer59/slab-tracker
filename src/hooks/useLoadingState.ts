import { useState } from 'react';

interface LoadingState {
  loading: boolean;
  error: string | null;
  executeAsync: <T>(asyncFunction: () => Promise<T>) => Promise<T>;
  clearError: () => void;
}

export const useLoadingState = (): LoadingState => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeAsync = async <T>(asyncFunction: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    executeAsync,
    clearError: () => setError(null)
  };
};