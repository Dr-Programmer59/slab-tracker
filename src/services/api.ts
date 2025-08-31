import axios, { AxiosInstance, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
const TOKEN_KEY = 'slabtrack_token';
const USER_KEY = 'slabtrack_user';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: { name: string; email: string; password: string; role: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Batch Management API
export const batchAPI = {
  createBatch: async (batchData: { name: string; description?: string; expectedCount?: number }) => {
    const response = await api.post('/batches', batchData);
    return response.data;
  },

  getBatches: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get('/batches', { params });
    return response.data;
  },

  getBatch: async (batchId: string) => {
    const response = await api.get(`/batches/${batchId}`);
    return response.data;
  },

  uploadFile: async (batchId: string, file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/batches/${batchId}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  },

  startIntake: async (batchId: string) => {
    const response = await api.post(`/batches/${batchId}/intake`);
    return response.data;
  },

  finalizeBatch: async (batchId: string) => {
    const response = await api.put(`/batches/${batchId}/finalize`);
    return response.data;
  },
};

// Card Management API
export const cardAPI = {
  getCards: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sport?: string;
    year?: number;
    brand?: string;
    gradingCompany?: string;
    minGrade?: number;
    maxGrade?: number;
    minValue?: number;
    maxValue?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await api.get('/cards', { params });
    return response.data;
  },

  getCard: async (cardId: string) => {
    const response = await api.get(`/cards/${cardId}`);
    return response.data;
  },

  getCardByDisplayId: async (displayId: string) => {
    const response = await api.get(`/cards/display/${displayId}`);
    return response.data;
  },

  updateCard: async (cardId: string, updates: any) => {
    const response = await api.put(`/cards/${cardId}`, updates);
    return response.data;
  },

  updateCardStatus: async (cardId: string, status: string, metadata?: any) => {
    const response = await api.put(`/cards/${cardId}/status`, { status, metadata });
    return response.data;
  },

  deleteCard: async (cardId: string) => {
    const response = await api.delete(`/cards/${cardId}`);
    return response.data;
  },

  generateLabel: async (cardId: string) => {
    const response = await api.post(`/cards/${cardId}/label`);
    return response.data;
  },

  bulkUpdate: async (cardIds: string[], updates: any) => {
    const response = await api.put('/cards/bulk', { cardIds, updates });
    return response.data;
  },
};

// Stream Management API
export const streamAPI = {
  getStreams: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get('/streams', { params });
    return response.data;
  },

  getStream: async (streamId: string) => {
    const response = await api.get(`/streams/${streamId}`);
    return response.data;
  },

  createStream: async (streamData: { name: string; description?: string; targetValue?: number }) => {
    const response = await api.post('/streams', streamData);
    return response.data;
  },

  addCardToStream: async (streamId: string, cardDisplayId: string) => {
    const response = await api.post(`/streams/${streamId}/cards`, { cardDisplayId });
    return response.data;
  },

  removeCardFromStream: async (streamId: string, cardId: string) => {
    const response = await api.delete(`/streams/${streamId}/cards/${cardId}`);
    return response.data;
  },

  finalizeStream: async (streamId: string, finalizationData: {
    soldPrice: number;
    fees: number;
    shippingCost: number;
    buyerInfo: any;
    notes?: string;
  }) => {
    const response = await api.post(`/streams/${streamId}/finalize`, finalizationData);
    return response.data;
  },

  lockStream: async (streamId: string) => {
    const response = await api.put(`/streams/${streamId}/lock`);
    return response.data;
  },
};

// Shipping Management API
export const shippingAPI = {
  getShipments: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get('/shipments', { params });
    return response.data;
  },

  getShipment: async (shipmentId: string) => {
    const response = await api.get(`/shipments/${shipmentId}`);
    return response.data;
  },

  createShipment: async (shipmentData: {
    buyerName: string;
    buyerEmail: string;
    shippingAddress: any;
    cardIds: string[];
    shippingMethod: string;
  }) => {
    const response = await api.post('/shipments', shipmentData);
    return response.data;
  },

  updateShipmentStatus: async (shipmentId: string, status: string, trackingData?: any) => {
    const response = await api.put(`/shipments/${shipmentId}/status`, { status, ...trackingData });
    return response.data;
  },

  generateShippingLabel: async (shipmentId: string) => {
    const response = await api.post(`/shipments/${shipmentId}/label`);
    return response.data;
  },

  getTracking: async (shipmentId: string) => {
    const response = await api.get(`/shipments/${shipmentId}/tracking`);
    return response.data;
  },
};

// Reports API
export const reportsAPI = {
  getDashboard: async () => {
    const response = await api.get('/reports/dashboard');
    return response.data;
  },

  getInventoryReport: async (params?: { sport?: string; status?: string }) => {
    const response = await api.get('/reports/inventory', { params });
    return response.data;
  },

  getFinancialReport: async (params?: { from?: string; to?: string }) => {
    const response = await api.get('/reports/financial', { params });
    return response.data;
  },

  getAuditReport: async (params?: { page?: number; limit?: number; userId?: string; action?: string }) => {
    const response = await api.get('/reports/audit', { params });
    return response.data;
  },

  exportData: async (type: 'cards' | 'sales' | 'shipments', format: 'csv' | 'xlsx') => {
    const response = await api.get(`/reports/export`, {
      params: { type, format },
      responseType: 'blob',
    });
    return response.data;
  },
};

// User Management API (Admin only)
export const userAPI = {
  getUsers: async (params?: { page?: number; limit?: number; role?: string }) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  createUser: async (userData: { name: string; email: string; password: string; role: string }) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (userId: string, updates: any) => {
    const response = await api.put(`/users/${userId}`, updates);
    return response.data;
  },

  updateUserRole: async (userId: string, role: string) => {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

export default api;