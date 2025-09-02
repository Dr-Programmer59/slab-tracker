import api from '../utils/api';

interface BatchFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface BatchData {
  name: string;
  description?: string;
  expectedCount?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const batchService = {
  // GET ALL BATCHES - Updated to match exact API response format
  async getBatches(filters: BatchFilters = {}): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const response = await api.get(`/batches?${params}`);
      
      // Check API response format: { ok: true, data: { batches, pagination } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to fetch batches');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to fetch batches'
      };
    }
  },

  // CREATE BATCH
  async createBatch(batchData: BatchData): Promise<ApiResponse<any>> {
    try {
      const response = await api.post('/batches', {
        name: batchData.name,
        description: batchData.description || '',
        expectedCount: batchData.expectedCount || 0
      });
      
      // Check API response format: { ok: true, data: { batch, message } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to create batch');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to create batch'
      };
    }
  },

  // FILE UPLOAD - CRITICAL IMPLEMENTATION
  async importSpreadsheet(batchId: string, file: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`/batches/${batchId}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000
      });
      
      // Check API response format: { ok: true, data: { message, importedCount, errors, batch } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to import file');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to import file'
      };
    }
  },

  // START INTAKE PROCESS
  async startIntake(batchId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(`/batches/${batchId}/intake`);
      
      // Check API response format: { ok: true, data: { message, batch } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to start intake');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to start intake'
      };
    }
  }
};