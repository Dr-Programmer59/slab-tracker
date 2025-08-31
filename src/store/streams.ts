import { create } from 'zustand';
import type { Stream } from '../types';

interface StreamsState {
  streams: Stream[];
  selectedStream: Stream | null;
  createStream: (stream: Omit<Stream, 'id' | 'createdAt' | 'updatedAt' | 'cards'>) => void;
  updateStream: (id: string, updates: Partial<Stream>) => void;
  lockStream: (id: string) => void;
  finalizeStream: (id: string, grossSales: number, fees: number) => void;
  selectStream: (stream: Stream | null) => void;
}

const demoStreams: Stream[] = [
  {
    id: '1',
    title: 'January 2024 Live Break',
    streamer: 'CardBreaker Pro',
    date: new Date('2024-01-20'),
    status: 'Draft',
    totalItems: 8,
    totalCost: 450.00,
    cards: [],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    title: 'Holiday Special Stream',
    streamer: 'CardBreaker Pro',
    date: new Date('2023-12-25'),
    status: 'Finalized',
    totalItems: 12,
    totalCost: 680.00,
    grossSales: 920.00,
    fees: 45.00,
    profit: 195.00,
    cards: [],
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2023-12-26'),
  },
];

export const useStreamsStore = create<StreamsState>((set, get) => ({
  streams: demoStreams,
  selectedStream: null,

  createStream: (streamData) => {
    const newStream: Stream = {
      ...streamData,
      id: Math.random().toString(36).substr(2, 9),
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      streams: [...state.streams, newStream]
    }));
  },

  updateStream: (id, updates) => {
    set((state) => ({
      streams: state.streams.map(stream => 
        stream.id === id 
          ? { ...stream, ...updates, updatedAt: new Date() }
          : stream
      )
    }));
  },

  lockStream: (id) => {
    const { updateStream } = get();
    updateStream(id, { status: 'Locked' });
  },

  finalizeStream: (id, grossSales, fees) => {
    const { streams, updateStream } = get();
    const stream = streams.find(s => s.id === id);
    if (stream) {
      const profit = grossSales - fees - stream.totalCost;
      updateStream(id, {
        status: 'Finalized',
        grossSales,
        fees,
        profit,
      });
    }
  },

  selectStream: (stream) => {
    set({ selectedStream: stream });
  },
}));