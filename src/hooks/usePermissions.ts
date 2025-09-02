import { authService } from '../services/authService';
import type { User } from '../types';

interface PermissionsHook {
  user: User | null;
  hasRole: (role: string) => boolean;
  canManageUsers: () => boolean;
  canManageBatches: () => boolean;
  canEditCards: () => boolean;
  canFinalizeStreams: () => boolean;
  canViewReports: () => boolean;
  canExportData: () => boolean;
}

export const usePermissions = (): PermissionsHook => {
  const user = authService.getStoredUser();

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    if (user.role === 'Admin') return true; // Admin has all permissions
    return user.role === role;
  };

  const canManageUsers = (): boolean => hasRole('Admin');
  const canManageBatches = (): boolean => hasRole('Admin') || hasRole('Manager');
  const canEditCards = (): boolean => hasRole('Admin') || hasRole('Manager');
  const canFinalizeStreams = (): boolean => hasRole('Admin') || hasRole('Manager');
  const canViewReports = (): boolean => hasRole('Admin') || hasRole('Manager');
  const canExportData = (): boolean => hasRole('Admin') || hasRole('Manager');

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