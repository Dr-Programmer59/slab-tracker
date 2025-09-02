import api from '../utils/api';

interface CardFilters {
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
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

interface CardUpdate {
  [key: string]: any;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const cardService = {
  // GET CARDS WITH FILTERING - EXACT IMPLEMENTATION
  async getCards(filters: CardFilters = {}): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      
      // CRITICAL: Use exact parameter names
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.sport) params.append('sport', filters.sport);
      if (filters.year) params.append('year', filters.year.toString());
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.gradingCompany) params.append('gradingCompany', filters.gradingCompany);
      if (filters.minGrade) params.append('minGrade', filters.minGrade.toString());
      if (filters.maxGrade) params.append('maxGrade', filters.maxGrade.toString());
      if (filters.minValue) params.append('minValue', filters.minValue.toString());
      if (filters.maxValue) params.append('maxValue', filters.maxValue.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      
      const response = await api.get(`/cards?${params}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to fetch cards'
      };
    }
  },

  // GET SINGLE CARD BY ID
  async getCard(cardId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/cards/${cardId}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Card not found'
      };
    }
  },

  // GET CARD BY DISPLAY ID (FOR BARCODE SCANNING)
  async getCardByDisplayId(displayId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/cards/display/${displayId}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Card not found'
      };
    }
  },

  // UPDATE CARD STATUS - CRITICAL FOR WORKFLOW
  async updateCardStatus(cardId: string, status: string, metadata: Record<string, any> = {}): Promise<ApiResponse<any>> {
    try {
      const response = await api.put(`/cards/${cardId}/status`, {
        status: status,
        metadata: metadata
      });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to update status'
      };
    }
  },

  // UPDATE CARD DATA (ADMIN/MANAGER ONLY)
  async updateCard(cardId: string, updates: CardUpdate): Promise<ApiResponse<any>> {
    try {
      const response = await api.put(`/cards/${cardId}`, updates);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to update card'
      };
    }
  }
};