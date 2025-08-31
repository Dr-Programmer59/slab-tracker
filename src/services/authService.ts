import api from '../utils/api';
import type { User } from '../types';

interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

interface UserResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', {
        email: email.toLowerCase(),
        password: password
      });
      
      const { token, user } = response.data.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      localStorage.setItem('slabtrack_token', token);
      localStorage.setItem('slabtrack_user', JSON.stringify(user));
      
      return { success: true, user, token };
    } catch (error: any) {
      localStorage.removeItem('slabtrack_token');
      localStorage.removeItem('slabtrack_user');
      
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Login failed'
      };
    }
  },

  async getCurrentUser(): Promise<UserResponse> {
    try {
      const token = localStorage.getItem('slabtrack_token');
      if (!token) {
        return { success: false, error: 'No token found' };
      }
      
      const response = await api.get('/auth/me');
      const user = response.data.data.user;
      
      localStorage.setItem('slabtrack_user', JSON.stringify(user));
      
      return { success: true, user };
    } catch (error: any) {
      localStorage.removeItem('slabtrack_token');
      localStorage.removeItem('slabtrack_user');
      
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Session invalid'
      };
    }
  },

  logout(): void {
    localStorage.removeItem('slabtrack_token');
    localStorage.removeItem('slabtrack_user');
    localStorage.removeItem('slabtrack_remember');
    window.location.href = '/login';
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('slabtrack_token');
    const user = this.getStoredUser();
    return !!(token && user);
  },

  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem('slabtrack_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },

  async initializeAuth(): Promise<boolean> {
    const token = localStorage.getItem('slabtrack_token');
    
    if (!token) {
      return false;
    }
    
    try {
      const result = await this.getCurrentUser();
      
      if (result.success) {
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      this.logout();
      return false;
    }
  }
};