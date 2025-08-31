import { create } from 'zustand';
import { cardAPI } from '../services/api';
import type { Card, Batch, FilterState } from '../types';

interface InventoryState {
  cards: Card[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pages: number;
    total: number;
  };
  batches: Batch[];
  filters: FilterState;
  selectedCard: Card | null;
  isDetailDrawerOpen: boolean;
  fetchCards: () => Promise<void>;
  setFilters: (filters: Partial<FilterState>) => void;
  addCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCard: (id: string, updates: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  markArrived: (id: string) => void;
  selectCard: (card: Card | null) => void;
  setDetailDrawerOpen: (open: boolean) => void;
  getFilteredCards: () => Card[];
  generateLabel: (cardId: string) => void;
  setPage: (page: number) => void;
}



export const useInventoryStore = create<InventoryState>((set, get) => ({
  cards: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
  batches: [],
  filters: { search: '' },
  selectedCard: null,
  isDetailDrawerOpen: false,

  fetchCards: async () => {
    const { filters, pagination } = get();
    set({ loading: true, error: null });
    
    try {
      const params = {
        page: pagination.page,
        limit: 25,
        search: filters.search || undefined,
        status: filters.status?.length ? filters.status.join(',') : undefined,
        sport: filters.sport?.length ? filters.sport.join(',') : undefined,
        minValue: filters.priceRange?.[0],
        maxValue: filters.priceRange?.[1],
        sortBy: 'createdAt',
        sortOrder: 'desc' as const,
      };
      
      const response = await cardAPI.getCards(params);
      
      // Transform API response to match our Card interface
      const cards: Card[] = response.cards.map((apiCard: any) => ({
        id: apiCard._id,
        displayId: apiCard.displayId,
        title: apiCard.cardName,
        player: apiCard.playerName,
        sport: apiCard.sport,
        year: apiCard.year,
        grade: apiCard.grade ? `${apiCard.gradingCompany} ${apiCard.grade}` : undefined,
        purchasePrice: apiCard.purchasePrice || 0,
        currentValue: apiCard.marketValue || apiCard.customValue,
        status: mapApiStatusToLocal(apiCard.status),
        createdAt: new Date(apiCard.createdAt),
        updatedAt: new Date(apiCard.updatedAt),
        notes: apiCard.notes,
      }));
      
      set({
        cards,
        loading: false,
        pagination: response.pagination,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch cards',
      });
    }
  },
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 }, // Reset to first page
    }));
    // Fetch cards with new filters
    get().fetchCards();
  },

  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page }
    }));
    get().fetchCards();
  },
  addCard: (cardData) => {
    const newCard: Card = {
      ...cardData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      cards: [...state.cards, newCard]
    }));
    // Fetch cards with new filters
    get().fetchCards();
  },

  updateCard: async (id, updates) => {
    try {
      // Optimistic update
      set((state) => ({
        cards: state.cards.map(card => 
          card.id === id 
            ? { ...card, ...updates, updatedAt: new Date() }
            : card
        )
      }));
      
      // API call
      await cardAPI.updateCard(id, updates);
    } catch (error) {
      // Revert optimistic update on error
      get().fetchCards();
      throw error;
    }
  },

  deleteCard: async (id) => {
    try {
      await cardAPI.deleteCard(id);
      set((state) => ({
        cards: state.cards.filter(card => card.id !== id),
        selectedCard: state.selectedCard?.id === id ? null : state.selectedCard
      }));
    } catch (error) {
      throw error;
    }
  },

  markArrived: async (id) => {
    try {
      await cardAPI.updateCardStatus(id, 'received', {
        receivedDate: new Date().toISOString(),
      });
      
      const { updateCard } = get();
      updateCard(id, { 
        status: 'Arrived',
        arrivedAt: new Date()
      });
    } catch (error) {
      throw error;
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

  getFilteredCards: () => {
    const { cards, filters } = get();
    return cards.filter(card => {
      if (filters.search && !card.title.toLowerCase().includes(filters.search.toLowerCase()) && !card.player.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.status && filters.status.length > 0 && !filters.status.includes(card.status)) {
        return false;
      }
      if (filters.sport && filters.sport.length > 0 && !filters.sport.includes(card.sport)) {
        return false;
      }
      if (filters.priceRange && (card.currentValue < filters.priceRange[0] || card.currentValue > filters.priceRange[1])) {
        return false;
      }
      if (filters.yearRange && (card.year < filters.yearRange[0] || card.year > filters.yearRange[1])) {
        return false;
      }
      return true;
    });
  },

  generateLabel: async (cardId) => {
    try {
      const response = await cardAPI.generateLabel(cardId);
      // Open label URL in new tab for printing
      if (response.labelUrl) {
        window.open(response.labelUrl, '_blank');
      }
    } catch (error) {
      throw error;
    }
  },
}));

// Helper function to map API status to local status
function mapApiStatusToLocal(apiStatus: string): Card['status'] {
  const statusMap: Record<string, Card['status']> = {
    'pending': 'Staged',
    'received': 'Arrived',
    'graded': 'Available',
    'inventory': 'Available',
    'reserved': 'AllocatedToStream',
    'sold': 'Sold',
    'shipped': 'Shipped',
  };
  
  return statusMap[apiStatus] || 'Staged';
}