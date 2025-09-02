export type UserRole = 'admin' | 'manager' | 'member';

export interface RolePermissions {
  [key: string]: UserRole[];
}

// RBAC Permission Matrix - Allowlist by action
export const PERMISSIONS: RolePermissions = {
  // Users management: admin only
  'users.list': ['admin'],
  'users.create': ['admin'],
  'users.update': ['admin'],
  'users.delete': ['admin'],

  // Batches/import & finish: admin, manager
  'batches.list': ['admin', 'manager', 'member'], // Read access for all
  'batches.create': ['admin', 'manager'],
  'batches.import': ['admin', 'manager'],
  'batches.finish': ['admin', 'manager'],

  // Intake (arrive/label): admin, manager, member
  'cards.list': ['admin', 'manager', 'member'],
  'cards.view': ['admin', 'manager', 'member'],
  'cards.arrive': ['admin', 'manager', 'member'],
  'cards.label': ['admin', 'manager', 'member'],
  'cards.updateStatus': ['admin', 'manager', 'member'],
  'cards.update': ['admin', 'manager'], // Edit card details
  'cards.delete': ['admin'], // Only admin can delete

  // Streams create & add items: admin, manager, member
  'streams.list': ['admin', 'manager', 'member'],
  'streams.view': ['admin', 'manager', 'member'],
  'streams.create': ['admin', 'manager', 'member'],
  'streams.addItems': ['admin', 'manager', 'member'],
  'streams.removeItems': ['admin', 'manager', 'member'],

  // Streams lock: owner OR admin/manager
  'streams.lock': ['admin', 'manager'], // Plus owner check in component

  // Streams finalize: admin, manager
  'streams.finalize': ['admin', 'manager'],

  // Shipping actions: admin, manager, member
  'shipping.list': ['admin', 'manager', 'member'],
  'shipping.create': ['admin', 'manager', 'member'],
  'shipping.update': ['admin', 'manager', 'member'],
  'shipping.ship': ['admin', 'manager', 'member'],

  // Reports export: admin, manager (member read-only if shown)
  'reports.view': ['admin', 'manager', 'member'],
  'reports.export': ['admin', 'manager'],

  // Audit logs: admin only
  'audit.view': ['admin'],
};

/**
 * Check if user has permission for a specific action
 */
export function hasPermission(userRole: UserRole, action: string): boolean {
  const allowedRoles = PERMISSIONS[action];
  if (!allowedRoles) {
    console.warn(`Unknown permission action: ${action}`);
    return false;
  }
  return allowedRoles.includes(userRole);
}

/**
 * Check if user can perform action on resource they own
 */
export function canAccessOwnResource(userRole: UserRole, action: string, resourceOwnerId: string, currentUserId: string): boolean {
  // First check basic permission
  if (!hasPermission(userRole, action)) {
    return false;
  }

  // Special case for stream locking - owner OR admin/manager
  if (action === 'streams.lock') {
    return resourceOwnerId === currentUserId || ['admin', 'manager'].includes(userRole);
  }

  return true;
}

/**
 * Get user's accessible navigation items based on role
 */
export function getAccessibleNavItems(userRole: UserRole) {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', permission: 'cards.list' },
    { path: '/import', label: 'Import', permission: 'batches.create' },
    { path: '/inventory', label: 'Inventory', permission: 'cards.list' },
    { path: '/streams', label: 'Streams', permission: 'streams.list' },
    { path: '/builder', label: 'Builder', permission: 'streams.addItems' },
    { path: '/shipping', label: 'Shipping', permission: 'shipping.list' },
    { path: '/reports', label: 'Reports', permission: 'reports.view' },
    { path: '/users', label: 'Users', permission: 'users.list' },
    { path: '/audit', label: 'Audit', permission: 'audit.view' },
  ];

  return navItems.filter(item => hasPermission(userRole, item.permission));
}