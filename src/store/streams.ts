import { create } from 'zustand';
import { streamService } from '../services/streamService';
import { handleApiError } from '../utils/errorHandler';
import toast from 'react-hot-toast';
import type { Stream, StreamStatus } from '../types';

interface StreamsState {
  streams: Stream[];
  currentStream: any | null;
  streamItems: any[];
  loading: boolean;
  error: string | null;
  itemsLoading: boolean;
  selectedStream: Stream | null;
  fetchStreams: () => Promise<void>;
  fetchStreamDetails: (id: string) => Promise<void>;
  fetchStreamItems: (id: string) => Promise<void>;
  createStream: (streamData: { name: string; description?: string; targetValue?: number }) => Promise<void>;
  addCardToStream: (streamId: string, displayId: string) => Promise<boolean>;
  removeCardFromStream: (streamId: string, cardId: string) => Promise<void>;
  lockStream: (id: string) => Promise<void>;
  finalizeStream: (id: string, grossSales: number, fees: number, bulkSale?: boolean) => Promise<void>;
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
  currentStream: null,
  streamItems: [],
  loading: false,
  error: null,
  itemsLoading: false,
  selectedStream: null,

  fetchStreams: async () => {
    set({ loading: true, error: null });
    try {
      const result = await streamService.getStreams();
      // console.log(result,"result in fetch streams")
      if ( result.data.data.items) {
        // Access the exact API response structure: result.data.data (array) and result.data.pagination
        const apiStreams = result.data.data.items || [];
        // console.log(apiStreams,"api streams")
        const streams: Stream[] = apiStreams.map((apiStream: any) => ({
          id: apiStream.id || apiStream._id,
          title: apiStream.title,
          streamer: apiStream.streamerUserId?.displayName || 'SlabTrack User',
          date: new Date(apiStream.date || apiStream.createdAt),
          status: mapApiStatus(apiStream.status),
          totalItems: apiStream.totalItems || 0,
          totalCost: apiStream.totalValue || 0,
          grossSales: apiStream.grossSales,
          fees: apiStream.fees,
          profit: apiStream.profit,
          cards: [],
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

  fetchStreamDetails: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const result = await streamService.getStreamDetails(id);
      console.log(result,"in store ")
      if (result.success && result.data) {
        const apiStream = result.data;
        const stream = {
          id: apiStream._id,
          title: apiStream.title,
          description: apiStream.description,
          targetValue: apiStream.targetValue,
          streamer: apiStream.streamerUserId?.displayName || 'SlabTrack User',
          streamerUserId: apiStream.streamerUserId?._id,
          date: new Date(apiStream.date),
          status: mapApiStatus(apiStream.status),
          totalItems: apiStream.totalItems || 0,
          totalCost: apiStream.totalValue || 0,
          grossSales: apiStream.grossSales,
          fees: apiStream.fees,
          profit: apiStream.profit,
          bulkSale: apiStream.bulkSale,
          items: apiStream.items || [],
          lockedAt: apiStream.lockedAt ? new Date(apiStream.lockedAt) : null,
          lockedBy: apiStream.lockedBy,
          finalizedAt: apiStream.finalizedAt ? new Date(apiStream.finalizedAt) : null,
          finalizedBy: apiStream.finalizedBy,
          createdAt: new Date(apiStream.createdAt),
          updatedAt: new Date(apiStream.updatedAt),
        };
        
        set({ currentStream: stream, loading: false, error: null });
      } else {
        set({ loading: false, error: result.error || 'Failed to fetch stream details' });
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ loading: false, error: errorMessage });
    }
  },

  fetchStreamItems: async (id: string) => {
    set({ itemsLoading: true });
    try {
      const result = await streamService.getStreamItems(id);
      console.log(result,"in stream add card")
      
      if (result.data) {
        set({ streamItems: result.data.data.items || [], itemsLoading: false });
      } else {
        set({ itemsLoading: false });
        toast.error(result.error || 'Failed to fetch stream items');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ itemsLoading: false });
      toast.error(errorMessage);
    }
  },

  createStream: async (streamData) => {
    try {
      const result = await streamService.createStream(streamData);
      
      if (result.success && result.data) {
        const apiStream = result.data;
        const newStream: Stream = {
          id: apiStream.id,
          title: apiStream.title,
          streamer: 'SlabTrack User',
          date: new Date(apiStream.date || apiStream.createdAt),
          status: mapApiStatus(apiStream.status),
          totalItems: apiStream.totalItems || 0,
          totalCost: apiStream.totalValue || 0,
          cards: [],
          createdAt: new Date(apiStream.createdAt),
          updatedAt: new Date(apiStream.updatedAt),
        };
        
        set((state) => ({
          streams: [...state.streams, newStream]
        }));
        
        toast.success('Stream created successfully');
      } else {
        toast.error(result.error || 'Failed to create stream');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  },

  addCardToStream: async (streamId: string, displayId: string): Promise<boolean> => {
    try {
      const result = await streamService.addCardToStream(streamId, displayId);
      if (result.success && result.data) {
        const { item, stream, message } = result.data;
        
        // Update current stream if it's the same one
        set((state) => {
          if (state.currentStream?.id === streamId) {
            return {
              currentStream: {
                ...state.currentStream,
                totalItems: stream.totalItems,
                totalCost: stream.totalValue,
                items: [...(state.currentStream.items || []), item]
              }
            };
          }
          return state;
        });
        
        // Update streams list
        set((state) => ({
          streams: state.streams.map(s => 
            s.id === streamId 
              ? { ...s, totalItems: stream.totalItems, totalCost: stream.totalValue }
              : s
          )
        }));
        
        toast.success(message || 'Card added to stream');
        return true;
      } else {
        toast.error(result.error || 'Failed to add card to stream');
        return false;
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      return false;
    }
  },

  removeCardFromStream: async (streamId: string, cardId: string) => {
    try {
      const result = await streamService.removeCardFromStream(streamId, cardId);
      
      if (result.success && result.data) {
        const { stream, message } = result.data;
        
        // Update current stream
        set((state) => {
          if (state.currentStream?.id === streamId) {
            return {
              currentStream: {
                ...state.currentStream,
                totalItems: stream.totalItems,
                totalCost: stream.totalValue,
                items: state.currentStream.items?.filter(item => item.cardId !== cardId) || []
              }
            };
          }
          return state;
        });
        
        // Update streams list
        set((state) => ({
          streams: state.streams.map(s => 
            s.id === streamId 
              ? { ...s, totalItems: stream.totalItems, totalCost: stream.totalValue }
              : s
          )
        }));
        
        toast.success(message || 'Card removed from stream');
      } else {
        toast.error(result.error || 'Failed to remove card from stream');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  },

  lockStream: async (id: string) => {
    try {
      const result = await streamService.lockStream(id);
      
      if (result.success && result.data) {
        const { stream, message } = result.data;
        
        // Update current stream
        set((state) => {
          if (state.currentStream?.id === id) {
            return {
              currentStream: {
                ...state.currentStream,
                status: mapApiStatus(stream.status),
                lockedAt: stream.lockedAt ? new Date(stream.lockedAt) : null,
                lockedBy: stream.lockedBy
              }
            };
          }
          return state;
        });
        
        // Update streams list
        set((state) => ({
          streams: state.streams.map(s => 
            s.id === id 
              ? { ...s, status: mapApiStatus(stream.status) }
              : s
          )
        }));
        
        toast.success(message || 'Stream locked successfully');
      } else {
        toast.error(result.error || 'Failed to lock stream');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  },

  finalizeStream: async (id: string, grossSales: number, fees: number, bulkSale: boolean = false) => {
    try {
      const result = await streamService.finalizeStream(id, { grossSales, fees, bulkSale });
      
      if (result.success && result.data) {
        const { stream, message } = result.data;
        
        // Update current stream
        set((state) => {
          if (state.currentStream?.id === id) {
            return {
              currentStream: {
                ...state.currentStream,
                status: mapApiStatus(stream.status),
                grossSales: stream.grossSales,
                fees: stream.fees,
                profit: stream.profit,
                bulkSale: stream.bulkSale,
                finalizedAt: stream.finalizedAt ? new Date(stream.finalizedAt) : null,
                finalizedBy: stream.finalizedBy
              }
            };
          }
          return state;
        });
        
        // Update streams list
        set((state) => ({
          streams: state.streams.map(s => 
            s.id === id 
              ? { 
                  ...s, 
                  status: mapApiStatus(stream.status),
                  grossSales: stream.grossSales,
                  fees: stream.fees,
                  profit: stream.profit
                }
              : s
          )
        }));
        
        toast.success(message || 'Stream finalized successfully');
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