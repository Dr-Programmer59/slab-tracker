// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// API User Object (from backend)
export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// API Card Object (from backend)
export interface ApiCard {
  _id: string;
  displayId: string;
  playerName: string;
  cardName: string;
  year: number;
  brand: string;
  sport: string;
  gradingCompany?: string;
  grade?: number;
  marketValue?: number;
  customValue?: number;
  purchasePrice?: number;
  status: 'pending' | 'received' | 'graded' | 'inventory' | 'reserved' | 'sold' | 'shipped';
  cardNumber?: string;
  description?: string;
  notes?: string;
  batchId?: string;
  streamId?: string;
  createdAt: string;
  updatedAt: string;
}

// API Batch Object (from backend)
export interface ApiBatch {
  _id: string;
  displayId: string;
  name: string;
  description?: string;
  fileName?: string;
  fileSize?: number;
  rowCount: number;
  processedCount: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  uploadedBy: string;
  createdAt: string;
  completedAt?: string;
}

// API Stream Object (from backend)
export interface ApiStream {
  _id: string;
  displayId: string;
  name: string;
  description?: string;
  targetValue?: number;
  currentValue: number;
  cardCount: number;
  status: 'building' | 'active' | 'completed' | 'cancelled';
  profitLoss?: {
    totalCost: number;
    totalRevenue: number;
    netProfit: number;
    profitMargin: number;
  };
  createdBy: string;
  createdAt: string;
  finalizedAt?: string;
}

// API Shipment Object (from backend)
export interface ApiShipment {
  _id: string;
  displayId: string;
  streamIds: string[];
  cardIds: string[];
  shippingAddress: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  carrier: 'usps' | 'fedex' | 'ups';
  serviceType: 'ground' | 'express' | 'overnight';
  trackingNumber?: string;
  labelUrl?: string;
  shippingCost?: number;
  status: 'pending' | 'shipped' | 'delivered' | 'returned';
  createdBy: string;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}

// API Audit Log Object (from backend)
export interface ApiAuditLog {
  _id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
}