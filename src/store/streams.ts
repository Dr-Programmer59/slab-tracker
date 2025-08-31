import { create } from 'zustand';
import { streamService } from '../services/streamService';
import { handleApiError } from '../utils/errorHandler';
import toast from 'react-hot-toast';
import type { Stream } from '../types';

interface StreamsState {
  streams: Stream[];
  loading: boolean;
  error: string | null;
  selectedStream: Stream | null;
  fetchStreams: () => Promise<void>;
  createStream: (streamData: { name: string; description?: string; targetValue?: number }) => Promise<void>;
  finalizeStream: (id: string, pnlData: any) => Promise<void>;
  selectStream: (stream: Stream | null) => void;
}

// Map API status to frontend status
const mapApiStatus = (apiStatus: string): StreamStatus => {
  const statusMap: Record<string, StreamStatus> = {
    'draft': 'Draft',
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
      console.log('🌊 Fetching streams...');
      
      const result = await streamService.getStreams();
      
      if (result.success) {
        const apiStreams = result.data.streams || [];
        const streams: Stream[] = apiStreams.map((apiStream: any) => ({
          id: apiStream._id,
          title: apiStream.name,
          streamer: apiStream.createdBy?.displayName || 'SlabTrack User',
          date: new Date(apiStream.createdAt),
          status: mapApiStatus(apiStream.status),
          totalItems: apiStream.cards?.length || 0,
          totalCost: apiStream.totalValue || 0,
          grossSales: apiStream.soldPrice,
          fees: apiStream.fees,
          profit: apiStream.profit,
          cards: apiStream.cards || [],
          createdAt: new Date(apiStream.createdAt),
          updatedAt: new Date(apiStream.updatedAt),
        }));
        
        console.log('✅ Streams fetched successfully:', streams.length);
        set({ streams, loading: false, error: null });
      } else {
        console.error('❌ Failed to fetch streams:', result.error);
        set({ loading: false, error: result.error });
      }
    } catch (error) {
      console.error('❌ Streams fetch error:', error);
      const errorMessage = handleApiError(error);
      set({ loading: false, error: errorMessage });
    }
  },

  createStream: async (streamData) => {
    try {
      const result = await streamService.createStream(streamData);
      
      if (result.success) {
        const apiStream = result.data.stream;
        const newStream: Stream = {
          id: apiStream._id,
          title: apiStream.name,
          streamer: 'SlabTrack User',
          date: new Date(apiStream.createdAt),
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
        
        toast.success('Stream created successfully');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  },

  finalizeStream: async (id, pnlData) => {
    try {
      const result = await streamService.finalizeStream(id, pnlData);
      
      if (result.success) {
        const apiStream = result.data.stream;
        set((state) => ({
          streams: state.streams.map(stream => 
            stream.id === id 
              ? {
                  ...stream,
                  status: mapApiStatus(apiStream.status),
                  grossSales: apiStream.soldPrice,
                  fees: apiStream.fees,
                  profit: apiStream.profit,
                  updatedAt: new Date(apiStream.updatedAt)
                }
              : stream
          )
        }));
        
        toast.success('Stream finalized successfully');
      } else {
        toast.error(result.error);
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