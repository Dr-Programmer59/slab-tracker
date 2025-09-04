import api from '../utils/api';

interface ReportFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  sport?: string;
  year?: number;
  batchId?: string;
  streamId?: string;
  streamerId?: string;
}

interface ExportRequest {
  type: 'inventory' | 'sold' | 'streams' | 'batches' | 'shipments';
  format?: 'csv' | 'pdf';
  filters?: ReportFilters;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const reportService = {
  // GET SUMMARY KPIs - Updated to match exact API response format
  async getSummaryKPIs(range: string = 'month', startDate?: string, endDate?: string): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      
      if (startDate && endDate) {
        params.append('startDate', startDate);
        params.append('endDate', endDate);
      } else {
        params.append('range', range);
      }
      
      const response = await api.get(`/reports/summary?${params}`);
      
      // Check API response format: { ok: true, data: { kpis, range, dateRange } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to fetch summary KPIs');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to fetch summary KPIs'
      };
    }
  },

  // GET SHIPPING VELOCITY METRICS
  async getVelocityMetrics(startDate?: string, endDate?: string): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get(`/reports/velocity?${params}`);
      
      // Check API response format: { ok: true, data: { totalShipped, averageDays, velocityMetrics } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to fetch velocity metrics');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to fetch velocity metrics'
      };
    }
  },

  // EXPORT DATA AS CSV/PDF
  async exportData(exportRequest: ExportRequest): Promise<ApiResponse<any>> {
    try {
      const response = await api.post('/reports/export', {
        type: exportRequest.type,
        format: exportRequest.format || 'csv',
        filters: exportRequest.filters || {}
      });
      
      // Check API response format: { ok: true, data: { filename, filePath, recordCount, etc. } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to generate export');
      }
      
      // Download the file
      await this.downloadFile(response.data.data.filePath, response.data.data.filename);
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to export data'
      };
    }
  },

  // DOWNLOAD FILE HELPER
  async downloadFile(filePath: string, filename: string): Promise<void> {
    try {
      const token = localStorage.getItem('slabtrack_token');
      const response = await fetch(`${api.defaults.baseURL}${filePath}`, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('Failed to download file');
    }
  },

  // EXPORT SHORTCUTS FOR COMMON USE CASES
  async exportInventory(filters: ReportFilters = {}): Promise<ApiResponse<any>> {
    return this.exportData({
      type: 'inventory',
      format: 'csv',
      filters
    });
  },

  async exportSoldCards(startDate?: string, endDate?: string, sport?: string): Promise<ApiResponse<any>> {
    const filters: ReportFilters = {};
    if (startDate) filters.dateFrom = startDate;
    if (endDate) filters.dateTo = endDate;
    if (sport) filters.sport = sport;

    return this.exportData({
      type: 'sold',
      format: 'csv',
      filters
    });
  },

  async exportStreams(filters: ReportFilters = {}): Promise<ApiResponse<any>> {
    return this.exportData({
      type: 'streams',
      format: 'csv',
      filters
    });
  },

  async exportBatches(filters: ReportFilters = {}): Promise<ApiResponse<any>> {
    return this.exportData({
      type: 'batches',
      format: 'csv',
      filters
    });
  },

  async exportShipments(startDate?: string, endDate?: string): Promise<ApiResponse<any>> {
    const filters: ReportFilters = {};
    if (startDate) filters.dateFrom = startDate;
    if (endDate) filters.dateTo = endDate;

    return this.exportData({
      type: 'shipments',
      format: 'csv',
      filters
    });
  }
};