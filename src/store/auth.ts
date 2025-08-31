import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      login: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const result = await authService.login(email, password);
          if (result.success) {
            const user: User = {
              id: result.user.id || result.user._id,
              email: result.user.email,
              displayName: result.user.displayName,
              role: result.user.role === 'admin' ? 'Admin' : 
                    result.user.role === 'manager' ? 'Manager' : 'Member',
              status: 'Active',
              lastLogin: new Date(result.user.lastLoginAt || Date.now()),
              createdAt: new Date(result.user.createdAt || Date.now()),
            };
            set({ user, isAuthenticated: true, loading: false });
          } else {
            set({ loading: false });
            throw new Error(result.error);
          }
        } catch (error) {
          set({ loading: false });
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
        const token = localStorage.getItem('slabtrack_token');
        if (token) {
          try {
            const result = await authService.getCurrentUser();
            if (result.success) {
              const user: User = {
                id: result.user.id || result.user._id,
                email: result.user.email,
                displayName: result.user.displayName,
                role: result.user.role === 'admin' ? 'Admin' : 
                      result.user.role === 'manager' ? 'Manager' : 'Member',
                status: 'Active',
                lastLogin: new Date(result.user.lastLoginAt || Date.now()),
                createdAt: new Date(result.user.createdAt || Date.now()),
              };
              set({ user, isAuthenticated: true });
            } else {
              authService.logout();
              set({ user: null, isAuthenticated: false });
            }
          } catch (error) {
            authService.logout();
            set({ user: null, isAuthenticated: false });
          }
        }
      },
    }),
    {
      name: 'slabtrack-auth',
    }
  )
);