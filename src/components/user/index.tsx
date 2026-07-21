'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Info,
  Pencil,
  Trash2,
  X,
  Mail,
  User as UserIcon,
  Phone,
  MapPin,
  Shield,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Wallet,
  ShoppingBag,
  TrendingUp,
  Activity,
  Globe,
  Star,
  CreditCard,
  Download,
} from 'lucide-react';
import { DataTable, ColumnDef } from '@/src/components/shared/DataTable';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Author' | 'Admin';
  plan: 'Free' | 'Pro' | 'Studio';
  status: 'Active' | 'Invited' | 'Suspended';
  spend: number;
  orders: number;
  joined: string; // ISO
  lastActive: string; // ISO
  country: string;
};

const usersSeed: User[] = [
  { id: 'u_001', name: 'Ava Bennett', email: 'ava@bennett.co', role: 'Admin', plan: 'Studio', status: 'Active', spend: 1249.5, orders: 18, joined: '2024-02-14', lastActive: '2026-07-09', country: 'US' },
  { id: 'u_002', name: 'Leo Martins', email: 'leo.martins@studio.co', role: 'Author', plan: 'Pro', status: 'Active', spend: 812.0, orders: 12, joined: '2024-05-02', lastActive: '2026-07-08', country: 'PT' },
  { id: 'u_003', name: 'Mira Chen', email: 'mira.chen@labs.io', role: 'Customer', plan: 'Pro', status: 'Suspended', spend: 349.0, orders: 5, joined: '2025-01-19', lastActive: '2026-06-22', country: 'SG' },
  { id: 'u_004', name: 'Jonah Reed', email: 'jonah@reed.dev', role: 'Customer', plan: 'Free', status: 'Invited', spend: 0, orders: 0, joined: '2026-07-01', lastActive: '2026-07-01', country: 'UK' },
  { id: 'u_005', name: 'Sana Iqbal', email: 'sana.iqbal@shop.pk', role: 'Customer', plan: 'Studio', status: 'Active', spend: 2140.75, orders: 22, joined: '2023-11-08', lastActive: '2026-07-09', country: 'PK' },
  { id: 'u_006', name: 'Noah Fischer', email: 'noah@fischer.de', role: 'Customer', plan: 'Pro', status: 'Active', spend: 588.0, orders: 9, joined: '2024-08-30', lastActive: '2026-07-07', country: 'DE' },
  { id: 'u_007', name: 'Priya Nair', email: 'priya.nair@studio.in', role: 'Author', plan: 'Studio', status: 'Active', spend: 1780.25, orders: 15, joined: '2024-03-11', lastActive: '2026-07-06', country: 'IN' },
  { id: 'u_008', name: 'Diego Alvarez', email: 'diego@alvarez.mx', role: 'Customer', plan: 'Free', status: 'Active', spend: 0, orders: 0, joined: '2026-05-20', lastActive: '2026-07-05', country: 'MX' },
  { id: 'u_009', name: 'Yuki Tanaka', email: 'yuki@tanaka.jp', role: 'Customer', plan: 'Pro', status: 'Active', spend: 442.5, orders: 7, joined: '2025-06-01', lastActive: '2026-07-09', country: 'JP' },
  { id: 'u_010', name: 'Emma Wallace', email: 'emma@wallace.au', role: 'Customer', plan: 'Pro', status: 'Active', spend: 928.0, orders: 11, joined: '2024-12-14', lastActive: '2026-07-04', country: 'AU' },
  { id: 'u_011', name: 'Marc Dubois', email: 'marc@dubois.fr', role: 'Customer', plan: 'Free', status: 'Suspended', spend: 49.0, orders: 1, joined: '2025-09-09', lastActive: '2026-02-11', country: 'FR' },
  { id: 'u_012', name: 'Aisha Khan', email: 'aisha@khan.ae', role: 'Author', plan: 'Studio', status: 'Active', spend: 3120.0, orders: 27, joined: '2023-07-22', lastActive: '2026-07-08', country: 'AE' },
];

type SortKey = 'name' | 'email' | 'role' | 'plan' | 'status' | 'spend' | 'orders' | 'joined' | 'lastActive';
type SortDir = 'asc' | 'desc';

function PlanPill({ plan }: { plan: string }) {
  const map: Record<string, string> = {
    Free: 'bg-muted text-muted-foreground border-border',
    Pro: 'bg-brand/10 text-brand border-brand/20 dark:bg-brand/25',
    Studio: 'bg-brand-gradient text-white border-transparent',
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${map[plan] ?? ''}`}>
      {plan}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/20',
    Active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/20',
    Pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 dark:bg-yellow-500/20',
    Invited: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 dark:bg-yellow-500/20',
    Refunded: 'bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20',
    Suspended: 'bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20',
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${map[status] ?? ''}`}>
      {status}
    </span>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatRelative(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function SortableTh({
  label,
  sortKey,
  activeKey,
  dir,
  onClick,
  align = 'left',
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  dir: SortDir;
  onClick: (k: SortKey) => void;
  align?: 'left' | 'right';
}) {
  const active = sortKey === activeKey;
  return (
    <th className={`p-3 font-medium ${align === 'right' ? 'text-right' : ''}`}>
      <button
        onClick={() => onClick(sortKey)}
        className={`inline-flex items-center gap-1 hover:text-foreground ${active ? 'text-foreground' : ''}`}
      >
        {label}
        {active ? (
          dir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronsUpDown className="h-3 w-3 opacity-60" />
        )}
      </button>
    </th>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <label className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs">
      {icon}
      <span className="text-muted-foreground">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-xs font-medium outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function UsersTab() {
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(usersSeed);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<'All' | User['role']>('All');
  const [plan, setPlan] = useState<'All' | User['plan']>('All');
  const [status, setStatus] = useState<'All' | User['status']>('All');
  const [sortKey, setSortKey] = useState<SortKey>('joined');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [infoUser, setInfoUser] = useState<User | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (role !== 'All' && u.role !== role) return false;
      if (plan !== 'All' && u.plan !== plan) return false;
      if (status !== 'All' && u.status !== status) return false;
      if (q && !`${u.name} ${u.email} ${u.country}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, role, plan, status, users]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      let cmp = 0;
      if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
      else cmp = String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function toggleSelect(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  const allSelected = sorted.length > 0 && sorted.every((u) => selected.has(u.id));
  function toggleSelectAll() {
    setSelected((s) => {
      if (allSelected) {
        const next = new Set(s);
        sorted.forEach((u) => next.delete(u.id));
        return next;
      }
      const next = new Set(s);
      sorted.forEach((u) => next.add(u.id));
      return next;
    });
  }

  const totalSpend = sorted.reduce((s, u) => s + u.spend, 0);

  if (view === 'add') return <AddUserView onBack={() => setView('list')} />;
  if (view === 'edit' && editUser)
    return (
      <AddUserView
        user={editUser}
        onBack={() => {
          setView('list');
          setEditUser(null);
        }}
      />
    );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold">Users</h2>
            <p className="text-sm text-muted-foreground">
              {sorted.length} of {users.length} shown · ${totalSpend.toLocaleString()} lifetime spend
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('add')}
              className="inline-flex items-center gap-2 rounded-md bg-brand-gradient px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand/20"
            >
              <Plus className="h-4 w-4" /> Add user
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-2 admin-card-static p-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email or country…"
              className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-4 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <FilterSelect
            icon={<Filter className="h-3.5 w-3.5" />}
            label="Role"
            value={role}
            options={['All', 'Customer', 'Author', 'Admin']}
            onChange={(v) => setRole(v as typeof role)}
          />
          <FilterSelect
            label="Plan"
            value={plan}
            options={['All', 'Free', 'Pro', 'Studio']}
            onChange={(v) => setPlan(v as typeof plan)}
          />
          <FilterSelect
            label="Status"
            value={status}
            options={['All', 'Active', 'Invited', 'Suspended']}
            onChange={(v) => setStatus(v as typeof status)}
          />
          {(query || role !== 'All' || plan !== 'All' || status !== 'All') && (
            <button
              onClick={() => {
                setQuery('');
                setRole('All');
                setPlan('All');
                setStatus('All');
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pt-6">
        {selected.size > 0 && (
          <div className="flex items-center justify-between rounded-lg border border-brand/30 bg-brand/5 p-3 text-sm mb-4">
            <span>{selected.size} selected</span>
            <div className="flex items-center gap-2">
              <button className="rounded-md border border-border bg-card px-3 py-1 text-xs">Email</button>
              <button className="rounded-md border border-border bg-card px-3 py-1 text-xs">Suspend</button>
              <button className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs text-destructive">
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <DataTable
          data={sorted}
          columns={[
            {
              header: 'User',
              cell: (row) => (
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
                    {row.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </span>
                  <div>
                    <div className="font-medium">{row.name}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{row.country}</div>
                  </div>
                </div>
              ),
              sortable: true,
              sortKey: 'name',
            },
            {
              header: 'Email',
              accessorKey: 'email',
              sortable: true,
            },
            {
              header: 'Role',
              accessorKey: 'role',
              sortable: true,
            },
            {
              header: 'Status',
              cell: (row) => <StatusPill status={row.status} />,
              sortable: true,
              sortKey: 'status',
            },
            {
              header: 'Spend',
              cell: (row) => <span className="font-medium">${row.spend.toLocaleString()}</span>,
              sortable: true,
              sortKey: 'spend',
              className: 'text-right',
            },
          ]}
          selectedIds={Array.from(selected)}
          onSelectionChange={(ids) => setSelected(new Set(ids))}
          onSortChange={(sortBy) => toggleSort(sortBy as any)}
          renderActions={(row) => (
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => setInfoUser(row)}
                title="View details"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:border-brand/40 hover:text-brand"
              >
                <Info className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditUser(row);
                  setView('edit');
                }}
                title="Edit user"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:border-brand/40 hover:text-brand"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteUserId(row.id)}
                title="Delete user"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
          pagination={false}
          getRowId={(row) => row.id}
        />
      </div>

      {infoUser && <UserInfoModal user={infoUser} onClose={() => setInfoUser(null)} />}
      {deleteUserId && (
        <ConfirmDeleteModal
          title="Delete user?"
          description="This action cannot be undone. The user will be permanently removed from the system."
          onCancel={() => setDeleteUserId(null)}
          onConfirm={() => {
            setUsers((prev) => prev.filter((u) => u.id !== deleteUserId));
            setSelected((s) => {
              const next = new Set(s);
              next.delete(deleteUserId);
              return next;
            });
            setDeleteUserId(null);
          }}
        />
      )}
    </div>
  );
}

function AddUserView({ onBack, user }: { onBack: () => void; user?: User }) {
  const isEdit = !!user;
  const locked = isEdit && user!.status !== 'Invited';
  const [firstInit, ...restInit] = user ? user.name.split(' ') : [''];
  const [form, setForm] = useState({
    firstName: user ? firstInit ?? '' : '',
    lastName: user ? restInit.join(' ') : '',
    email: user?.email ?? '',
    phone: '',
    country: user?.country ?? '',
    city: '',
    role: (user?.role ?? 'Customer') as User['role'],
    plan: (user?.plan ?? 'Free') as User['plan'],
    status: (user?.status ?? 'Invited') as User['status'],
    password: '',
    sendInvite: true,
    twoFactor: false,
    notes: '',
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onBack();
  }

  const initials =
    (form.firstName[0] ?? '') + (form.lastName[0] ?? '') || 'NU';

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="font-display text-2xl font-semibold">
              {isEdit ? `Edit ${user!.name}` : 'Add new user'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEdit
                ? locked
                  ? 'This user has accepted their invite — only role and internal notes can be changed.'
                  : 'Update this invited user\'s details, role, plan or status.'
                : 'Create an account, assign a role and plan, and optionally send an invite email.'}
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
            className="inline-flex items-center gap-2 rounded-md bg-brand-gradient px-5 py-2 text-sm font-medium text-white shadow-lg shadow-brand/20"
          >
            <Plus className="h-4 w-4" /> {isEdit ? 'Save changes' : 'Create user'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Personal information" desc="Basic identity details for the new account.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" required>
                <Input
                  value={form.firstName}
                  onChange={(v) => update('firstName', v)}
                  placeholder="Ava"
                  icon={<UserIcon className="h-4 w-4" />}
                  disabled={locked}
                />
              </Field>
              <Field label="Last name" required>
                <Input
                  value={form.lastName}
                  onChange={(v) => update('lastName', v)}
                  placeholder="Bennett"
                  icon={<UserIcon className="h-4 w-4" />}
                  disabled={locked}
                />
              </Field>
              <Field label="Email" required>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(v) => update('email', v)}
                  placeholder="ava@company.com"
                  icon={<Mail className="h-4 w-4" />}
                  disabled={locked}
                />
              </Field>
              <Field label="Phone">
                <Input
                  value={form.phone}
                  onChange={(v) => update('phone', v)}
                  placeholder="+1 555 000 1234"
                  icon={<Phone className="h-4 w-4" />}
                  disabled={locked}
                />
              </Field>
              <Field label="Country">
                <Input
                  value={form.country}
                  onChange={(v) => update('country', v)}
                  placeholder="United States"
                  icon={<MapPin className="h-4 w-4" />}
                  disabled={locked}
                />
              </Field>
              <Field label="City">
                <Input
                  value={form.city}
                  onChange={(v) => update('city', v)}
                  placeholder="San Francisco"
                  icon={<MapPin className="h-4 w-4" />}
                  disabled={locked}
                />
              </Field>
            </div>
          </Section>

          <Section title="Access & permissions" desc="Choose the account role, plan and initial status.">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Role">
                <Select
                  value={form.role}
                  onChange={(v) => update('role', v as User['role'])}
                  options={['Customer', 'Author', 'Admin']}
                />
              </Field>
              <Field label="Plan">
                <Select
                  value={form.plan}
                  onChange={(v) => update('plan', v as User['plan'])}
                  options={['Free', 'Pro', 'Studio']}
                  disabled={locked}
                />
              </Field>
              <Field label="Status">
                <Select
                  value={form.status}
                  onChange={(v) => update('status', v as User['status'])}
                  options={['Invited', 'Active', 'Suspended']}
                  disabled={locked}
                />
              </Field>
            </div>
          </Section>

          {!isEdit && (
            <Section title="Security" desc="Set a temporary password or let the user create one via invite.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Temporary password">
                  <Input
                    type="text"
                    value={form.password}
                    onChange={(v) => update('password', v)}
                    placeholder="Auto-generate on invite"
                    icon={<Shield className="h-4 w-4" />}
                  />
                </Field>
                <div className="flex flex-col justify-end gap-3">
                  <Toggle
                    label="Send invite email"
                    desc="Email the user a link to set their password."
                    checked={form.sendInvite}
                    onChange={(v) => update('sendInvite', v)}
                  />
                  <Toggle
                    label="Require 2FA"
                    desc="User must enable two-factor on first login."
                    checked={form.twoFactor}
                    onChange={(v) => update('twoFactor', v)}
                  />
                </div>
              </div>
            </Section>
          )}

          <Section title="Internal notes" desc="Only visible to admins.">
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={4}
              placeholder="Context, source of signup, agreements…"
              className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
            />
          </Section>
        </div>

        <div className="space-y-6">
          <div className="admin-card p-6">
            <h3 className="font-display text-base font-semibold">Profile preview</h3>
            <p className="text-xs text-muted-foreground">Live preview of the new user card.</p>
            <div className="mt-5 flex flex-col items-center text-center">
              <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand-gradient text-2xl font-semibold text-white shadow-lg shadow-brand/20">
                {initials.toUpperCase()}
              </span>
              <div className="mt-4 font-display text-lg font-semibold">
                {form.firstName || form.lastName
                  ? `${form.firstName} ${form.lastName}`.trim()
                  : 'New user'}
              </div>
              <div className="text-sm text-muted-foreground">
                {form.email || 'no-email@novakit.app'}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <PlanPill plan={form.plan} />
                <StatusPill status={form.status} />
                <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground">
                  {form.role}
                </span>
              </div>
            </div>
            {!isEdit && (
              <button
                type="button"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Upload className="h-4 w-4" /> Upload avatar
              </button>
            )}
          </div>

          <div className="admin-card p-6">
            <h3 className="font-display text-base font-semibold">Quick tips</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                Admins have full access to the dashboard and billing.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                Authors can publish and manage their own templates.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                Invited users are inactive until they accept the email.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-card p-6">
      <div className="mb-4">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  icon,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`h-10 w-full rounded-md border border-border bg-background pr-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60 ${
          icon ? 'pl-9' : 'pl-3'
        }`}
      />
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function Toggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-start justify-between gap-4 rounded-md border border-border bg-background p-3 text-left hover:border-brand/40"
    >
      <div>
        <div className="text-sm font-medium">{label}</div>
        {desc && <div className="text-xs text-muted-foreground">{desc}</div>}
      </div>
      <span
        className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${
          checked ? 'bg-brand-gradient' : 'bg-muted'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  );
}

function UserInfoModal({ user, onClose }: { user: User; onClose: () => void }) {
  const initials = user.name.split(' ').map((n) => n[0]).slice(0, 2).join('');
  const avgOrder = user.orders > 0 ? user.spend / user.orders : 0;
  const statusTone =
    user.status === 'Active'
      ? { dot: 'bg-emerald-500', ring: 'ring-emerald-500/30', icon: CheckCircle2 }
      : user.status === 'Invited'
      ? { dot: 'bg-amber-500', ring: 'ring-amber-500/30', icon: Clock }
      : { dot: 'bg-rose-500', ring: 'ring-rose-500/30', icon: AlertTriangle };
  const StatusIcon = statusTone.icon;

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm animate-in fade-in duration-200 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-md border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <div className="relative h-24 rounded-t-3xl bg-brand-gradient overflow-hidden sm:h-28">
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px),radial-gradient(circle_at_80%_60%,white_1px,transparent_1px)] [background-size:32px_32px,48px_48px]" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/40 hover:scale-105"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute left-5 top-3 inline-flex items-center gap-1.5 rounded-md bg-black/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-sm sm:left-6">
            <Shield className="h-3 w-3" /> {user.role}
          </div>
        </div>

        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="-mt-10 flex flex-col gap-3 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-3 sm:gap-4">
              <div className="relative">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-lg border-4 border-card bg-brand-gradient text-xl font-semibold text-white shadow-xl sm:h-20 sm:w-20 sm:text-2xl">
                  {initials}
                </span>
                <span className={`absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-card ${statusTone.dot} ring-4 ${statusTone.ring}`}>
                  <StatusIcon className="h-3 w-3 text-white" />
                </span>
              </div>
              <div className="pb-1">
                <h3 className="font-display text-xl font-semibold leading-tight sm:text-2xl">{user.name}</h3>
                <a href={`mailto:${user.email}`} className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition sm:text-sm">
                  <Mail className="h-3.5 w-3.5" /> {user.email}
                </a>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <PlanPill plan={user.plan} />
                  <StatusPill status={user.status} />
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {user.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-3">
            <StatCard
              icon={Wallet}
              label="Lifetime spend"
              value={`$${user.spend.toLocaleString()}`}
              sub={`Avg $${avgOrder.toFixed(2)} / order`}
              accent="from-emerald-500/20 to-emerald-500/0"
              iconClass="text-emerald-500 bg-emerald-500/10"
            />
            <StatCard
              icon={ShoppingBag}
              label="Orders"
              value={String(user.orders)}
              sub={user.orders > 0 ? 'Purchases to date' : 'No purchases yet'}
              accent="from-primary/20 to-primary/0"
              iconClass="text-primary bg-primary/10"
            />
            <StatCard
              icon={TrendingUp}
              label="Engagement"
              value={user.status === 'Active' ? 'High' : user.status === 'Invited' ? 'New' : 'Low'}
              sub={`Since ${formatDate(user.joined)}`}
              accent="from-amber-500/20 to-amber-500/0"
              iconClass="text-amber-500 bg-amber-500/10"
            />
          </div>

          <div className="mt-4 grid gap-3 sm:mt-6 md:grid-cols-5">
            <div className="rounded-lg border border-border bg-background/50 p-3 sm:p-4 md:col-span-3">
              <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:mb-3">
                <UserIcon className="h-3.5 w-3.5" /> Profile details
              </h4>
              <div className="grid gap-2 sm:grid-cols-2">
                <DetailRow icon={Globe} label="Country" value={user.country} />
                <DetailRow icon={Shield} label="Role" value={user.role} />
                <DetailRow icon={CreditCard} label="Plan" value={user.plan} />
                <DetailRow icon={StatusIcon} label="Status" value={user.status} />
                <DetailRow icon={Star} label="Joined" value={formatDate(user.joined)} />
                <DetailRow icon={Activity} label="Last active" value={formatRelative(user.lastActive)} />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-3 sm:p-4 md:col-span-2">
              <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:mb-3">
                <Activity className="h-3.5 w-3.5" /> Recent activity
              </h4>
              <ol className="relative space-y-3 border-l border-border pl-4 sm:space-y-4">
                <TimelineItem
                  tone="bg-emerald-500"
                  title={`Signed in from ${user.country}`}
                  time={formatRelative(user.lastActive)}
                />
                <TimelineItem
                  tone="bg-primary"
                  title="Purchased template"
                  time="3 days ago"
                />
                <TimelineItem
                  tone="bg-amber-500"
                  title="Updated profile"
                  time="2 weeks ago"
                />
                <TimelineItem
                  tone="bg-muted-foreground"
                  title="Account created"
                  time={formatDate(user.joined)}
                />
              </ol>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-3 sm:mt-6 sm:pt-4">
            <button
              onClick={onClose}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground sm:px-4 sm:py-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  iconClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  accent: string;
  iconClass: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-background p-4">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} pointer-events-none`} />
      <div className="relative">
        <div className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${iconClass}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-0.5 font-display text-xl font-semibold">{value}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border/60 bg-card px-3 py-2 transition hover:border-primary/30">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

function TimelineItem({ tone, title, time }: { tone: string; title: string; time: string }) {
  return (
    <li className="relative">
      <span className={`absolute -left-[21px] top-1 inline-flex h-2.5 w-2.5 rounded-full ${tone} ring-4 ring-background`} />
      <div className="text-sm font-medium">{title}</div>
      <div className="text-[11px] text-muted-foreground">{time}</div>
    </li>
  );
}

function ConfirmDeleteModal({
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = 'Delete',
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
      >
        <div className="p-6">
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
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
