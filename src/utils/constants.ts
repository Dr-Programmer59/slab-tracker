// Application Constants

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  LOGOUT: '/auth/logout',
  
  // Batches
  BATCHES: '/batches',
  BATCH_IMPORT: (batchId: string) => `/batches/${batchId}/import`,
  BATCH_INTAKE: (batchId: string) => `/batches/${batchId}/intake`,
  
  // Cards
  CARDS: '/cards',
  CARD_BY_DISPLAY_ID: (displayId: string) => `/cards/display/${displayId}`,
  CARD_STATUS: (cardId: string) => `/cards/${cardId}/status`,
  CARD_LABEL: (cardId: string) => `/cards/${cardId}/label`,
  CARDS_BULK: '/cards/bulk',
  
  // Streams
  STREAMS: '/streams',
  STREAM_CARDS: (streamId: string) => `/streams/${streamId}/cards`,
  STREAM_FINALIZE: (streamId: string) => `/streams/${streamId}/finalize`,
  STREAM_LOCK: (streamId: string) => `/streams/${streamId}/lock`,
  
  // Shipping
  SHIPMENTS: '/shipments',
  SHIPMENT_STATUS: (shipmentId: string) => `/shipments/${shipmentId}/status`,
  SHIPMENT_LABEL: (shipmentId: string) => `/shipments/${shipmentId}/label`,
  SHIPMENT_TRACKING: (shipmentId: string) => `/shipments/${shipmentId}/tracking`,
  
  // Reports
  REPORTS_DASHBOARD: '/reports/dashboard',
  REPORTS_INVENTORY: '/reports/inventory',
  REPORTS_FINANCIAL: '/reports/financial',
  REPORTS_AUDIT: '/reports/audit',
  REPORTS_EXPORT: '/reports/export',
  
  // Users
  USERS: '/users',
  USER_ROLE: (userId: string) => `/users/${userId}/role`,
};

export const CARD_STATUSES = {
  PENDING: 'pending',
  RECEIVED: 'received',
  GRADED: 'graded',
  INVENTORY: 'inventory',
  RESERVED: 'reserved',
  SOLD: 'sold',
  SHIPPED: 'shipped',
} as const;

export const STREAM_STATUSES = {
  BUILDING: 'building',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const BATCH_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  ERROR: 'error',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  MEMBER: 'member',
} as const;

export const SPORTS = [
  'Basketball',
  'Football', 
  'Baseball',
  'Hockey',
  'Soccer',
  'Pokemon',
  'Other'
] as const;

export const GRADING_COMPANIES = [
  'PSA',
  'BGS',
  'SGC',
  'CSG',
  'Other'
] as const;

export const CONDITIONS = [
  'Mint',
  'Near Mint',
  'Excellent',
  'Very Good',
  'Good',
  'Poor'
] as const;

export const CARRIERS = [
  'USPS',
  'FedEx',
  'UPS',
  'DHL'
] as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  REQUIRED_COLUMNS: [
    'player_name',
    'card_name', 
    'year',
    'brand',
    'sport',
    'purchase_price'
  ],
  OPTIONAL_COLUMNS: [
    'grading_company',
    'grade',
    'market_value',
    'card_number',
    'description',
    'notes'
  ]
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 25,
  MAX_LIMIT: 100,
} as const;

export const DEBOUNCE_DELAY = 300; // milliseconds

export const ERROR_CODES = {
  // Authentication
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FILE_FORMAT: 'INVALID_FILE_FORMAT',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;