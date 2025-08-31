import api from '../utils/api';

interface StreamFilters {
  status?: string;
  page?: number;
  limit?: number;
}

interface StreamData {
  name: string;
  description?: string;
  targetValue?: number;
}

interface PnLData {
  soldPrice: number;
  fees?: number;
  shippingCost?: number;
  buyerInfo?: any;
  notes?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const streamService = {
  // GET ALL STREAMS
  async getStreams(filters: StreamFilters = {}): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const response = await api.get(`/streams?${params}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to fetch streams'
      };
    }
  },

  // CREATE NEW STREAM
  async createStream(streamData: StreamData): Promise<ApiResponse<any>> {
    try {
      const response = await api.post('/streams', {
        name: streamData.name,
        description: streamData.description || '',
        targetValue: streamData.targetValue || 0
      });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to create stream'
      };
    }
  },

  // ADD CARD TO STREAM - CRITICAL FUNCTIONALITY
  async addCardToStream(streamId: string, cardDisplayId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(`/streams/${streamId}/cards`, {
        cardDisplayId: cardDisplayId // EXACT field name required
      });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to add card to stream'
      };
    }
  },

  // REMOVE CARD FROM STREAM
  async removeCardFromStream(streamId: string, cardId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.delete(`/streams/${streamId}/cards/${cardId}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to remove card from stream'
      };
    }
  },

  // FINALIZE STREAM - CRITICAL FOR P&L
  async finalizeStream(streamId: string, pnlData: PnLData): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(`/streams/${streamId}/finalize`, {
        soldPrice: pnlData.soldPrice,
        fees: pnlData.fees || 0,
        shippingCost: pnlData.shippingCost || 0,
        buyerInfo: pnlData.buyerInfo,
        notes: pnlData.notes || ''
      });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to finalize stream'
      };
    }
  },

  // GET STREAM DETAILS
  async getStreamDetails(streamId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/streams/${streamId}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Stream not found'
      };
    }
  }
};