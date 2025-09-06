import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users as UsersIcon, UserPlus, Shield, Clock, Search, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/Common/Button';
import { Modal } from '../../components/Common/Modal';
import { CreateUserModal } from './CreateUserModal';
import { useAuthStore } from '../../store/auth';
import { userService } from '../../services/userService';
import { usePermissions } from '../../hooks/usePermissions';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'manager' | 'member';
  status: 'active' | 'inactive';
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function Users() {
  const { user: currentUser } = useAuthStore();
  const { hasPermission } = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    page: 1
  });

  const canManageUsers = hasPermission('users.list');

  // Fetch users
  const fetchUsers = async () => {
    if (!canManageUsers) {
      setError('You do not have permission to view users');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await userService.getUsers({
        page: filters.page,
        limit: 20,
        search: filters.search || undefined,
        role: filters.role as any || undefined,
        status: filters.status as any || undefined
      });
      
      if (result.success && result.data) {
        setUsers(result.data.users || []);
        setPagination(result.data.pagination || pagination);
      } else {
        setError(result.error || 'Failed to fetch users');
      }
    } catch (error) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, canManageUsers]);

  const handleSearch = (searchTerm: string) => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleRoleFilter = (role: string) => {
    setFilters({ ...filters, role, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'manager' | 'member') => {
    try {
      const result = await userService.updateUserRole(userId, newRole);
      
      if (result.success) {
        toast.success('User role updated successfully!');
        fetchUsers(); // Refresh the list
        setShowRoleModal(false);
        setSelectedUser(null);
      } else {
        toast.error(result.error || 'Failed to update user role');
      }
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const result = await userService.deleteUser(userId);
      
      if (result.success) {
        toast.success('User deleted successfully!');
        fetchUsers(); // Refresh the list
      } else {
        toast.error(result.error || 'Failed to delete user');
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-600 text-red-100';
      case 'manager': return 'bg-amber-600 text-amber-100';
      case 'member': return 'bg-green-600 text-green-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-600 text-green-100' 
      : 'bg-red-600 text-red-100';
  };

  if (!canManageUsers) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-400 mb-2">Access Denied</h3>
        <p className="text-slate-500">You do not have permission to manage users.</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchUsers} />;
  }

  return (
    <div className="min-w-0 space-y-4 md:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            Manage user accounts and permissions ({pagination.total} total users)
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto shrink-0">
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Create User</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800 border border-slate-700 rounded-xl p-6"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by email or name..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex gap-2 sm:gap-4">
            {/* Role Filter */}
          <select
            value={filters.role}
            onChange={(e) => handleRoleFilter(e.target.value)}
            className="flex-1 sm:flex-none bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="member">Member</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="flex-1 sm:flex-none bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-slate-700">
              <tr>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300">User</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300">Role</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300">Status</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300 hidden sm:table-cell">Last Login</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300 hidden md:table-cell">Created</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <div>
                      <div className="font-medium text-white text-sm md:text-base">{user.displayName}</div>
                      <div className="text-xs md:text-sm text-slate-400 truncate max-w-[150px] md:max-w-none">{user.email}</div>
                      {user.id === currentUser?.id && (
                        <div className="text-xs text-cyan-400 mt-1">You</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 text-xs md:text-sm">
                        {user.lastLoginAt 
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : 'Never'
                        }
                      </span>
                    </div>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6 hidden md:table-cell">
                    <span className="text-slate-300 text-xs md:text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRoleModal(true);
                        }}
                        disabled={user.id === currentUser?.id}
                        title={user.id === currentUser?.id ? "Cannot change your own role" : "Change user role"}
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id, user.displayName)}
                        disabled={user.id === currentUser?.id}
                        title={user.id === currentUser?.id ? "Cannot delete your own account" : "Delete user"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl p-4"
        >
          <div className="text-slate-400 text-xs md:text-sm">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!pagination.hasPrev}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <span className="text-slate-300 text-xs md:text-sm px-2 md:px-3">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={!pagination.hasNext}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </motion.div>
      )}

      {/* Create User Modal */}
      <CreateUserModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onUserCreated={fetchUsers}
      />

      {/* Change Role Modal */}
      {selectedUser && (
        <Modal
          isOpen={showRoleModal}
          onClose={() => {
            setShowRoleModal(false);
            setSelectedUser(null);
          }}
          title="Change User Role"
        >
          <div className="space-y-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="font-medium text-white">{selectedUser.displayName}</p>
              <p className="text-sm text-slate-400">{selectedUser.email}</p>
              <p className="text-sm text-slate-400 mt-1">
                Current role: <span className="text-white">{selectedUser.role}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">New Role</label>
              <div className="space-y-2">
                {['admin', 'manager', 'member'].map(role => (
                  <label key={role} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      defaultChecked={selectedUser.role === role}
                      className="text-indigo-500 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="font-medium text-white capitalize">{role}</p>
                      <p className="text-xs text-slate-400">
                        {role === 'admin' 
                          ? 'Full access including user management'
                          : role === 'manager'
                          ? 'Import, inventory, streams, and reports'
                          : 'Limited access to core functions'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary" 
                onClick={() => setShowRoleModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  const form = document.querySelector('input[name="role"]:checked') as HTMLInputElement;
                  if (form && selectedUser) {
                    handleRoleChange(selectedUser.id, form.value as 'admin' | 'manager' | 'member');
                  }
                }}
                className="flex-1"
              >
                Update Role
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}