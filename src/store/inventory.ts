import { create } from 'zustand';
import type { Card, Batch, FilterState } from '../types';

interface InventoryState {
  cards: Card[];
  batches: Batch[];
  filters: FilterState;
  selectedCard: Card | null;
  isDetailDrawerOpen: boolean;
  setFilters: (filters: Partial<FilterState>) => void;
  addCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCard: (id: string, updates: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  markArrived: (id: string) => void;
  selectCard: (card: Card | null) => void;
  setDetailDrawerOpen: (open: boolean) => void;
  getFilteredCards: () => Card[];
  generateLabel: (cardId: string) => void;
}

// Demo data
const demoCards: Card[] = [
  {
    id: '1',
    displayId: 'ST-2024-000001',
    title: '2023 Topps Chrome',
    player: 'Ronald Acuña Jr.',
    sport: 'Baseball',
    year: 2023,
    grade: 'PSA 10',
    purchasePrice: 125.00,
    currentValue: 180.00,
    status: 'Available',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    imageUrl: 'https://images.pexels.com/photos/262506/pexels-photo-262506.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    displayId: 'ST-2024-000002',
    title: '2022 Panini Prizm',
    player: 'Ja Morant',
    sport: 'Basketball',
    year: 2022,
    grade: 'BGS 9.5',
    purchasePrice: 85.00,
    currentValue: 120.00,
    status: 'Sold',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    displayId: 'ST-2024-000003',
    title: '2023 Bowman Chrome',
    player: 'Gunnar Henderson',
    sport: 'Baseball',
    year: 2023,
    grade: 'PSA 9',
    purchasePrice: 45.00,
    currentValue: 65.00,
    status: 'AllocatedToStream',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
  },
];

const demoBatches: Batch[] = [
  {
    id: '1',
    name: 'January 2024 Import',
    uploadedBy: 'admin@slabtrack.com',
    uploadedAt: new Date('2024-01-15'),
    totalRows: 25,
    processedRows: 23,
    status: 'Open',
  },
  {
    id: '2',
    name: 'December 2023 Import',
    uploadedBy: 'manager@slabtrack.com',
    uploadedAt: new Date('2023-12-28'),
    totalRows: 18,
    processedRows: 18,
    status: 'Locked',
  },
];

export const useInventoryStore = create<InventoryState>((set, get) => ({
  cards: demoCards,
  batches: demoBatches,
  filters: { search: '' },
  selectedCard: null,
  isDetailDrawerOpen: false,

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
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
  },

  updateCard: (id, updates) => {
    set((state) => ({
      cards: state.cards.map(card => 
        card.id === id 
          ? { ...card, ...updates, updatedAt: new Date() }
          : card
      )
    }));
  },

  deleteCard: (id) => {
    set((state) => ({
      cards: state.cards.filter(card => card.id !== id),
      selectedCard: state.selectedCard?.id === id ? null : state.selectedCard
    }));
  },

  markArrived: (id) => {
    const { updateCard } = get();
    updateCard(id, { 
      status: 'Arrived',
      arrivedAt: new Date()
    });
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
      if (filters.search && !card.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !card.player.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.status && filters.status.length > 0 && !filters.status.includes(card.status)) {
        return false;
      }
      if (filters.sport && filters.sport.length > 0 && !filters.sport.includes(card.sport)) {
        return false;
      }
      if (filters.yearRange && (card.year < filters.yearRange[0] || card.year > filters.yearRange[1])) {
        return false;
      }
      if (filters.priceRange && (card.purchasePrice < filters.priceRange[0] || card.purchasePrice > filters.priceRange[1])) {
        return false;
      }
      return true;
    });
  },

  generateLabel: (cardId) => {
    // In real app, this would generate and open a PDF label
    console.log('Generating label for card:', cardId);
  },
}));