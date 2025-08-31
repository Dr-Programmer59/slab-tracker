import { authService } from '../services/authService';

export const usePermissions = () => {
  const user = authService.getStoredUser();

  const hasRole = (role) => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has all permissions
    return user.role === role;
  };

  const canManageUsers = () => hasRole('admin');
  const canManageBatches = () => hasRole('admin') || hasRole('manager');
  const canEditCards = () => hasRole('admin') || hasRole('manager');
  const canFinalizeStreams = () => hasRole('admin') || hasRole('manager');
  const canViewReports = () => hasRole('admin') || hasRole('manager');
  const canExportData = () => hasRole('admin') || hasRole('manager');

  return {
    user,
    hasRole,
    canManageUsers,
    canManageBatches,
    canEditCards,
    canFinalizeStreams,
    canViewReports,
    canExportData
  };
};