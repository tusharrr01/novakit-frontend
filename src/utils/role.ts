export type RoleScope = {
  key: string;
  label: string;
  group: string;
};

export const DEFAULT_SCOPES: RoleScope[] = [
  { key: 'users:read', label: 'View users', group: 'Users' },
  { key: 'users:write', label: 'Edit users', group: 'Users' },
  { key: 'products:read', label: 'View products', group: 'Products' },
  { key: 'products:write', label: 'Edit products', group: 'Products' },
  { key: 'billing:read', label: 'View billing', group: 'Billing' },
  { key: 'billing:write', label: 'Manage subscription settings', group: 'Billing' },
  { key: 'settings:write', label: 'Modify system preferences', group: 'System' },
];

export function getRoleInitials(name: string): string {
  return name ? name.substring(0, 2).toUpperCase() : 'RL';
}
