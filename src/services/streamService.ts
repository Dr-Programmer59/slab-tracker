import api from '../utils/api';

interface StreamFilters {
  status?: string;
  streamerUserId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

interface StreamData {
  name: string;
  description?: string;
  targetValue?: number;
  date?: string;
}

interface PnLData {
  grossSales: number;
  fees?: number;
  bulkSale?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const streamService = {
  // GET ALL STREAMS - Updated to match exact API response format
  async getStreams(filters: StreamFilters = {}): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.streamerUserId) params.append('streamerUserId', filters.streamerUserId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const response = await api.get(`/streams?${params}`);
      
      
      // Check API response format: { success: true, data: [...], pagination: {...} }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to fetch streams');
      }
      
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to fetch streams'
      };
    }
  },

  // CREATE NEW STREAM
  async createStream(streamData: StreamData): Promise<ApiResponse<any>> {
    try {
      const response = await api.post('/streams', {
        name: streamData.name,
        description: streamData.description || '',
        targetValue: streamData.targetValue || 0,
        date: streamData.date
      });
      
      // Check API response format: { success: true, data: { stream } }
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to create stream');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to create stream'
      };
    }
  },

  // GET STREAM DETAILS
  async getStreamDetails(streamId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/streams/${streamId}`);
      
      // Check API response format: { success: true, data: { stream } }
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Stream not found');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Stream not found'
      };
    }
  },

  // GET STREAM ITEMS
  async getStreamItems(streamId: string, page: number = 1, limit: number = 25): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/streams/${streamId}/items?page=${page}&limit=${limit}`);
      
      // Check API response format: { success: true, data: [...], pagination: {...} }
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to fetch stream items');
      }
      
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to fetch stream items'
      };
    }
  },

  // ADD CARD TO STREAM - CRITICAL FUNCTIONALITY
  async addCardToStream(streamId: string, displayId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(`/streams/${streamId}/items`, {
        displayId: displayId
      });
      
      // Check API response format: { success: true, data: { item, stream, message } }
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to add card to stream');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to add card to stream'
      };
    }
  },

  // REMOVE CARD FROM STREAM
  async removeCardFromStream(streamId: string, cardId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.delete(`/streams/${streamId}/items/${cardId}`);
      
      // Check API response format: { success: true, data: { stream, message } }
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to remove card from stream');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to remove card from stream'
      };
    }
  },

  // LOCK STREAM
  async lockStream(streamId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(`/streams/${streamId}/lock`);
      
      // Check API response format: { success: true, data: { stream, message } }
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to lock stream');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to lock stream'
      };
    }
  },

  // FINALIZE STREAM - CRITICAL FOR P&L
  async finalizeStream(streamId: string, pnlData: PnLData): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(`/streams/${streamId}/finalize`, {
        grossSales: pnlData.grossSales,
        fees: pnlData.fees || 0,
        bulkSale: pnlData.bulkSale || false
      });
      
      // Check API response format: { success: true, data: { stream, message } }
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to finalize stream');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to finalize stream'
      };
    }
  }
};