import api from '../utils/api';

export const batchService = {
  // GET ALL BATCHES - EXACT IMPLEMENTATION
  async getBatches(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters exactly as specified
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const response = await api.get(`/batches?${params}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to fetch batches'
      };
    }
  },

  // CREATE BATCH - EXACT IMPLEMENTATION
  async createBatch(batchData) {
    try {
      const response = await api.post('/batches', {
        name: batchData.name,
        description: batchData.description || '',
        expectedCount: batchData.expectedCount || 0
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to create batch'
      };
    }
  },

  // FILE UPLOAD - CRITICAL IMPLEMENTATION
  async importSpreadsheet(batchId, file) {
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
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to import file'
      };
    }
  },

  // START INTAKE PROCESS
  async startIntake(batchId) {
    try {
      const response = await api.post(`/batches/${batchId}/intake`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to start intake'
      };
    }
  }
};