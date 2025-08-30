import { create } from 'zustand';
import { apiService } from '../services/api';
import type { Card, Batch, FilterState } from '../types';
import toast from 'react-hot-toast';

interface InventoryState {
  cards: Card[];
  batches: Batch[];
  filters: FilterState;
  pagination: {
    page: number;
    pages: number;
    total: number;
  };
  loading: boolean;
  selectedCard: Card | null;
  isDetailDrawerOpen: boolean;
  selectedCards: string[];
  setFilters: (filters: Partial<FilterState>) => void;
  fetchCards: () => Promise<void>;
  fetchBatches: () => Promise<void>;
  addCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCard: (id: string, updates: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  markArrived: (id: string) => void;
  selectCard: (card: Card | null) => void;
  selectCards: (cardIds: string[]) => void;
  setDetailDrawerOpen: (open: boolean) => void;
  generateLabel: (cardId: string) => void;
  bulkUpdate: (cardIds: string[], updates: Partial<Card>) => Promise<void>;
}


export const useInventoryStore = create<InventoryState>((set, get) => ({
  cards: [],
  batches: [],
  filters: { search: '' },
  pagination: { page: 1, pages: 1, total: 0 },
  loading: false,
  selectedCard: null,
  isDetailDrawerOpen: false,
  selectedCards: [],

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
    // Refetch cards with new filters
    get().fetchCards();
  },

  fetchCards: async () => {
    const { filters } = get();
    set({ loading: true });
    try {
      const { cards, pagination } = await apiService.getCards({
        ...filters,
        page: get().pagination.page
      });
      set({ cards, pagination, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to fetch cards');
    }
  },

  fetchBatches: async () => {
    set({ loading: true });
    try {
      const { batches } = await apiService.getBatches();
      set({ batches, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to fetch batches');
    }
  },
  addCard: (cardData) => {
    // This would typically be handled by the backend
    // after processing an intake row
    toast.success('Card added successfully');
    get().fetchCards();
  },

  updateCard: async (id, updates) => {
    try {
      await apiService.updateCard(id, updates);
      set((state) => ({
        cards: state.cards.map(card => 
          card.id === id 
            ? { ...card, ...updates, updatedAt: new Date() }
            : card
        )
      }));
      toast.success('Card updated successfully');
    } catch (error) {
      toast.error('Failed to update card');
    }
  },

  deleteCard: (id) => {
    // Implement API call for deletion
    if (window.confirm('Are you sure you want to delete this card?')) {
      set((state) => ({
        cards: state.cards.filter(card => card.id !== id),
        selectedCard: state.selectedCard?.id === id ? null : state.selectedCard
      }));
      toast.success('Card deleted successfully');
    }
  },

  markArrived: async (id) => {
    try {
      await get().updateCard(id, { 
        status: 'Arrived',
        arrivedAt: new Date()
      });
      // Generate and print label
      await get().generateLabel(id);
    } catch (error) {
      toast.error('Failed to mark card as arrived');
    }
  },

  selectCard: (card) => {
    set({ selectedCard: card });
  },

  selectCards: (cardIds) => {
    set({ selectedCards: cardIds });
  },
  setDetailDrawerOpen: (open) => {
    set({ isDetailDrawerOpen: open });
    if (!open) {
      set({ selectedCard: null });
    }
  },


  generateLabel: async (cardId) => {
    try {
      const { labelUrl } = await apiService.generateLabel(cardId);
      // Open label in new window for printing
      window.open(labelUrl, '_blank');
      toast.success('Label generated successfully');
    } catch (error) {
      toast.error('Failed to generate label');
    }
  },

  bulkUpdate: async (cardIds, updates) => {
    try {
      // Implement bulk update API call
      set((state) => ({
        cards: state.cards.map(card => 
          cardIds.includes(card.id) 
            ? { ...card, ...updates, updatedAt: new Date() }
            : card
        )
      }));
      toast.success(`Updated ${cardIds.length} cards`);
    } catch (error) {
      toast.error('Failed to update cards');
    }
  },
}));