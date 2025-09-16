import { create } from 'zustand';
import { cardService } from '../services/cardService';
import { handleApiError } from '../utils/errorHandler';
import { config } from '../utils/config';
import toast from 'react-hot-toast';
import type { Card, FilterState, CardStatus } from '../types';

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
  initializeCards: () => Promise<void>;
  setFilters: (filters: Partial<FilterState>) => void;
  fetchCards: () => Promise<void>;
  updateCardStatus: (id: string, status: string, metadata?: any) => Promise<void>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<void>;
  addCard: (cardData: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  generateLabel: (id: string) => void;
  selectCard: (card: Card | null) => void;
  setDetailDrawerOpen: (open: boolean) => void;
}

const mapApiStatus = (apiStatus: string): CardStatus => {
  const statusMap: Record<string, CardStatus> = {
    'pending': 'Staged',
    'received': 'Arrived',
    'graded': 'Available',
    'inventory': 'Available',
    'Available': 'Available',
    'reserved': 'AllocatedToStream',
    'AllocatedToStream': 'AllocatedToStream',
    'sold': 'Sold',
    'Sold': 'Sold',
    'ToShip': 'ToShip',
    'Packed': 'Packed',
    'shipped': 'Shipped',
    'Shipped': 'Shipped'
  };
  return statusMap[apiStatus] || 'Staged';
};

const mapFrontendStatus = (frontendStatus: CardStatus): string => {
  const statusMap: Record<CardStatus, string> = {
    'Staged': 'pending',
    'Arrived': 'received',
    'Available': 'Available',
    'AllocatedToStream': 'AllocatedToStream',
    'Sold': 'Sold',
    'ToShip': 'ToShip',
    'Packed': 'Packed',
    'Shipped': 'Shipped'
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

  // Always initialize cards data - force refresh on app load
  initializeCards: async () => {
    await get().fetchCards();
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 }
    }));
    get().fetchCards();
  },

  fetchCards: async () => {
    set({ loading: true, error: null });
    try {
      const { filters, pagination } = get();
      
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
        apiFilters.year = filters.yearRange[0];
      }
      if (filters.priceRange) {
        apiFilters.minValue = filters.priceRange[0];
        apiFilters.maxValue = filters.priceRange[1];
      }
      
      const result = await cardService.getCards(apiFilters);
      
      if (result.success && result.data) {
        // Access the exact API response structure: result.data.cards and result.data.pagination
        const apiCards = result.data.items || [];
        const cards: Card[] = apiCards.map((apiCard: any) => ({
          id: apiCard._id,
          displayId: apiCard.displayId,
          title: apiCard.title || 'Unknown Card',
          player: apiCard.player,
          sport: apiCard.sport,
          year: apiCard.year,
          grade: apiCard.gradingCompany && apiCard.grade ? `${apiCard.gradingCompany} ${apiCard.grade}` : apiCard.grade,
          purchasePrice: apiCard.purchasePrice || 0,
          currentValue: apiCard.currentValue,
          status: apiCard.status,
          ownership: apiCard.ownership || 'Owned',
          consignorId: apiCard.consignorId,
          consignorName: apiCard.consignorName,
          consignmentTerms: apiCard.consignmentTerms,
          payoutStatus: apiCard.payoutStatus || 'None',
          payoutDetails: apiCard.payoutDetails,
          createdAt: new Date(apiCard.createdAt),
          updatedAt: new Date(apiCard.updatedAt),
          notes: apiCard.description || '',
          imageUrl: apiCard.imageUrl,
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
          error: result.error || 'Failed to fetch cards'
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
      
      if (result.success && result.data) {
        // Access the exact API response structure: result.data.card
        const updatedCard = result.data.card;
        set((state) => ({
          cards: state.cards.map(card => 
            card.id === id 
              ? { ...card, status: mapApiStatus(updatedCard.status), updatedAt: new Date(updatedCard.updatedAt) }
              : card
          )
        }));
        toast.success(result.data.message || 'Card status updated successfully');
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  },

  updateCard: async (id, updates) => {
    try {
      const result = await cardService.updateCard(id, updates);
      
      if (result.success && result.data) {
        // Access the exact API response structure: result.data.card
        const updatedCard = result.data.card;
        const mappedCard = {
          id: updatedCard._id,
          displayId: updatedCard.displayId,
          title: updatedCard.title,
          player: updatedCard.player,
          sport: updatedCard.sport,
          year: updatedCard.year,
          grade: updatedCard.gradingCompany && updatedCard.grade ? `${updatedCard.gradingCompany} ${updatedCard.grade}` : updatedCard.grade,
          purchasePrice: updatedCard.purchasePrice,
          currentValue: updatedCard.currentValue,
          status: mapApiStatus(updatedCard.status),
          createdAt: new Date(updatedCard.createdAt),
          updatedAt: new Date(updatedCard.updatedAt),
          notes: updatedCard.description || '',
          imageUrl: updatedCard.imageUrl,
        };
        
        set((state) => ({
          cards: state.cards.map(card => 
            card.id === id ? mappedCard : card
          )
        }));
        toast.success(result.data.message || 'Card updated successfully');
      } else {
        toast.error(result.error || 'Failed to update card');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  },

  addCard: (cardData) => {
    const newCard: Card = {
      id: Math.random().toString(36).substr(2, 9),
      displayId: cardData.displayId || `ST-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
      title: cardData.title || '',
      player: cardData.player || '',
      sport: cardData.sport || 'Baseball',
      year: cardData.year || new Date().getFullYear(),
      grade: cardData.grade,
      purchasePrice: cardData.purchasePrice || 0,
      currentValue: cardData.currentValue,
      status: (cardData.status as CardStatus) || 'Staged',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: cardData.notes,
      imageUrl: cardData.imageUrl,
    };

    set((state) => ({
      cards: [newCard, ...state.cards]
    }));
  },

  deleteCard: (id) => {
    set((state) => ({
      cards: state.cards.filter(card => card.id !== id)
    }));
  },

  generateLabel: (id) => {
    const { cards } = get();
    const card = cards.find(c => c.id === id);
    if (card) {
      // Open the PDF label from backend storage
      const labelUrl = config.getLabelUrl(card.displayId);
      window.open(labelUrl, '_blank');
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