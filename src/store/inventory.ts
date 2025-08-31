import { create } from 'zustand';
import { cardService } from '../services/cardService';
import { handleApiError } from '../utils/errorHandler';
import toast from 'react-hot-toast';
import type { Card, Batch, FilterState } from '../types';

interface InventoryState {
  cards: Card[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: FilterState;
  selectedCard: Card | null;
  isDetailDrawerOpen: boolean;
  setFilters: (filters: Partial<FilterState>) => void;
  fetchCards: () => Promise<void>;
  updateCardStatus: (id: string, status: string, metadata?: any) => Promise<void>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<void>;
  selectCard: (card: Card | null) => void;
  setDetailDrawerOpen: (open: boolean) => void;
}

// Map API status to frontend status
const mapApiStatus = (apiStatus: string): CardStatus => {
  const statusMap: Record<string, CardStatus> = {
    'pending': 'Staged',
    'received': 'Arrived',
    'graded': 'Available',
    'inventory': 'Available',
    'reserved': 'AllocatedToStream',
    'sold': 'Sold',
    'shipped': 'Shipped'
  };
  return statusMap[apiStatus] || 'Staged';
};

// Map frontend status to API status
const mapFrontendStatus = (frontendStatus: CardStatus): string => {
  const statusMap: Record<CardStatus, string> = {
    'Staged': 'pending',
    'Arrived': 'received',
    'Available': 'inventory',
    'AllocatedToStream': 'reserved',
    'Sold': 'sold',
    'ToShip': 'sold',
    'Packed': 'sold',
    'Shipped': 'shipped'
  };
  return statusMap[frontendStatus] || 'pending';
};

export const useInventoryStore = create<InventoryState>((set, get) => ({
  cards: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 25,
    total: 0,
    pages: 0
  },
  filters: { search: '' },
  selectedCard: null,
  isDetailDrawerOpen: false,

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 } // Reset to first page
    }));
    // Fetch cards with new filters
    get().fetchCards();
  },

  fetchCards: async () => {
    set({ loading: true, error: null });
    try {
      const { filters, pagination } = get();
      
      // Build API filters
      const apiFilters: any = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      if (filters.search) apiFilters.search = filters.search;
      if (filters.status && filters.status.length > 0) {
        apiFilters.status = filters.status.map(mapFrontendStatus).join(',');
      }
      if (filters.sport && filters.sport.length > 0) {
        apiFilters.sport = filters.sport.join(',');
      }
      if (filters.yearRange) {
        apiFilters.minYear = filters.yearRange[0];
        apiFilters.maxYear = filters.yearRange[1];
      }
      if (filters.priceRange) {
        apiFilters.minValue = filters.priceRange[0];
        apiFilters.maxValue = filters.priceRange[1];
      }
      
      const result = await cardService.getCards(apiFilters);
      
      if (result.success) {
        const apiCards = result.data.cards || [];
        const cards: Card[] = apiCards.map((apiCard: any) => ({
          id: apiCard._id,
          displayId: apiCard.displayId,
          title: apiCard.cardName,
          player: apiCard.playerName,
          sport: apiCard.sport,
          year: apiCard.year,
          grade: apiCard.grade,
          purchasePrice: apiCard.marketValue || 0,
          currentValue: apiCard.marketValue,
          status: mapApiStatus(apiCard.status),
          createdAt: new Date(apiCard.createdAt),
          updatedAt: new Date(apiCard.updatedAt),
          notes: apiCard.description,
        }));
        
        set({
          cards,
          pagination: result.data.pagination || pagination,
          loading: false,
          error: null
        });
      } else {
        set({ 
          loading: false, 
          error: result.error 
        });
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ 
        loading: false, 
        error: errorMessage 
      });
    }
  },

  updateCardStatus: async (id, status, metadata = {}) => {
    try {
      const apiStatus = mapFrontendStatus(status as CardStatus);
      const result = await cardService.updateCardStatus(id, apiStatus, metadata);
      
      if (result.success) {
        // Update local state
        set((state) => ({
          cards: state.cards.map(card => 
            card.id === id 
              ? { ...card, status: status as CardStatus, updatedAt: new Date() }
              : card
          )
        }));
        toast.success('Card status updated successfully');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  },

  updateCard: async (id, updates) => {
    try {
      const result = await cardService.updateCard(id, updates);
      
      if (result.success) {
        // Update local state
        set((state) => ({
          cards: state.cards.map(card => 
            card.id === id 
              ? { ...card, ...updates, updatedAt: new Date() }
              : card
          )
        }));
        toast.success('Card updated successfully');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  },

  selectCard: (card) => {
    set({ selectedCard: card });
  },

  setDetailDrawerOpen: (open) => {
    set({ isDetailDrawerOpen: open });
    if (!open) {
      set({ selectedCard: null });
    }
  },
}));