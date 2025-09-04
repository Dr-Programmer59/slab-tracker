// Environment configuration
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1',
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000',
  
  // Helper to get full backend URL
  getBackendUrl: (path: string) => {
    const baseUrl = config.backendUrl.replace(/\/$/, ''); // Remove trailing slash
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  },
  
  // Helper to get label URL
  getLabelUrl: (displayId: string) => {
    return config.getBackendUrl(`/storage/labels/${displayId}.pdf`);
  }
};