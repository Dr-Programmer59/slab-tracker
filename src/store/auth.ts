import { create } from 'zustand';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  initializing: true,

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const result = await authService.login(email, password);
      if (result.success && result.user) {
        const user: User = {
          id: result.user.id || (result.user as any)._id,
          email: result.user.email,
          displayName: result.user.displayName,
          role: result.user.role === 'admin' ? 'Admin' : 
                result.user.role === 'manager' ? 'Manager' : 'Member',
          status: 'Active',
          lastLogin: new Date((result.user as any).lastLoginAt || Date.now()),
          createdAt: new Date((result.user as any).createdAt || Date.now()),
        };
        set({ user, isAuthenticated: true, loading: false });
        toast.success(`Welcome back, ${user.displayName}!`);
      } else {
        set({ loading: false });
        throw new Error(result.error);
      }
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.message || 'Login failed');
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (updates) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, ...updates } });
    }
  },

  initializeAuth: async () => {
    set({ initializing: true });
    
    try {
      const token = localStorage.getItem('slabtrack_token');
      if (token) {
        const isValid = await authService.initializeAuth();
        
        if (isValid) {
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            const user: User = {
              id: storedUser.id || (storedUser as any)._id,
              email: storedUser.email,
              displayName: storedUser.displayName,
              role: storedUser.role === 'admin' ? 'Admin' : 
                    storedUser.role === 'manager' ? 'Manager' : 'Member',
              status: 'Active',
              lastLogin: new Date((storedUser as any).lastLoginAt || Date.now()),
              createdAt: new Date((storedUser as any).createdAt || Date.now()),
            };
            set({ user, isAuthenticated: true, initializing: false });
          }
        } else {
          set({ user: null, isAuthenticated: false, initializing: false });
        }
      } else {
        set({ user: null, isAuthenticated: false, initializing: false });
      }
    } catch (error) {
      authService.logout();
      set({ user: null, isAuthenticated: false, initializing: false });
    }
  }
}));