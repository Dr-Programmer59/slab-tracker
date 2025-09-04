import api from '../utils/api';

interface CreateUserData {
  email: string;
  password: string;
  displayName: string;
  role?: 'admin' | 'manager' | 'member';
}

interface UserFilters {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive';
  role?: 'admin' | 'manager' | 'member';
  search?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const userService = {
  // CREATE NEW USER
  async createUser(userData: CreateUserData): Promise<ApiResponse<any>> {
    try {
      const response = await api.post('/auth/register', {
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        role: userData.role || 'member'
      });
      
      // Check API response format: { ok: true, data: { token, user } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to create user');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to create user'
      };
    }
  },

  // GET ALL USERS WITH FILTERING
  async getUsers(filters: UserFilters = {}): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.role) params.append('role', filters.role);
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.get(`/auth/users?${params}`);
      
      // Check API response format: { ok: true, data: { users, pagination } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to fetch users');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to fetch users'
      };
    }
  },

  // UPDATE USER ROLE
  async updateUserRole(userId: string, role: 'admin' | 'manager' | 'member'): Promise<ApiResponse<any>> {
    try {
      const response = await api.put(`/auth/users/${userId}/role`, {
        role: role
      });
      
      // Check API response format: { ok: true, data: { user } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to update user role');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to update user role'
      };
    }
  },

  // DELETE USER
  async deleteUser(userId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.delete(`/auth/users/${userId}`);
      
      // Check API response format: { ok: true, data: { message, deletedUser } }
      if (!response.data.ok) {
        throw new Error(response.data.error?.message || 'Failed to delete user');
      }
      
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message || 'Failed to delete user'
      };
    }
  }
};