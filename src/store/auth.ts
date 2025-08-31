import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  checkAuth: () => Promise<void>;
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
          const response = await authAPI.login(email, password);
          
          // Store token and user data
          localStorage.setItem('slabtrack_token', response.token);
          localStorage.setItem('slabtrack_user', JSON.stringify(response.user));
          
          const user: User = {
            id: response.user._id,
            email: response.user.email,
            displayName: response.user.name,
            role: response.user.role === 'admin' ? 'Admin' : 
                  response.user.role === 'manager' ? 'Manager' : 'Member',
            status: 'Active',
            lastLogin: new Date(),
            createdAt: new Date(response.user.createdAt),
          };
          
          set({ user, isAuthenticated: true, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('slabtrack_token');
        localStorage.removeItem('slabtrack_user');
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('slabtrack_token');
        const userData = localStorage.getItem('slabtrack_user');
        
        if (token && userData) {
          try {
            const response = await authAPI.getCurrentUser();
            const user: User = {
              id: response.user._id,
              email: response.user.email,
              displayName: response.user.name,
              role: response.user.role === 'admin' ? 'Admin' : 
                    response.user.role === 'manager' ? 'Manager' : 'Member',
              status: 'Active',
              lastLogin: new Date(),
              createdAt: new Date(response.user.createdAt),
            };
            set({ user, isAuthenticated: true });
          } catch (error) {
            // Token invalid, clear auth data
            localStorage.removeItem('slabtrack_token');
            localStorage.removeItem('slabtrack_user');
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