import api from '../utils/api';

interface ShipmentFilters {
  status?: string;
  page?: number;
  limit?: number;
}

interface ShipmentData {
  buyerName: string;
  buyerEmail: string;
  shippingAddress: any;
  cardIds: string[];
  shippingMethod?: string;
}

interface TrackingData {
  trackingNumber: string;
  carrier: string;
  shippedDate?: string;
  estimatedDelivery?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const shippingService = {
  // GET ALL SHIPMENTS
  async getShipments(filters: ShipmentFilters = {}): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const response = await api.get(`/shipments?${params}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to fetch shipments'
      };
    }
  },

  // CREATE MANUAL SHIPMENT
  async createShipment(shipmentData: ShipmentData): Promise<ApiResponse<any>> {
    try {
      const response = await api.post('/shipments', {
        buyerName: shipmentData.buyerName,
        buyerEmail: shipmentData.buyerEmail,
        shippingAddress: shipmentData.shippingAddress,
        cardIds: shipmentData.cardIds,
        shippingMethod: shipmentData.shippingMethod || 'Standard'
      });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to create shipment'
      };
    }
  },

  // MARK SHIPMENT AS SHIPPED
  async markAsShipped(shipmentId: string, trackingData: TrackingData): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(`/shipments/${shipmentId}/ship`, {
        trackingNumber: trackingData.trackingNumber,
        carrier: trackingData.carrier,
        shippedDate: trackingData.shippedDate,
        estimatedDelivery: trackingData.estimatedDelivery
      });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to mark as shipped'
      };
    }
  },

  // GET SHIPMENT DETAILS
  async getShipmentDetails(shipmentId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/shipments/${shipmentId}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Shipment not found'
      };
    }
  },

  // DOWNLOAD SHIPPING LABEL
  async downloadLabel(shipmentId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/shipments/${shipmentId}/label`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `shipment-${shipmentId}-label.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Failed to download label'
      };
    }
  }
};