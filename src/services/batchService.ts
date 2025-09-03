import api from '../utils/api';
import type { 
  BatchFilters, 
  BatchRowFilters, 
  ApiResponse, 
  BatchIngestResponse,
  BatchListResponse,
  BatchRowsResponse,
  BatchRowArriveResponse,
  BatchFinishResponse,
  Batch
} from '../types';

export const batchService = {
  // 1) INGEST SPREADSHEET → CREATE A BATCH
  async ingestSpreadsheet(file: File, name?: string, idempotencyKey?: string): Promise<ApiResponse<BatchIngestResponse>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (name) {
        formData.append('name', name);
      }

      const headers: Record<string, string> = {};
      
      // Do NOT set Content-Type manually for multipart - let browser set boundary
      if (idempotencyKey) {
        headers['X-Idempotency-Key'] = idempotencyKey;
      }

      const response = await api.post('/batches/ingest', formData, {
        headers,
        timeout: 60000
      });
      
      // Check API response format: { ok: true, data: { batch, validation } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to ingest spreadsheet');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to ingest spreadsheet'
      };
    }
  },

  // 2) LIST BATCHES
  async getBatches(filters: BatchFilters = {}): Promise<ApiResponse<BatchListResponse>> {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const response = await api.get(`/batches?${params}`);
      
      // Check API response format: { ok: true, data: { items, total, page, limit } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to fetch batches');
      }
      
      // Map the response to ensure consistent field names
      const apiData = response.data.data;
      const mappedData = {
        ...apiData,
        items: (apiData.items || []).map((batch: any) => ({
          ...batch,
          createdAt: new Date(batch.createdAt),
          updatedAt: batch.updatedAt ? new Date(batch.updatedAt) : undefined,
          lockedAt: batch.lockedAt ? new Date(batch.lockedAt) : undefined
        }))
      };
      
      return { success: true, data: mappedData };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to fetch batches'
      };
    }
  },

  // 3) READ A SINGLE BATCH
  async getBatch(batchId: string): Promise<ApiResponse<{ batch: Batch }>> {
    try {
      const response = await api.get(`/batches/${batchId}`);
      
      // Check API response format: { ok: true, data: { batch } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Batch not found');
      }
      
      // Map the response to ensure consistent field names
      const apiData = response.data.data;
      const mappedData: { batch: Batch } = {
        ...apiData,
        batch: {
          ...apiData.batch,
          createdAt: new Date(apiData.batch.createdAt),
          updatedAt: apiData.batch.updatedAt ? new Date(apiData.batch.updatedAt) : undefined,
          lockedAt: apiData.batch.lockedAt ? new Date(apiData.batch.lockedAt) : undefined
        }
      };
      
      return { success: true, data: mappedData };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Batch not found'
      };
    }
  },

  // 4) LIST ROWS IN A BATCH
  async getBatchRows(batchId: string, filters: BatchRowFilters = {}): Promise<ApiResponse<BatchRowsResponse>> {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const response = await api.get(`/batches/${batchId}/rows?${params}`);
      
      // Check API response format: { ok: true, data: { items, total, page, limit } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to fetch batch rows');
      }
      
      // Map the response to ensure consistent field names
      const apiData = response.data.data;
      const mappedData: BatchRowsResponse = {
        ...apiData,
        items: (apiData.items || []).map((row: any) => ({
          ...row,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
          arrivedAt: row.arrivedAt ? new Date(row.arrivedAt) : undefined
        }))
      };
      
      return { success: true, data: mappedData };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to fetch batch rows'
      };
    }
  },

  // 5) MARK A ROW AS ARRIVED (creates Card and Label)
  async markRowAsArrived(batchId: string, rowId: string, idempotencyKey?: string): Promise<ApiResponse<BatchRowArriveResponse>> {
    try {
      const headers: Record<string, string> = {};
      
      if (idempotencyKey) {
        headers['X-Idempotency-Key'] = idempotencyKey;
      }

      const response = await api.post(`/batches/${batchId}/rows/${rowId}/arrive`, {}, {
        headers
      });
      
      // Check API response format: { ok: true, data: { card, row, message } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to mark row as arrived');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to mark row as arrived'
      };
    }
  },

  // 6) FINISH A BATCH (lock batch and make cards available)
  async finishBatch(batchId: string, idempotencyKey?: string): Promise<ApiResponse<BatchFinishResponse>> {
    try {
      const headers: Record<string, string> = {};
      
      if (idempotencyKey) {
        headers['X-Idempotency-Key'] = idempotencyKey;
      }

      const response = await api.post(`/batches/${batchId}:finish`, {}, {
        headers
      });
      
      // Check API response format: { ok: true, data: { batch, cardsUpdated, message } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to finish batch');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to finish batch'
      };
    }
  }
};