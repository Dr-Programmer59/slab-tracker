// Core entity types
export interface Card {
  id: string;
  displayId: string;
  title: string;
  player: string;
  sport: string;
  year: number;
  grade?: string;
  purchasePrice: number;
  currentValue?: number;
  status: CardStatus;
  batchId?: string;
  streamId?: string;
  arrivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  imageUrl?: string;
}

export interface Batch {
  _id: string;
  name: string;
  filename?: string;
  status: BatchStatus;
  totalRows: number;
  stagedCount: number;
  arrivedCount: number;
  skippedCount: number;
  createdAt: Date;
  createdBy: {
    _id: string;
    displayName: string;
    email: string;
  };
  lockedAt?: Date | string;
  lockedBy?: {
    _id: string;
    displayName: string;
    email: string;
  };
  updatedAt?: Date | string;
}

export interface BatchRow {
  _id: string;
  batchId: string;
  rowNumber: number;
  title: string;
  player?: string;
  sport?: string;
  year?: number;
  grade?: string;
  purchasePrice: number;
  brand?: string;
  notes?: string;
  status: BatchRowStatus;
  validationErrors: Array<{
    field: string;
    message: string;
  }>;
  linkedCardId?: string;
  arrivedAt?: Date | string;
  arrivedBy?: {
    _id: string;
    displayName: string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Batch API Response Types
export interface BatchIngestResponse {
  batch: Batch;
  validation: {
    valid: number;
    invalid: number;
    errors: Array<{
      row: number;
      errors: Array<{
        field: string;
        message: string;
      }>;
    }>;
  };
}

export interface BatchListResponse {
  items: Batch[];
  total: number;
  page: number;
  limit: number;
}

export interface BatchRowsResponse {
  items: BatchRow[];
  total: number;
  page: number;
  limit: number;
}

export interface BatchRowArriveResponse {
  card: {
    _id: string;
    displayId: string;
    title: string;
    player?: string;
    sport?: string;
    year?: number;
    grade?: string;
    purchasePrice: number;
    brand?: string;
    notes?: string;
    status: string;
    batchId: string;
    sourceRowId: string;
    barcodePayload?: string;
    qrUrl?: string;
    labelPath?: string;
    createdBy?: {
      displayName: string;
      email: string;
    };
    createdAt: Date | string;
    updatedAt: Date | string;
  };
  row: BatchRow;
  message: string;
}

export interface BatchFinishResponse {
  batch: {
    _id: string;
    status: BatchStatus;
    lockedAt: Date | string;
    lockedBy: string;
  };
  cardsUpdated: number;
  message: string;
}

// Batch Service Filter Types
export interface BatchFilters {
  status?: BatchStatus;
  page?: number;
  limit?: number;
}

export interface BatchRowFilters {
  status?: BatchRowStatus;
  page?: number;
  limit?: number;
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Stream {
  id: string;
  title: string;
  streamer: string;
  date: Date;
  status: StreamStatus;
  totalItems: number;
  totalCost: number;
  grossSales?: number;
  fees?: number;
  profit?: number;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: Date;
  createdAt: Date;
}

export interface AuditEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
}

// Status enums
export type CardStatus = 
  | 'Staged' 
  | 'Arrived' 
  | 'Available' 
  | 'AllocatedToStream' 
  | 'Sold' 
  | 'ToShip' 
  | 'Packed' 
  | 'Shipped';

export type StreamStatus = 'Draft' | 'Locked' | 'Finalized';
export type BatchStatus = 'Open' | 'Locked' | 'Closed';
export type BatchRowStatus = 'Staged' | 'Arrived' | 'Skipped';
export type UserRole = 'admin' | 'manager' | 'member';
export type UserStatus = 'Active' | 'Disabled';

// UI types
export interface FilterState {
  search: string;
  status?: CardStatus[];
  sport?: string[];
  yearRange?: [number, number];
  priceRange?: [number, number];
}

export interface KPIData {
  inventoryValue: number;
  soldRevenue: number;
  profit: number;
  streamsCount: number;
  avgMargin: number;
  shippingVelocity: number;
}

export interface ChartData {
  date: string;
  revenue: number;
  profit: number;
  margin: number;
}