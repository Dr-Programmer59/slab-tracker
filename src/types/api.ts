// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  pagination?: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'manager' | 'member';
    createdAt: string;
    lastLogin?: string;
  };
}

export interface CardsResponse {
  cards: Card[];
  pagination: {
    page: number;
    pages: number;
    total: number;
  };
  summary: {
    totalValue: number;
    count: number;
  };
}

export interface BatchResponse {
  batch: {
    id: string;
    displayId: string;
    fileName: string;
    fileSize: number;
    rowCount: number;
    processedCount: number;
    status: 'pending' | 'processing' | 'completed' | 'error';
    uploadedBy: string;
    createdAt: string;
    completedAt?: string;
  };
  rows?: any[];
}

export interface StreamResponse {
  stream: {
    id: string;
    displayId: string;
    name: string;
    description: string;
    targetValue: number;
    currentValue: number;
    cardCount: number;
    platform: string;
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
  };
}

export interface DashboardKPIs {
  totalCards: number;
  totalValue: number;
  monthlyProfit: number;
  activeStreams: number;
  topPerformers: Card[];
  recentActivity: {
    id: string;
    type: string;
    action: string;
    description: string;
    timestamp: string;
    userId: string;
  }[];
}

// Error codes from backend
export const ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const;