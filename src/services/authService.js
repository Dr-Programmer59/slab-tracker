import api from '../utils/api';

export const authService = {
  // LOGIN FUNCTION - EXACT IMPLEMENTATION FOR JWT
  async login(email, password) {
    try {
      console.log('🔑 Attempting login for:', email);
      
      // EXACT request format required by backend
      const response = await api.post('/auth/login', {
        email: email.toLowerCase(), // Backend expects lowercase
        password: password
      });
      
      console.log('📦 Login response:', response.data);
      
      // Backend returns: { ok: true, data: { token, user } }
      const { token, user } = response.data.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // CRITICAL: Store JWT token and user data
      localStorage.setItem('slabtrack_token', token);
      localStorage.setItem('slabtrack_user', JSON.stringify(user));
      
      console.log('✅ Login successful for:', user.displayName);
      console.log('🔑 Token stored:', token.substring(0, 20) + '...');
      
      return { success: true, user, token };
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Clear any partial auth data
      localStorage.removeItem('slabtrack_token');
      localStorage.removeItem('slabtrack_user');
      
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Login failed'
      };
    }
  },

  // GET CURRENT USER - CRITICAL FOR SESSION VALIDATION
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('slabtrack_token');
      if (!token) {
        return { success: false, error: 'No token found' };
      }
      
      console.log('🔍 Verifying session with /auth/me');
      
      const response = await api.get('/auth/me');
      const user = response.data.data.user;
      
      // Update stored user data with fresh info
      localStorage.setItem('slabtrack_user', JSON.stringify(user));
      
      console.log('✅ Session verified for:', user.displayName);
      return { success: true, user };
    } catch (error) {
      console.error('❌ Session verification failed:', error);
      
      // Clear invalid auth data
      localStorage.removeItem('slabtrack_token');
      localStorage.removeItem('slabtrack_user');
      
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Session invalid'
      };
    }
  },

  // LOGOUT FUNCTION
  logout() {
    console.log('🚪 Logging out user');
    localStorage.removeItem('slabtrack_token');
    localStorage.removeItem('slabtrack_user');
    localStorage.removeItem('slabtrack_remember');
    window.location.href = '/login';
  },

  // CHECK IF AUTHENTICATED
  isAuthenticated() {
    const token = localStorage.getItem('slabtrack_token');
    const user = this.getStoredUser();
    return !!(token && user);
  },

  // GET STORED USER
  getStoredUser() {
    try {
      const userStr = localStorage.getItem('slabtrack_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('❌ Failed to parse stored user:', error);
      return null;
    }
  },

  // INITIALIZE AUTH ON APP STARTUP
  async initializeAuth() {
    const token = localStorage.getItem('slabtrack_token');
    
    if (!token) {
      console.log('🔒 No token found - user needs to login');
      return false;
    }
    
    console.log('🔄 Found existing token, verifying with backend...');
    
    try {
      const result = await this.getCurrentUser();
      
      if (result.success) {
        console.log('✅ Session restored successfully');
        return true;
      } else {
        console.warn('🔒 Session invalid, clearing auth data');
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('❌ Auth initialization failed:', error);
      this.logout();
      return false;
    }
  }
};