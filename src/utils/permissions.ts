// Permission helper utilities
export type UserRole = 'admin' | 'user';

export interface Permission {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canExport: boolean;
  canImport: boolean;
}

// Permission definitions by role and module
export const permissions = {
  products: {
    admin: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canApprove: false,
      canExport: true,
      canImport: true,
    },
    user: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canApprove: false,
      canExport: true,
      canImport: false,
    },
  },
  receipts: {
    admin: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canApprove: true, // Validate receipts
      canExport: true,
      canImport: false,
    },
    user: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: true, // Validate receipts
      canExport: true,
      canImport: false,
    },
  },
  deliveries: {
    admin: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canApprove: false,
      canExport: true,
      canImport: false,
    },
    user: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: false,
      canExport: true,
      canImport: false,
    },
  },
  transfers: {
    admin: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canApprove: false,
      canExport: true,
      canImport: false,
    },
    user: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: false,
      canExport: true,
      canImport: false,
    },
  },
  adjustments: {
    admin: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canApprove: true, // Only admin can approve
      canExport: true,
      canImport: false,
    },
    user: {
      canCreate: true,
      canEdit: false,
      canDelete: false,
      canApprove: false, // Users cannot approve
      canExport: true,
      canImport: false,
    },
  },
  ledger: {
    admin: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canApprove: false,
      canExport: true,
      canImport: false,
    },
    user: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canApprove: false,
      canExport: true,
      canImport: false,
    },
  },
  warehouses: {
    admin: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canApprove: false,
      canExport: false,
      canImport: false,
    },
    user: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canApprove: false,
      canExport: false,
      canImport: false,
    },
  },
  settings: {
    admin: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canApprove: false,
      canExport: false,
      canImport: false,
    },
    user: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canApprove: false,
      canExport: false,
      canImport: false,
    },
  },
};

// Helper function to check permissions
export function hasPermission(
  module: keyof typeof permissions,
  action: keyof Permission,
  role: string | undefined
): boolean {
  if (!role || (role !== 'admin' && role !== 'user')) {
    return false;
  }
  return permissions[module][role as UserRole][action];
}

// Helper function to check if user can access a module
export function canAccessModule(module: keyof typeof permissions, role: string | undefined): boolean {
  if (!role || (role !== 'admin' && role !== 'user')) {
    return false;
  }
  // Settings is admin-only
  if (module === 'settings') {
    return role === 'admin';
  }
  // All other modules are accessible by both roles
  return true;
}

// Get all permissions for a module and role
export function getModulePermissions(
  module: keyof typeof permissions,
  role: string | undefined
): Permission {
  if (!role || (role !== 'admin' && role !== 'user')) {
    // Return no permissions if role is invalid
    return {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canApprove: false,
      canExport: false,
      canImport: false,
    };
  }
  return permissions[module][role as UserRole];
}

// Helper to check if user is admin
export function isAdmin(role: string | undefined): boolean {
  return role === 'admin';
}

// Helper to check if user is regular user
export function isRegularUser(role: string | undefined): boolean {
  return role === 'user';
}
