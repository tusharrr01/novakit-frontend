'use client';

import React from 'react';
import {
  useGetAdminRolesQuery,
  useGetAdminPermissionsQuery,
  useUpdateAdminRoleMutation,
} from '@/src/redux/api/rbacApi';
import { ShieldCheck, Check, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminRbacPage() {
  const { data: rolesData, refetch: refetchRoles, isLoading: rolesLoading } = useGetAdminRolesQuery(undefined);
  const { data: permissionsData, isLoading: permissionsLoading } = useGetAdminPermissionsQuery(undefined);
  const [updateRole] = useUpdateAdminRoleMutation();

  const roles = rolesData?.data || [];
  const permissions = permissionsData?.data || [];

  const handleTogglePermission = async (role: any, permissionId: string, isChecked: boolean) => {
    try {
      // Re-map active permissions array
      let updatedPermissions = [...role.permissions];
      if (isChecked) {
        if (!updatedPermissions.includes(permissionId)) {
          updatedPermissions.push(permissionId);
        }
      } else {
        updatedPermissions = updatedPermissions.filter((id) => id !== permissionId);
      }

      await updateRole({
        id: role._id,
        name: role.name,
        description: role.description,
        permissions: updatedPermissions,
      }).unwrap();

      toast.success(`Permission overrides saved for role: ${role.name}`);
      refetchRoles();
    } catch (err) {
      toast.error('Failed to override role permissions mapping');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-850 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">RBAC Security Controls</h1>
          <p className="mt-1.5 text-sm text-neutral-500">Map security credentials and permissions configurations to platform roles.</p>
        </div>
      </div>

      {rolesLoading || permissionsLoading ? (
        <div className="p-10 text-center text-xs text-neutral-500">Loading permission maps...</div>
      ) : (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-900/60 p-6 overflow-hidden">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-indigo-650" /> Access Authorization Matrix
            </h3>
            <p className="text-xs text-neutral-450 mt-1">Checkboxes map permissions to respective roles in real-time.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Permission Slug</th>
                  {roles.map((role: any) => (
                    <th key={role._id} className="pb-3 text-center font-semibold">
                      {role.name === 'super_admin' ? 'Super Admin' : role.name === 'admin' ? 'Admin' : 'Client User'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 text-neutral-700 dark:text-neutral-350">
                {permissions.map((perm: any) => (
                  <tr key={perm._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                    <td className="py-3.5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-neutral-900 dark:text-white">{perm.slug}</span>
                        <span className="text-[10px] text-neutral-450 mt-0.5">{perm.description}</span>
                      </div>
                    </td>
                    {roles.map((role: any) => {
                      const hasPermission = role.permissions.includes(perm._id);
                      const isSuperAdmin = role.name === 'super_admin';
                      return (
                        <td key={role._id} className="py-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={hasPermission || isSuperAdmin}
                            disabled={isSuperAdmin} // Super Admin cannot be downgraded
                            onChange={(e) => handleTogglePermission(role, perm._id, e.target.checked)}
                            className="rounded border-neutral-300 dark:border-neutral-800 h-4 w-4 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
export { AdminRbacPage };
