import type { User } from '../types';

export type Permission = 
  | 'view_cards'
  | 'edit_cards'
  | 'delete_cards'
  | 'import_batches'
  | 'manage_streams'
  | 'finalize_streams'
  | 'manage_shipping'
  | 'view_reports'
  | 'export_reports'
  | 'manage_users'
  | 'view_audit';

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  Admin: [
    'view_cards',
    'edit_cards',
    'delete_cards',
    'import_batches',
    'manage_streams',
    'finalize_streams',
    'manage_shipping',
    'view_reports',
    'export_reports',
    'manage_users',
    'view_audit',
  ],
  Manager: [
    'view_cards',
    'edit_cards',
    'import_batches',
    'manage_streams',
    'finalize_streams',
    'manage_shipping',
    'view_reports',
    'export_reports',
  ],
  Member: [
    'view_cards',
    'manage_shipping',
    'view_reports',
  ],
};

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
}

export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(user, permission));
}

export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(user, permission));
}

export function usePermissions(user: User | null) {
  return {
    canViewCards: hasPermission(user, 'view_cards'),
    canEditCards: hasPermission(user, 'edit_cards'),
    canDeleteCards: hasPermission(user, 'delete_cards'),
    canImportBatches: hasPermission(user, 'import_batches'),
    canManageStreams: hasPermission(user, 'manage_streams'),
    canFinalizeStreams: hasPermission(user, 'finalize_streams'),
    canManageShipping: hasPermission(user, 'manage_shipping'),
    canViewReports: hasPermission(user, 'view_reports'),
    canExportReports: hasPermission(user, 'export_reports'),
    canManageUsers: hasPermission(user, 'manage_users'),
    canViewAudit: hasPermission(user, 'view_audit'),
  };
}