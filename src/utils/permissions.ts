export type UserRole = 'Admin' | 'Manager' | 'Member';

export const PERMISSIONS = {
  // Import & Intake
  UPLOAD_FILES: ['Admin', 'Manager'],
  PROCESS_INTAKE: ['Admin', 'Manager', 'Member'],
  LOCK_BATCHES: ['Admin', 'Manager'],
  
  // Inventory
  VIEW_INVENTORY: ['Admin', 'Manager', 'Member'],
  EDIT_CARDS: ['Admin', 'Manager'],
  DELETE_CARDS: ['Admin'],
  GENERATE_LABELS: ['Admin', 'Manager', 'Member'],
  
  // Streams
  CREATE_STREAMS: ['Admin', 'Manager'],
  EDIT_STREAMS: ['Admin', 'Manager'],
  FINALIZE_STREAMS: ['Admin', 'Manager'],
  BUILD_STREAMS: ['Admin', 'Manager', 'Member'],
  
  // Shipping
  MANAGE_SHIPPING: ['Admin', 'Manager', 'Member'],
  GENERATE_SHIPPING_LABELS: ['Admin', 'Manager'],
  
  // Reports
  VIEW_REPORTS: ['Admin', 'Manager'],
  EXPORT_REPORTS: ['Admin', 'Manager'],
  
  // Users
  MANAGE_USERS: ['Admin'],
  VIEW_AUDIT: ['Admin'],
} as const;

export function hasPermission(userRole: UserRole, permission: keyof typeof PERMISSIONS): boolean {
  return PERMISSIONS[permission].includes(userRole);
}

export function canPerformAction(userRole: UserRole, action: string): boolean {
  const permissionMap: Record<string, keyof typeof PERMISSIONS> = {
    'upload': 'UPLOAD_FILES',
    'edit_card': 'EDIT_CARDS',
    'delete_card': 'DELETE_CARDS',
    'create_stream': 'CREATE_STREAMS',
    'finalize_stream': 'FINALIZE_STREAMS',
    'manage_users': 'MANAGE_USERS',
    'view_audit': 'VIEW_AUDIT',
  };
  
  const permission = permissionMap[action];
  return permission ? hasPermission(userRole, permission) : false;
}

// Hook for checking permissions
export function usePermissions() {
  const { user } = useAuthStore();
  
  return {
    hasPermission: (permission: keyof typeof PERMISSIONS) => 
      user ? hasPermission(user.role, permission) : false,
    canPerformAction: (action: string) => 
      user ? canPerformAction(user.role, action) : false,
    userRole: user?.role
  };
}