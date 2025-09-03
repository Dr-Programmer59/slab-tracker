import api from '../utils/api';
import type { 
  BatchFilters, 
  BatchRowFilters, 
  ApiResponse, 
  BatchIngestResponse,
  BatchListResponse,
  BatchRowsResponse,
  BatchRowArriveResponse,
  BatchFinishResponse
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

        headers,
        timeout: 60000
      });
      
      // Backend uses success() wrapper: { success: true, data: { batch, validation } }
      if (!response.data.success) {
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
      console.log(response)
      
      // Backend uses paginated() wrapper: { items, total, page, limit } - NO success wrapper
      if (!response.data.data.items) {
        throw new Error('Invalid response format');
      }
      
      // Map the response to ensure consistent field names
      const mappedData: BatchListResponse = {
        items:response.data.data.items.map((batch: any) => ({
          _id: batch._id,
          name: batch.name,
          filename: batch.filename,
          status: batch.status,
          totalRows: batch.totalRows,
          stagedCount: batch.stagedCount,
          arrivedCount: batch.arrivedCount,
          skippedCount: batch.skippedCount,
          createdAt: new Date(batch.createdAt),
          createdBy: batch.createdBy,
          lockedAt: batch.lockedAt ? new Date(batch.lockedAt) : undefined,
          lockedBy: batch.lockedBy,
          updatedAt: batch.updatedAt ? new Date(batch.updatedAt) : undefined
        })),
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
      };
      
      return { success: true, data: mappedData };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to fetch batches'
      };
    }
  },

  // 3) READ A SINGLE BATCH
  async getBatch(batchId: string): Promise<ApiResponse<{ batch: any }>> {
    try {
      const response = await api.get(`/batches/${batchId}`);
      
      // Backend returns batch directly or in data wrapper

      const batchData = response.data.batch || response.data;
      
      const mappedData = {
        batch: {
          _id: batchData._id,
          name: batchData.name,
          filename: batchData.filename,
          status: batchData.status,
          totalRows: batchData.totalRows,
          stagedCount: batchData.stagedCount,
          arrivedCount: batchData.arrivedCount,
          skippedCount: batchData.skippedCount,
          createdAt: new Date(batchData.createdAt),
          createdBy: batchData.createdBy,
          lockedAt: batchData.lockedAt ? new Date(batchData.lockedAt) : undefined,
          lockedBy: batchData.lockedBy,
          updatedAt: batchData.updatedAt ? new Date(batchData.updatedAt) : undefined
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
      
      // Backend uses paginated() wrapper: { items, total, page, limit } - NO success wrapper
      if (!response.data.data.items) {
        throw new Error('Invalid response format');
      }
      
      // Map the response to ensure consistent field names
      const mappedData: BatchRowsResponse = {
        items: response.data.data.items.map((row: any) => ({
          _id: row._id,
          batchId: row.batchId,
          rowNumber: row.rowNumber,
          title: row.title,
          player: row.player,
          sport: row.sport,
          year: row.year,
          grade: row.grade,
          purchasePrice: row.purchasePrice,
          brand: row.brand,
          notes: row.notes,
          status: row.status,
          validationErrors: row.validationErrors || [],
          linkedCardId: row.linkedCardId,
          arrivedAt: row.arrivedAt ? new Date(row.arrivedAt) : undefined,
          arrivedBy: row.arrivedBy,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt)
        })),
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit
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

        headers
      });
      
      // Backend uses success() wrapper: { success: true, data: { card, row, message } }
      if (!response.data.success) {
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

        headers
      });
      
      // Backend uses success() wrapper: { success: true, data: { batch, cardsUpdated, message } }
      if (!response.data.success) {
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