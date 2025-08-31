import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate authentication
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo users
        const demoUsers: Record<string, User> = {
          'admin@slabtrack.com': {
            id: '1',
            email: 'admin@slabtrack.com',
            displayName: 'Admin User',
            role: 'Admin',
            status: 'Active',
            lastLogin: new Date(),
            createdAt: new Date('2024-01-01'),
          },
          'manager@slabtrack.com': {
            id: '2',
            email: 'manager@slabtrack.com',
            displayName: 'Manager User',
            role: 'Manager',
            status: 'Active',
            lastLogin: new Date(),
            createdAt: new Date('2024-01-01'),
          },
          'member@slabtrack.com': {
            id: '3',
            email: 'member@slabtrack.com',
            displayName: 'Member User',
            role: 'Member',
            status: 'Active',
            lastLogin: new Date(),
            createdAt: new Date('2024-01-01'),
          },
        };

        const user = demoUsers[email];
        if (user && password === 'password123') {
          set({ user, isAuthenticated: true });
        } else {
          throw new Error('Invalid credentials');
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
    }),
    {
      name: 'slabtrack-auth',
    }
  )
);