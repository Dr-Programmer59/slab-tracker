// Application constants
export const CARD_STATUSES = [
  'Staged',
  'Arrived', 
  'Available',
  'AllocatedToStream',
  'Sold',
  'ToShip',
  'Packed',
  'Shipped'
] as const;

export const STREAM_STATUSES = [
  'Draft',
  'Locked', 
  'Finalized'
] as const;

export const BATCH_STATUSES = [
  'Open',
  'Locked',
  'Closed'
] as const;

export const SPORTS = [
  'Baseball',
  'Basketball', 
  'Football',
  'Hockey',
  'Soccer',
  'Pokemon'
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
  'UPS',
  'FedEx',
  'DHL'
] as const;

export const PLATFORMS = [
  'eBay',
  'TCGPlayer',
  'COMC',
  'Whatnot',
  'Other'
] as const;

// File upload constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  REQUIRED_COLUMNS: [
    'sport',
    'year', 
    'brand',
    'cardNumber',
    'playerName',
    'condition',
    'purchasePrice'
  ],
  OPTIONAL_COLUMNS: [
    'parallel',
    'certNumber',
    'notes'
  ]
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
} as const;

// API endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    REFRESH: '/auth/refresh'
  },
  CARDS: {
    LIST: '/cards',
    DETAIL: '/cards/:id',
    UPDATE: '/cards/:id',
    DELETE: '/cards/:id',
    LABEL: '/cards/:id/label',
    BULK: '/cards/bulk'
  },
  IMPORT: {
    UPLOAD: '/import/upload',
    BATCHES: '/import/batches',
    BATCH_DETAIL: '/import/batches/:id'
  },
  INTAKE: {
    ROWS: '/intake/rows',
    PROCESS: '/intake/rows/:id/process',
    SKIP: '/intake/rows/:id/skip',
    BULK_PROCESS: '/intake/bulk-process'
  },
  STREAMS: {
    LIST: '/streams',
    CREATE: '/streams',
    DETAIL: '/streams/:id',
    UPDATE: '/streams/:id',
    ADD_CARDS: '/streams/:id/cards',
    FINALIZE: '/streams/:id/finalize'
  },
  REPORTS: {
    DASHBOARD: '/reports/dashboard',
    PROFIT_LOSS: '/reports/profit-loss',
    INVENTORY: '/reports/inventory',
    EXPORT: '/reports/export'
  },
  USERS: {
    LIST: '/users',
    UPDATE_ROLE: '/users/:id/role',
    DELETE: '/users/:id'
  }
} as const;