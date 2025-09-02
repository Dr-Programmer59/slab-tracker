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
  // GET ALL BATCHES - EXACT IMPLEMENTATION
  async getBatches(filters: BatchFilters = {}): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      
      // Add filters exactly as specified
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const response = await api.get(`/batches?${params}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to fetch batches'
      };
    }
  },

  // CREATE BATCH - EXACT IMPLEMENTATION
  async createBatch(batchData: BatchData): Promise<ApiResponse<any>> {
    try {
      const response = await api.post('/batches', {
        name: batchData.name,
        description: batchData.description || '',
        expectedCount: batchData.expectedCount || 0
      });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to create batch'
      };
    }
  },

  // FILE UPLOAD - CRITICAL IMPLEMENTATION
  async importSpreadsheet(batchId: string, file: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('file', file); // EXACT field name required
      
      const response = await api.post(`/batches/${batchId}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // CRITICAL: Override content type
        },
        timeout: 60000 // Longer timeout for file upload
      });
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to import file'
      };
    }
  },

  // START INTAKE PROCESS
  async startIntake(batchId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(`/batches/${batchId}/intake`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to start intake'
      };
    }
  }
};