import { useAuthStore } from '../store/auth';
import { hasPermission, canAccessOwnResource, type UserRole } from '../utils/rbac';

interface PermissionsHook {
  user: any;
  userRole: UserRole | null;
  hasPermission: (action: string) => boolean;
  canAccessOwnResource: (action: string, resourceOwnerId: string) => boolean;
  
  // Legacy methods for backward compatibility
  canManageUsers: () => boolean;
  canManageBatches: () => boolean;
  canEditCards: () => boolean;
  canFinalizeStreams: () => boolean;
  canViewReports: () => boolean;
  canExportData: () => boolean;
}

export const usePermissions = (): PermissionsHook => {
  const { user } = useAuthStore();
  const userRole = user?.role as UserRole | null;

  const checkPermission = (action: string): boolean => {
    if (!userRole) return false;
    return hasPermission(userRole, action);
  };

  const checkOwnResource = (action: string, resourceOwnerId: string): boolean => {
    if (!userRole || !user?.id) return false;
    return canAccessOwnResource(userRole, action, resourceOwnerId, user.id);
  };

  return {
    user,
    userRole,
    hasPermission: checkPermission,
    canAccessOwnResource: checkOwnResource,
    
    // Legacy methods for backward compatibility
    canManageUsers: () => checkPermission('users.list'),
    canManageBatches: () => checkPermission('batches.create'),
    canEditCards: () => checkPermission('cards.update'),
    canFinalizeStreams: () => checkPermission('streams.finalize'),
    canViewReports: () => checkPermission('reports.view'),
    canExportData: () => checkPermission('reports.export'),
  };
};