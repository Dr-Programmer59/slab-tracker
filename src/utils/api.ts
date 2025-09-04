import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('slabtrack_token');
    if (token) {
      console.log("this is token ", token)
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Simple response interceptor for auth errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('slabtrack_token');
//       localStorage.removeItem('slabtrack_user');
//       localStorage.removeItem('slabtrack_remember');
      
//       if (window.location.pathname !== '/login') {
//         window.location.href = '/login';
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

export default api;