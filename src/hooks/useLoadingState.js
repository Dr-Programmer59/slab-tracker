import { useState } from 'react';

export const useLoadingState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeAsync = async (asyncFunction) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      return result;
    } catch (err) {
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