import api from '../utils/api';

export const cardService = {
  // GET CARDS WITH FILTERING - EXACT IMPLEMENTATION
  async getCards(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // CRITICAL: Use exact parameter names
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.sport) params.append('sport', filters.sport);
      if (filters.year) params.append('year', filters.year);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.gradingCompany) params.append('gradingCompany', filters.gradingCompany);
      if (filters.minGrade) params.append('minGrade', filters.minGrade);
      if (filters.maxGrade) params.append('maxGrade', filters.maxGrade);
      if (filters.minValue) params.append('minValue', filters.minValue);
      if (filters.maxValue) params.append('maxValue', filters.maxValue);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      
      const response = await api.get(`/cards?${params}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to fetch cards'
      };
    }
  },

  // GET SINGLE CARD BY ID
  async getCard(cardId) {
    try {
      const response = await api.get(`/cards/${cardId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Card not found'
      };
    }
  },

  // GET CARD BY DISPLAY ID (FOR BARCODE SCANNING)
  async getCardByDisplayId(displayId) {
    try {
      const response = await api.get(`/cards/display/${displayId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Card not found'
      };
    }
  },

  // UPDATE CARD STATUS - CRITICAL FOR WORKFLOW
  async updateCardStatus(cardId, status, metadata = {}) {
    try {
      const response = await api.put(`/cards/${cardId}/status`, {
        status: status,
        metadata: metadata
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to update status'
      };
    }
  },

  // UPDATE CARD DATA (ADMIN/MANAGER ONLY)
  async updateCard(cardId, updates) {
    try {
      const response = await api.put(`/cards/${cardId}`, updates);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to update card'
      };
    }
  }
};