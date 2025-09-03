import api from '../utils/api';

interface ReportFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  userId?: string;
  action?: string;
  page?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const reportService = {
  // GET INVENTORY REPORT - Updated to match exact API response format
  async getInventoryReport(filters: ReportFilters = {}): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.status) params.append('status', filters.status);
      
      const response = await api.get(`/reports/inventory?${params}`);
      
      // Check API response format: { ok: true, data: { summary, topCards, recentActivity } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to generate inventory report');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to generate inventory report'
      };
    }
  },

  // GET FINANCIAL REPORT
  async getFinancialReport(filters: ReportFilters = {}): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      
      const response = await api.get(`/reports/financial?${params}`);
      
      // Check API response format: { ok: true, data: { period, summary, monthlyBreakdown, topPerformingStreams } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to generate financial report');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to generate financial report'
      };
    }
  },

  // GET AUDIT REPORT
  async getAuditReport(filters: ReportFilters = {}): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.action) params.append('action', filters.action);
      if (filters.page) params.append('page', filters.page.toString());
      
      const response = await api.get(`/reports/audit?${params}`);
      
      // Check API response format: { ok: true, data: { logs, pagination } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to generate audit report');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to generate audit report'
      };
    }
  },

  // EXPORT DATA AS CSV
  async exportData(reportType: string, filters: ReportFilters = {}): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
      
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to export data'
      };
    }
  }
};