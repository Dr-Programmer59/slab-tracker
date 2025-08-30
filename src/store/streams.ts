import { create } from 'zustand';
import { apiService } from '../services/api';
import type { Stream } from '../types';
import toast from 'react-hot-toast';

interface StreamsState {
  streams: Stream[];
  selectedStream: Stream | null;
  loading: boolean;
  fetchStreams: () => Promise<void>;
  createStream: (stream: Omit<Stream, 'id' | 'createdAt' | 'updatedAt' | 'cards'>) => void;
  updateStream: (id: string, updates: Partial<Stream>) => void;
  lockStream: (id: string) => void;
  finalizeStream: (id: string, grossSales: number, fees: number) => void;
  selectStream: (stream: Stream | null) => void;
  addCardsToStream: (streamId: string, cardIds: string[]) => Promise<void>;
}


export const useStreamsStore = create<StreamsState>((set, get) => ({
  streams: [],
  selectedStream: null,
  loading: false,

  fetchStreams: async () => {
    set({ loading: true });
    try {
      const { streams } = await apiService.getStreams();
      set({ streams, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to fetch streams');
    }
  },
  createStream: async (streamData) => {
    try {
      const { stream } = await apiService.createStream(streamData);
      set((state) => ({
        streams: [...state.streams, stream]
      }));
      toast.success('Stream created successfully');
    } catch (error) {
      toast.error('Failed to create stream');
    }
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
    toast.success('Stream locked successfully');
  },

  finalizeStream: async (id, grossSales, fees) => {
    try {
      const { stream } = await apiService.finalizeStream(id);
      set((state) => ({
        streams: state.streams.map(s => s.id === id ? stream : s)
      }));
      toast.success('Stream finalized successfully');
    } catch (error) {
      toast.error('Failed to finalize stream');
    }
  },

  selectStream: (stream) => {
    set({ selectedStream: stream });
  },

  addCardsToStream: async (streamId, cardIds) => {
    try {
      const { stream, addedCount } = await apiService.addCardsToStream(streamId, cardIds);
      set((state) => ({
        streams: state.streams.map(s => s.id === streamId ? stream : s)
      }));
      toast.success(`Added ${addedCount} cards to stream`);
    } catch (error) {
      toast.error('Failed to add cards to stream');
    }
  },
}));