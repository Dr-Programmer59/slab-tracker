import api from '../utils/api';

export const reportService = {
  // GET INVENTORY REPORT
  async getInventoryReport(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.status) params.append('status', filters.status);
      
      const response = await api.get(`/reports/inventory?${params}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to generate inventory report'
      };
    }
  },

  // GET FINANCIAL REPORT
  async getFinancialReport(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      
      const response = await api.get(`/reports/financial?${params}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to generate financial report'
      };
    }
  },

  // GET AUDIT REPORT
  async getAuditReport(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.action) params.append('action', filters.action);
      if (filters.page) params.append('page', filters.page);
      
      const response = await api.get(`/reports/audit?${params}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to generate audit report'
      };
    }
  },

  // EXPORT DATA AS CSV
  async exportData(reportType, filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/reports/${reportType}/export?${params}`, {
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
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to export data'
      };
    }
  }
};