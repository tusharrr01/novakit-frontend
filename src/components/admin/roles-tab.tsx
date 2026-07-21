'use client';

import React, { useMemo, useState } from 'react';
import {
  Plus,
  Shield,
  Trash2,
  Pencil,
  ArrowRight,
  ShieldCheck,
  Check,
  RotateCcw,
  AlertTriangle,
  Info,
} from 'lucide-react';

type Role = {
  key: string;
  name: string;
  description: string;
  users: number;
  scopes: string[];
  system?: boolean;
};

const DEFAULT_SCOPES = [
  { key: 'users:read', label: 'View users', group: 'Users' },
  { key: 'users:write', label: 'Edit users', group: 'Users' },
  { key: 'products:read', label: 'View products', group: 'Products' },
  { key: 'products:write', label: 'Edit products', group: 'Products' },
  { key: 'billing:read', label: 'View billing', group: 'Billing' },
  { key: 'billing:write', label: 'Manage subscription settings', group: 'Billing' },
  { key: 'settings:write', label: 'Modify system preferences', group: 'System' },
];

const rolesSeed: Role[] = [
  {
    key: 'super_admin',
    name: 'Super Admin',
    description: 'Owner. Unlimited access to all configurations, user directories, billing systems and database records.',
    users: 1,
    scopes: DEFAULT_SCOPES.map((s) => s.key),
    system: true,
  },
  {
    key: 'admin',
    name: 'Administrator',
    description: 'Day-to-day manager. Access to users directory, product catalogue, FAQs and settings, except billing operations.',
    users: 2,
    scopes: ['users:read', 'users:write', 'products:read', 'products:write', 'settings:write'],
    system: true,
  },
  {
    key: 'author',
    name: 'Author',
    description: 'Template publisher. Can publish and update templates or designs in their catalogue. No system settings access.',
    users: 3,
    scopes: ['products:read', 'products:write'],
  },
  {
    key: 'customer',
    name: 'Customer',
    description: 'Standard end-user. Access is limited to downloads of purchased items and their own settings profile page.',
    users: 18204,
    scopes: ['products:read'],
    system: true,
  },
];

export function RolesTab() {
  const [items, setItems] = useState<Role[]>(rolesSeed);
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [editItem, setEditItem] = useState<Role | null>(null);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);

  if (view === 'add')
    return (
      <RoleForm
        onBack={() => setView('list')}
        onSave={(r) => {
          setItems((prev) => [...prev, { ...r, users: 0 }]);
          setView('list');
        }}
      />
    );

  if (view === 'edit' && editItem)
    return (
      <RoleForm
        role={editItem}
        onBack={() => {
          setView('list');
          setEditItem(null);
        }}
        onSave={(r) => {
          setItems((prev) => prev.map((x) => (x.key === editItem.key ? { ...x, ...r } : x)));
          setView('list');
          setEditItem(null);
        }}
      />
    );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold">Permission Management</h2>
            <p className="text-sm text-muted-foreground">
              Define granular administrative roles and control accessible scopes across team members.
            </p>
          </div>
          <button
            onClick={() => setView('add')}
            className="inline-flex items-center gap-2 rounded-md bg-brand-gradient px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand/20"
          >
            <Plus className="h-4 w-4" /> Add custom role
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((r) => {
            const hasAll = DEFAULT_SCOPES.every((s) => r.scopes.includes(s.key));
            return (
              <div key={r.key} className="relative overflow-hidden admin-card p-6 flex flex-col justify-between">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/10 blur-2xl" />
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                        {r.name}
                        {r.system && (
                          <span className="rounded-md border border-brand/30 bg-brand/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-brand">
                            System
                          </span>
                        )}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
                    </div>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
                      <Shield className="h-4 w-4 text-brand" />
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border/60 pt-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Active users</div>
                      <div className="mt-1 text-sm font-semibold">{r.users.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Access Level</div>
                      <div className="mt-1 text-xs font-medium text-brand">
                        {hasAll ? 'Full Access' : `${r.scopes.length} of ${DEFAULT_SCOPES.length} Scopes`}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-2 border-t border-border/60 pt-4">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase">{r.key}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditItem(r);
                        setView('edit');
                      }}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-muted-foreground hover:border-brand/40 hover:text-brand"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    {!r.system && (
                      <button
                        onClick={() => setDeleteKey(r.key)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {deleteKey && (
        <ConfirmDeleteModal
          title="Delete role?"
          description="This custom role will be deleted permanently. Any users holding this role will revert to the default Customer role."
          onCancel={() => setDeleteKey(null)}
          onConfirm={() => {
            setItems((prev) => prev.filter((r) => r.key !== deleteKey));
            setDeleteKey(null);
          }}
        />
      )}
    </div>
  );
}

function RoleForm({
  role,
  onBack,
  onSave,
}: {
  role?: Role;
  onBack: () => void;
  onSave: (r: Omit<Role, 'users'>) => void;
}) {
  const isEdit = !!role;
  const [name, setName] = useState(role?.name ?? '');
  const [key, setKey] = useState(role?.key ?? '');
  const [description, setDescription] = useState(role?.description ?? '');
  const [scopes, setScopes] = useState<string[]>(role?.scopes ?? []);

  function toggleScope(k: string) {
    setScopes((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !key.trim()) return;
    onSave({
      key: key.trim().toLowerCase().replace(/\s+/g, '_'),
      name: name.trim(),
      description: description.trim(),
      scopes,
      system: role?.system,
    });
  }

  const groups = useMemo(() => {
    const map: Record<string, typeof DEFAULT_SCOPES> = {};
    DEFAULT_SCOPES.forEach((s) => {
      if (!map[s.group]) map[s.group] = [];
      map[s.group].push(s);
    });
    return map;
  }, []);

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
          </button>
          <div>
            <h2 className="font-display text-2xl font-semibold">
              {isEdit ? `Edit role ${role!.name}` : 'Create custom role'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Define the identifying keys, titles and access scope controls.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand/20"
          >
            {isEdit ? 'Save changes' : 'Create role'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="admin-card p-6">
            <h3 className="font-display text-sm font-semibold">Basic properties</h3>
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Role name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Content Manager"
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand/60"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Role key</span>
                  <input
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    disabled={isEdit}
                    placeholder="e.g. content_manager"
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm font-mono outline-none focus:border-brand/60 disabled:opacity-60"
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Description</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Explain what this role is used for…"
                  className="w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-brand/60"
                />
              </label>
            </div>
          </div>

          <div className="admin-card p-6">
            <h3 className="font-display text-sm font-semibold">Scope definitions</h3>
            <p className="text-xs text-muted-foreground">Check the actions this role is authorized to perform.</p>
            <div className="mt-6 space-y-6">
              {Object.entries(groups).map(([g, items]) => (
                <div key={g} className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g}</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {items.map((s) => {
                      const checked = scopes.includes(s.key);
                      return (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => toggleScope(s.key)}
                          className={`flex items-start gap-3 rounded-lg border p-3 text-left transition hover:border-brand/40 ${
                            checked ? 'border-brand bg-brand/5 dark:bg-brand/10' : 'border-border bg-background'
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                              checked ? 'border-brand bg-brand-gradient text-white' : 'border-border bg-card'
                            }`}
                          >
                            {checked && <Check className="h-3 w-3" />}
                          </span>
                          <div>
                            <div className="text-xs font-semibold">{s.label}</div>
                            <code className="text-[10px] text-muted-foreground font-mono">{s.key}</code>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card p-6">
            <h3 className="font-display text-sm font-semibold flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand" /> Authorization summary
            </h3>
            <div className="mt-4 flex flex-col items-center border-b border-border/60 pb-5 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Shield className="h-6 w-6" />
              </span>
              <div className="mt-3 font-display text-base font-semibold">{name || 'Role Name'}</div>
              <code className="text-[10px] font-mono text-muted-foreground mt-0.5">{key || 'role_key'}</code>
            </div>
            <div className="mt-4 space-y-3 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Total permissions:</span>
                <span className="font-semibold text-foreground">{scopes.length} Scopes</span>
              </div>
              <div className="flex justify-between">
                <span>Access ratio:</span>
                <span className="font-semibold text-foreground">
                  {Math.round((scopes.length / DEFAULT_SCOPES.length) * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-semibold text-foreground">Active</span>
              </div>
            </div>
          </div>

          <div className="admin-card p-6">
            <h3 className="font-display text-sm font-semibold">Important note</h3>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Scope alterations apply immediately. Any users currently logged in under this role key will have their
              permissions updated upon their next page load or session check.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

function ConfirmDeleteModal({
  title,
  description,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
