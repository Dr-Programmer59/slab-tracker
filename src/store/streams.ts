import { create } from 'zustand';
import { streamAPI } from '../services/api';
import type { Stream } from '../types';

interface StreamsState {
  streams: Stream[];
  loading: boolean;
  error: string | null;
  selectedStream: Stream | null;
  fetchStreams: () => Promise<void>;
  createStream: (stream: Omit<Stream, 'id' | 'createdAt' | 'updatedAt' | 'cards'>) => void;
  updateStream: (id: string, updates: Partial<Stream>) => void;
  lockStream: (id: string) => void;
  finalizeStream: (id: string, grossSales: number, fees: number) => void;
  selectStream: (stream: Stream | null) => void;
  addCardToStream: (streamId: string, cardDisplayId: string) => Promise<void>;
}

      
      set({ streams, loading: false });
  streams: [],
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch streams',
      });
    }
  },

  createStream: async (streamData) => {
    try {
      const response = await streamAPI.createStream({
        name: streamData.title,
        description: `Stream by ${streamData.streamer}`,
        targetValue: streamData.totalCost,
      });
      
      const newStream: Stream = {
        id: response.stream._id,
        title: response.stream.name,
        streamer: streamData.streamer,
        date: new Date(response.stream.createdAt),
        status: 'Draft',
  fetchStreams: async () => {
    set({ loading: true, error: null });
    try {
      const response = await streamAPI.getStreams();
      
      // Transform API response to match our Stream interface
      const streams: Stream[] = response.streams.map((apiStream: any) => ({
        id: apiStream._id,
        title: apiStream.name,
        streamer: 'CardBreaker Pro', // Default for now
        date: new Date(apiStream.createdAt),
        status: mapApiStatusToLocal(apiStream.status),
        totalItems: apiStream.cardCount,
        totalCost: apiStream.currentValue || 0,
        grossSales: apiStream.profitLoss?.totalRevenue,
        fees: apiStream.profitLoss?.totalRevenue ? 
              (apiStream.profitLoss.totalRevenue - apiStream.profitLoss.netProfit - apiStream.currentValue) : undefined,
        profit: apiStream.profitLoss?.netProfit,
        cards: [],
        createdAt: new Date(apiStream.createdAt),
        updatedAt: new Date(apiStream.updatedAt || apiStream.createdAt),
      }));
      
      set({ streams, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch streams',
      });
    }
        createdAt: new Date(response.stream.createdAt),
        updatedAt: new Date(response.stream.createdAt),
      streams: state.streams.map(stream => 
        stream.id === id 
          ? { ...stream, ...updates, updatedAt: new Date() }
          : stream
  createStream: async (streamData) => {
    try {
      const response = await streamAPI.createStream({
        name: streamData.title,
        description: `Stream by ${streamData.streamer}`,
        targetValue: streamData.totalCost,
      });
      
      const newStream: Stream = {
        id: response.stream._id,
        title: response.stream.name,
        streamer: streamData.streamer,
        date: new Date(response.stream.createdAt),
        status: 'Draft',
        totalItems: 0,
        totalCost: 0,
        cards: [],
        createdAt: new Date(response.stream.createdAt),
        updatedAt: new Date(response.stream.createdAt),
      };
      
      set((state) => ({
        streams: [...state.streams, newStream]
      }));
    } catch (error) {
      throw error;
    }
  },

  lockStream: async (id) => {
    try {
      await streamAPI.lockStream(id);
      const { updateStream } = get();
      updateStream(id, { status: 'Locked' });
    } catch (error) {
      throw error;
    }
  },

  finalizeStream: async (id, grossSales, fees) => {
    try {
      const { streams } = get();
      const stream = streams.find(s => s.id === id);
      if (stream) {
        const finalizationData = {
          soldPrice: grossSales,
          fees,
          shippingCost: 0,
          buyerInfo: {
            name: 'Buyer',
            email: 'buyer@example.com',
            address: {
              street: '123 Main St',
              city: 'City',
              state: 'ST',
              zipCode: '12345',
              country: 'US'
            }
          },
  lockStream: async (id) => {
    try {
      await streamAPI.lockStream(id);
      const { updateStream } = get();
      updateStream(id, { status: 'Locked' });
    } catch (error) {
      throw error;
    }
        await streamAPI.finalizeStream(id, finalizationData);
        
  finalizeStream: async (id, grossSales, fees) => {
    try {
      const { streams } = get();
      const stream = streams.find(s => s.id === id);
      if (stream) {
        const finalizationData = {
          soldPrice: grossSales,
          fees,
          shippingCost: 0,
          buyerInfo: {
            name: 'Buyer',
            email: 'buyer@example.com',
            address: {
              street: '123 Main St',
              city: 'City',
              state: 'ST',
              zipCode: '12345',
              country: 'US'
            }
          },
          notes: 'Stream finalized'
        };
        
        await streamAPI.finalizeStream(id, finalizationData);
        
        const profit = grossSales - fees - stream.totalCost;
        const { updateStream } = get();
        updateStream(id, {
          status: 'Finalized',
          grossSales,
          fees,
          profit,
        });
      }
    } catch (error) {
      throw error;
    }
  },

  selectStream: (stream) => {
    set({ selectedStream: stream });
  },

  addCardToStream: async (streamId, cardDisplayId) => {
    try {
      await streamAPI.addCardToStream(streamId, cardDisplayId);
      // Refresh streams to get updated data
      get().fetchStreams();
    } catch (error) {
      throw error;
    }
      // Refresh streams to get updated data
      get().fetchStreams();
    } catch (error) {
      throw error;
    }
  },

// Helper function to map API status to local status
function mapApiStatusToLocal(apiStatus: string): Stream['status'] {
  const statusMap: Record<string, Stream['status']> = {
    'building': 'Draft',
    'draft': 'Draft',
    'active': 'Locked',
    'completed': 'Finalized',
    'finalized': 'Finalized',
  };
  
  return statusMap[apiStatus] || 'Draft';
}