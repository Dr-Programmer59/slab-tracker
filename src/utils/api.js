import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// CRITICAL: Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('slabtrack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// CRITICAL: Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('slabtrack_token');
      localStorage.removeItem('slabtrack_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;