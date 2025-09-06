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
      console.log('🔐 Attempting login for:', email);
      const response = await api.post('/auth/login', {
        email: email.toLowerCase(),
        password: password
      });
      
      // Check API response format: { ok: true, data: { token, user } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Login failed');
      }

      const { token, user } = response.data.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // Map API user to frontend User type
      const mappedUser: User = {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role, // Keep as lowercase from API
        status: user.status === 'active' ? 'Active' : 'Disabled',
        lastLogin: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined,
        createdAt: new Date(user.createdAt),
      };
      
      localStorage.setItem('slabtrack_token', token);
      localStorage.setItem('slabtrack_user', JSON.stringify(mappedUser));
      
      console.log('✅ Login successful for:', mappedUser.displayName);
      return { success: true, user: mappedUser, token };
    } catch (error: any) {
      console.error('❌ Login error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        responseData: error.response?.data
      });
      
      localStorage.removeItem('slabtrack_token');
      localStorage.removeItem('slabtrack_user');
      
      let errorMessage = 'Login failed';
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
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
      
      // Check API response format: { ok: true, data: { user } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Session invalid');
      }

      const apiUser = response.data.data.user;
      
      // Map API user to frontend User type
      const user: User = {
        id: apiUser._id,
        email: apiUser.email,
        displayName: apiUser.displayName,
        role: apiUser.role, // Keep as lowercase from API
        status: apiUser.status === 'active' ? 'Active' : 'Disabled',
        lastLogin: apiUser.lastLoginAt ? new Date(apiUser.lastLoginAt) : undefined,
        createdAt: new Date(apiUser.createdAt),
      };
      
      localStorage.setItem('slabtrack_user', JSON.stringify(user));
      
      return { success: true, user };
    } catch (error: any) {
      localStorage.removeItem('slabtrack_token');
      localStorage.removeItem('slabtrack_user');
      
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Session invalid'
      };
    }
  },

  logout(): void {
    console.log("🔓 Logging out...");  
    localStorage.removeItem('slabtrack_token');
    localStorage.removeItem('slabtrack_user');
    localStorage.removeItem('slabtrack_remember');
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