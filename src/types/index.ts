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
  id: string;
  name: string;
  uploadedBy: string;
  uploadedAt: Date;
  totalRows: number;
  processedRows: number;
  status: BatchStatus;
  filePath?: string;
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