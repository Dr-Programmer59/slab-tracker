// API service layer with error handling and authentication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiError {
  message: string;
  code: string;
  details?: any;
}

interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  pagination?: {
    page: number;
    pages: number;
    total: number;
  };
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
      
      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
      
      throw new Error(data.error?.message || 'An unexpected error occurred');
    }
    
    return data;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        }
      });
      
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async login(credentials: { email: string; password: string }) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  // Cards
  async getCards(params: any = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request<{ cards: any[]; pagination: any; summary: any }>(`/cards?${searchParams}`);
  }

  async getCard(cardId: string) {
    return this.request<{ card: any }>(`/cards/${cardId}`);
  }

  async updateCard(cardId: string, updates: any) {
    return this.request<{ card: any }>(`/cards/${cardId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async generateLabel(cardId: string) {
    return this.request<{ labelUrl: string; qrCode: string; barcode: string }>(`/cards/${cardId}/label`, {
      method: 'POST'
    });
  }

  // Import
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/import/upload`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    });
    
    return this.handleResponse(response);
  }

  async getBatches(params: any = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request<{ batches: any[]; pagination: any }>(`/import/batches?${searchParams}`);
  }

  async getBatch(batchId: string) {
    return this.request<{ batch: any; rows: any[] }>(`/import/batches/${batchId}`);
  }

  // Intake
  async getIntakeRows(params: any = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request<{ rows: any[]; pagination: any }>(`/intake/rows?${searchParams}`);
  }

  async processRow(rowId: string, cardDetails: any) {
    return this.request<{ card: any }>(`/intake/rows/${rowId}/process`, {
      method: 'POST',
      body: JSON.stringify({ cardDetails })
    });
  }

  // Streams
  async getStreams(params: any = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request<{ streams: any[]; pagination: any }>(`/streams?${searchParams}`);
  }

  async createStream(streamData: any) {
    return this.request<{ stream: any }>('/streams', {
      method: 'POST',
      body: JSON.stringify(streamData)
    });
  }

  async addCardsToStream(streamId: string, cardIds: string[]) {
    return this.request<{ stream: any; addedCount: number }>(`/streams/${streamId}/cards`, {
      method: 'POST',
      body: JSON.stringify({ cardIds })
    });
  }

  async finalizeStream(streamId: string) {
    return this.request<{ stream: any; totalValue: number; profitLoss: any }>(`/streams/${streamId}/finalize`, {
      method: 'POST'
    });
  }

  // Reports
  async getDashboardKPIs() {
    return this.request<{
      totalCards: number;
      totalValue: number;
      monthlyProfit: number;
      topPerformers: any[];
      recentActivity: any[];
    }>('/reports/dashboard');
  }

  async getProfitLossReport(params: any) {
    const searchParams = new URLSearchParams(params);
    return this.request<{
      totalRevenue: number;
      totalCosts: number;
      netProfit: number;
      profitMargin: number;
      breakdown: any;
    }>(`/reports/profit-loss?${searchParams}`);
  }

  // Users (Admin only)
  async getUsers(params: any = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request<{ users: any[]; pagination: any }>(`/users?${searchParams}`);
  }

  async updateUserRole(userId: string, role: string) {
    return this.request<{ user: any }>(`/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
  }
}

export const apiService = new ApiService();