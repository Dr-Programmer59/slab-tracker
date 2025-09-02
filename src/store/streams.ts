import { create } from 'zustand';
import { streamService } from '../services/streamService';
import { handleApiError } from '../utils/errorHandler';
import toast from 'react-hot-toast';
import type { Stream, StreamStatus } from '../types';

interface StreamsState {
  streams: Stream[];
  loading: boolean;
  error: string | null;
  selectedStream: Stream | null;
  fetchStreams: () => Promise<void>;
  createStream: (streamData: { title: string; description?: string; targetValue?: number }) => Promise<void>;
  lockStream: (id: string) => void;
  finalizeStream: (id: string, grossSales: number, fees: number) => Promise<void>;
  selectStream: (stream: Stream | null) => void;
}

const mapApiStatus = (apiStatus: string): StreamStatus => {
  const statusMap: Record<string, StreamStatus> = {
    'Draft': 'Draft',
    'draft': 'Draft',
    'Locked': 'Locked',
    'locked': 'Locked',
    'Finalized': 'Finalized',
    'finalized': 'Finalized'
  };
  return statusMap[apiStatus] || 'Draft';
};

export const useStreamsStore = create<StreamsState>((set, get) => ({
  streams: [],
  loading: false,
  error: null,
  selectedStream: null,

  fetchStreams: async () => {
    set({ loading: true, error: null });
    try {
      const result = await streamService.getStreams();
      
      if (result.success && result.data) {
        // Access the exact API response structure: result.data.streams
        const apiStreams = result.data.items || [];
        const streams: Stream[] = apiStreams.map((apiStream: any) => ({
          id: apiStream.id,
          title: apiStream.title,
          streamer: apiStream.streamerName || 'SlabTrack User',
          date: new Date(apiStream.date || apiStream.createdAt),
          status: mapApiStatus(apiStream.status),
          totalItems: apiStream.cardCount || 0,
          totalCost: apiStream.totalValue || 0,
          grossSales: apiStream.grossSales,
          fees: apiStream.fees,
          profit: apiStream.profit,
          cards: apiStream.cards || [],
          createdAt: new Date(apiStream.createdAt),
          updatedAt: new Date(apiStream.updatedAt),
        }));
        
        set({ streams, loading: false, error: null });
      } else {
        set({ loading: false, error: result.error || 'Failed to fetch streams' });
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ loading: false, error: errorMessage });
    }
  },

  createStream: async (streamData) => {
    try {
      const result = await streamService.createStream(streamData);
      
      if (result.success && result.data) {
        // Access the exact API response structure: result.data.stream
        const apiStream = result.data.stream;
        const newStream: Stream = {
          id: apiStream._id,
          title: apiStream.title,
          streamer: 'SlabTrack User',
          date: new Date(apiStream.date || apiStream.createdAt),
          status: mapApiStatus(apiStream.status),
          totalItems: apiStream.cardCount || 0,
          totalCost: apiStream.totalValue || 0,
          cards: apiStream.cards || [],
          createdAt: new Date(apiStream.createdAt),
          updatedAt: new Date(apiStream.updatedAt),
        };
        
        set((state) => ({
          streams: [...state.streams, newStream]
        }));
        
        toast.success(result.data.message || 'Stream created successfully');
      } else {
        toast.error(result.error || 'Failed to create stream');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  },

  lockStream: (id) => {
    set((state) => ({
      streams: state.streams.map(stream => 
        stream.id === id 
          ? { ...stream, status: 'Locked' as StreamStatus }
          : stream
      )
    }));
    toast.success('Stream locked successfully');
  },

  finalizeStream: async (id, grossSales, fees) => {
    try {
      const pnlData = {
        grossSales: grossSales,
        fees: fees,
        shippingCost: 0,
        notes: ''
      };
      
      const result = await streamService.finalizeStream(id, pnlData);
      
      if (result.success && result.data) {
        // Access the exact API response structure: result.data.stream
        const apiStream = result.data.stream;
        set((state) => ({
          streams: state.streams.map(stream => 
            stream.id === id 
              ? {
                  ...stream,
                  status: mapApiStatus(apiStream.status),
                  grossSales: apiStream.grossSales,
                  fees: apiStream.fees,
                  profit: apiStream.profit,
                  updatedAt: new Date(apiStream.updatedAt)
                }
              : stream
          )
        }));
        
        toast.success(result.data.message || 'Stream finalized successfully');
      } else {
        toast.error(result.error || 'Failed to finalize stream');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  },

  selectStream: (stream) => {
    set({ selectedStream: stream });
  },
}));