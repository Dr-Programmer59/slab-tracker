import api from '../utils/api';

export const authService = {
  // LOGIN FUNCTION - CRITICAL IMPLEMENTATION
  async login(email, password) {
    try {
      // EXACT request format required
      const response = await api.post('/auth/login', {
        email: email.toLowerCase(), // IMPORTANT: Always lowercase
        password: password
      });
      
      // Backend returns: { ok: true, data: { token, user } }
      const { token, user } = response.data.data;
      
      // CRITICAL: Store both token and user
      localStorage.setItem('slabtrack_token', token);
      localStorage.setItem('slabtrack_user', JSON.stringify(user));
      
      return { success: true, user, token };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Login failed'
      };
    }
  },

  // GET CURRENT USER - CRITICAL FOR AUTH STATE
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      const user = response.data.data.user;
      
      // Update stored user data
      localStorage.setItem('slabtrack_user', JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.response?.data?.error?.message };
    }
  },

  // LOGOUT FUNCTION
  logout() {
    localStorage.removeItem('slabtrack_token');
    localStorage.removeItem('slabtrack_user');
    window.location.href = '/login';
  },

  // CHECK IF AUTHENTICATED
  isAuthenticated() {
    return !!localStorage.getItem('slabtrack_token');
  },

  // GET STORED USER
  getStoredUser() {
    const userStr = localStorage.getItem('slabtrack_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};