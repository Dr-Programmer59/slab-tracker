import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// CRITICAL: Request interceptor for JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('slabtrack_token');
    if (token) {
      // EXACT format required by backend: "Bearer <token>"
      config.headers.Authorization = `Bearer ${token}`;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        console.log('🔑 Auth token included:', token.substring(0, 20) + '...');
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url} (no auth)`);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// CRITICAL: Response interceptor for JWT error handling
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    
    if (error.response?.status === 401) {
      console.warn('🔒 JWT Authentication failed - clearing auth data');
      
      // Clear all auth data immediately
      localStorage.removeItem('slabtrack_token');
      localStorage.removeItem('slabtrack_user');
      localStorage.removeItem('slabtrack_remember');
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    if (error.response?.status === 403) {
      console.warn('🚫 Access forbidden - insufficient permissions');
    }
    
    return Promise.reject(error);
  }
);

export default api;