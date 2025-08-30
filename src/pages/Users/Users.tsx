import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users as UsersIcon, UserPlus, Shield, Clock } from 'lucide-react';
import { Button } from '../../components/Common/Button';
import { Modal } from '../../components/Common/Modal';
import { useAuthStore } from '../../store/auth';

const demoUsers = [
  {
    id: '1',
    email: 'admin@slabtrack.com',
    displayName: 'Admin User',
    role: 'Admin',
    status: 'Active',
    lastLogin: new Date('2024-01-20'),
  },
  {
    id: '2',
    email: 'manager@slabtrack.com',
    displayName: 'Manager User',
    role: 'Manager',
    status: 'Active',
    lastLogin: new Date('2024-01-19'),
  },
  {
    id: '3',
    email: 'member@slabtrack.com',
    displayName: 'Member User',
    role: 'Member',
    status: 'Active',
    lastLogin: new Date('2024-01-18'),
  },
];

export function Users() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState(demoUsers);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const changeRole = (userId: string, newRole: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    toast.success('User role updated successfully!');
  };

  const toggleStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Disabled' : 'Active' }
        : user
    ));
    toast.success('User status updated successfully!');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-600';
      case 'Manager': return 'bg-amber-600';
      case 'Member': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-slate-400 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4" />
          Invite User
        </Button>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">User</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">Role</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">Last Login</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">Actions</th>
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
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-white">{user.displayName}</div>
                      <div className="text-sm text-slate-400">{user.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)} text-white`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active' 
                        ? 'bg-green-600 text-green-100' 
                        : 'bg-red-600 text-red-100'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 text-sm">
                        {user.lastLogin.toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRoleModal(true);
                        }}
                        disabled={user.id === currentUser?.id}
                      >
                        <Shield className="w-4 h-4" />
                        Change Role
                      </Button>
                      <Button
                        variant={user.status === 'Active' ? 'danger' : 'secondary'}
                        size="sm"
                        onClick={() => toggleStatus(user.id)}
                        disabled={user.id === currentUser?.id}
                      >
                        {user.status === 'Active' ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

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
                {['Admin', 'Manager', 'Member'].map(role => (
                  <label key={role} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      defaultChecked={selectedUser.role === role}
                      className="text-indigo-500 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="font-medium text-white">{role}</p>
                      <p className="text-xs text-slate-400">
                        {role === 'Admin' && 'Full access including user management'}
                        {role === 'Manager' && 'Import, inventory, streams, and reports'}
                        {role === 'Member' && 'Limited access to core functions'}
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
                  if (form) {
                    changeRole(selectedUser.id, form.value);
                    setShowRoleModal(false);
                    setSelectedUser(null);
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