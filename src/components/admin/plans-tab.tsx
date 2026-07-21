'use client';

import React, { useMemo, useState } from 'react';
import {
  Plus,
  Trash2,
  Pencil,
  Check,
  ChevronLeft,
  Download,
  Search,
  Filter,
  Info,
  Calendar,
  AlertTriangle,
  Receipt,
  RotateCcw,
  X,
} from 'lucide-react';

type Plan = {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  active: boolean;
  trialDays: number;
  popular?: boolean;
};

type CustomerPlan = {
  id: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  status: 'Active' | 'Trialing' | 'Past Due' | 'Canceled';
  amount: number;
  period: 'monthly' | 'yearly';
  startedAt: string; // ISO
  renewsAt: string; // ISO
};

const plansSeed: Plan[] = [
  { id: 'p_free', name: 'Free', price: 0, period: 'monthly', features: ['Access to 5 free designs/mo', 'Community support', 'Standard speed downloads'], active: true, trialDays: 0 },
  { id: 'p_pro', name: 'Pro', price: 29, period: 'monthly', features: ['Access to all Premium Templates', 'Priority author support', 'High speed downloads', 'Commercial license'], active: true, trialDays: 14, popular: true },
  { id: 'p_studio', name: 'Studio', price: 79, period: 'monthly', features: ['Access to all Templates & Designs', 'Dedicated developer slack channel', 'Ultra speed downloads', 'Extended team commercial license', 'Source figma project access'], active: true, trialDays: 30 },
];

const customerPlansSeed: CustomerPlan[] = [
  { id: 'sub_001', customerName: 'Ava Bennett', customerEmail: 'ava@bennett.co', planName: 'Studio', status: 'Active', amount: 79, period: 'monthly', startedAt: '2024-02-14', renewsAt: '2026-08-14' },
  { id: 'sub_002', customerName: 'Leo Martins', customerEmail: 'leo.martins@studio.co', planName: 'Pro', status: 'Active', amount: 29, period: 'monthly', startedAt: '2024-05-02', renewsAt: '2026-08-02' },
  { id: 'sub_003', customerName: 'Mira Chen', customerEmail: 'mira.chen@labs.io', planName: 'Pro', status: 'Past Due', amount: 29, period: 'monthly', startedAt: '2025-01-19', renewsAt: '2026-07-19' },
  { id: 'sub_004', customerName: 'Jonah Reed', customerEmail: 'jonah@reed.dev', planName: 'Free', status: 'Active', amount: 0, period: 'monthly', startedAt: '2026-07-01', renewsAt: '2026-08-01' },
  { id: 'sub_005', customerName: 'Sana Iqbal', customerEmail: 'sana.iqbal@shop.pk', planName: 'Studio', status: 'Active', amount: 79, period: 'monthly', startedAt: '2023-11-08', renewsAt: '2026-08-08' },
  { id: 'sub_006', customerName: 'Noah Fischer', customerEmail: 'noah@fischer.de', planName: 'Pro', status: 'Trialing', amount: 0, period: 'monthly', startedAt: '2026-07-10', renewsAt: '2026-07-24' },
];

export function PlansTab({ sub }: { sub: 'management' | 'customers' }) {
  const [plans, setPlans] = useState<Plan[]>(plansSeed);
  const [customerPlans, setCustomerPlans] = useState<CustomerPlan[]>(customerPlansSeed);

  if (sub === 'management') {
    return <PlanManagement plans={plans} setPlans={setPlans} />;
  }
  return <CustomerPlans list={customerPlans} setList={setCustomerPlans} />;
}

/* ---------------- PLANS MANAGEMENT ---------------- */

function PlanManagement({ plans, setPlans }: { plans: Plan[]; setPlans: React.Dispatch<React.SetStateAction<Plan[]>> }) {
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [editItem, setEditItem] = useState<Plan | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (view === 'add') {
    return (
      <AddPlanView
        onBack={() => setView('list')}
        onSave={(p) => {
          setPlans((prev) => [...prev, { ...p, id: `p_${Date.now()}` }]);
          setView('list');
        }}
      />
    );
  }

  if (view === 'edit' && editItem) {
    return (
      <AddPlanView
        item={editItem}
        onBack={() => {
          setView('list');
          setEditItem(null);
        }}
        onSave={(p) => {
          setPlans((prev) => prev.map((x) => (x.id === editItem.id ? { ...x, ...p } : x)));
          setView('list');
          setEditItem(null);
        }}
      />
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold">Plan Management</h2>
            <p className="text-sm text-muted-foreground">
              Configure subscription tiers, monthly and annual prices, and custom feature sets.
            </p>
          </div>
          <button
            onClick={() => setView('add')}
            className="inline-flex items-center gap-2 rounded-md bg-brand-gradient px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand/20"
          >
            <Plus className="h-4 w-4" /> Add custom plan
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto thin-scrollbar pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`relative overflow-hidden admin-card p-6 flex flex-col justify-between border ${
                p.popular ? 'border-brand' : 'border-border'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                      {p.name}
                      {p.popular && (
                        <span className="rounded-md bg-brand-gradient px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
                          Popular
                        </span>
                      )}
                    </h3>
                    <p className="mt-1 text-sm font-display font-semibold">
                      ${p.price} <span className="text-xs font-normal text-muted-foreground">/ {p.period}</span>
                    </p>
                  </div>
                  <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${
                    p.active ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground'
                  }`}>
                    {p.active ? 'Active' : 'Archived'}
                  </span>
                </div>

                <div className="mt-5 space-y-2 text-sm text-muted-foreground border-t border-border/60 pt-4">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <Check className="h-4 w-4 shrink-0 text-brand mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-2 border-t border-border/60 pt-4">
                <span className="text-xs text-muted-foreground">
                  {p.trialDays > 0 ? `${p.trialDays}-day trial` : 'No trial'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditItem(p);
                      setView('edit');
                    }}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-muted-foreground hover:border-brand/40 hover:text-brand"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(p.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {deleteId && (
        <ConfirmDeleteModal
          title="Delete pricing plan?"
          description="Are you sure you want to delete this plan? This will prevent new signups, but current active subscribers will remain on their current plan."
          onCancel={() => setDeleteId(null)}
          onConfirm={() => {
            setPlans((prev) => prev.filter((p) => p.id !== deleteId));
            setDeleteId(null);
          }}
        />
      )}
    </div>
  );
}

function AddPlanView({
  item,
  onBack,
  onSave,
}: {
  item?: Plan;
  onBack: () => void;
  onSave: (p: Omit<Plan, 'id'>) => void;
}) {
  const isEdit = !!item;
  const [name, setName] = useState(item?.name ?? '');
  const [price, setPrice] = useState<number>(item?.price ?? 0);
  const [period, setPeriod] = useState<Plan['period']>(item?.period ?? 'monthly');
  const [active, setActive] = useState<boolean>(item?.active ?? true);
  const [trialDays, setTrialDays] = useState<number>(item?.trialDays ?? 0);
  const [popular, setPopular] = useState<boolean>(item?.popular ?? false);
  const [features, setFeatures] = useState<string[]>(item?.features ?? ['']);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      price: Number(price) || 0,
      period,
      active,
      trialDays: Number(trialDays) || 0,
      popular,
      features: features.map((f) => f.trim()).filter(Boolean),
    });
  }

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
              {isEdit ? `Edit tier ${item!.name}` : 'Create pricing plan'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Define subscription settings, pricing levels, trial rules and limits.
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
            {isEdit ? 'Save changes' : 'Create plan'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="admin-card p-6">
            <h3 className="font-display text-sm font-semibold">Details</h3>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Plan name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pro Suite"
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand/60"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Base price (USD)</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value) || 0)}
                    min={0}
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand/60"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Billing interval</span>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as Plan['period'])}
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand/60"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Trial duration (days)</span>
                  <input
                    type="number"
                    value={trialDays}
                    onChange={(e) => setTrialDays(Number(e.target.value) || 0)}
                    min={0}
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand/60"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="admin-card p-6">
            <h3 className="font-display text-sm font-semibold flex items-center justify-between">
              Included features
              <button
                type="button"
                onClick={() => setFeatures((f) => [...f, ''])}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
              >
                <Plus className="h-3 w-3" /> Add bullet
              </button>
            </h3>
            <div className="mt-4 space-y-3">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs font-mono opacity-50">#{i + 1}</span>
                  <input
                    value={f}
                    onChange={(e) => {
                      const next = [...features];
                      next[i] = e.target.value;
                      setFeatures(next);
                    }}
                    placeholder="e.g. Access to 100+ figma UI elements"
                    className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand/60"
                  />
                  <button
                    type="button"
                    onClick={() => setFeatures((prev) => prev.filter((_, x) => x !== i))}
                    className="p-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card p-6">
            <h3 className="font-display text-sm font-semibold">Status settings</h3>
            <div className="mt-4 space-y-4">
              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-background p-3 hover:border-brand/40">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="mt-0.5 h-4 w-4"
                />
                <span className="text-sm">
                  <span className="block font-medium">Publish plan</span>
                  <span className="text-xs text-muted-foreground">Make it available for user signups.</span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-background p-3 hover:border-brand/40">
                <input
                  type="checkbox"
                  checked={popular}
                  onChange={(e) => setPopular(e.target.checked)}
                  className="mt-0.5 h-4 w-4"
                />
                <span className="text-sm">
                  <span className="block font-medium">Highlight Popular Badge</span>
                  <span className="text-xs text-muted-foreground">Render with custom brand border.</span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

/* ---------------- CUSTOMER PLANS VIEW ---------------- */

function CustomerPlans({
  list,
  setList,
}: {
  list: CustomerPlan[];
  setList: React.Dispatch<React.SetStateAction<CustomerPlan[]>>;
}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'All' | CustomerPlan['status']>('All');
  const [plan, setPlan] = useState<'All' | 'Free' | 'Pro' | 'Studio'>('All');
  const [viewItem, setViewItem] = useState<CustomerPlan | null>(null);
  const [editItem, setEditItem] = useState<CustomerPlan | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((c) => {
      if (status !== 'All' && c.status !== status) return false;
      if (plan !== 'All' && c.planName !== plan) return false;
      if (q && !`${c.customerName} ${c.customerEmail} ${c.id}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [list, query, status, plan]);

  function exportCsv() {
    const rows = [
      ['subscription_id', 'customer_name', 'customer_email', 'plan_name', 'status', 'amount', 'period', 'started_at', 'renews_at'],
      ...filtered.map((c) => [
        c.id,
        c.customerName,
        c.customerEmail,
        c.planName,
        c.status,
        String(c.amount),
        c.period,
        c.startedAt,
        c.renewsAt,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer-plans.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold">Customer Subscription Plans</h2>
            <p className="text-sm text-muted-foreground">
              {filtered.length} of {list.length} subscribers active, trialing or past due.
            </p>
          </div>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 admin-card-static p-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customer, email or ID…"
              className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-4 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="bg-transparent text-xs outline-none"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Trialing">Trialing</option>
              <option value="Past Due">Past Due</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1">
            <Receipt className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as typeof plan)}
              className="bg-transparent text-xs outline-none"
            >
              <option value="All">All tiers</option>
              <option value="Free">Free</option>
              <option value="Pro">Pro</option>
              <option value="Studio">Studio</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto thin-scrollbar pt-6">
        <div className="overflow-hidden admin-card-static">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-accent/30">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Plan tier</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Billing Started</th>
                  <th className="p-3">Next Renewal</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-accent/20">
                    <td className="p-3">
                      <div>
                        <div className="font-semibold text-foreground">{c.customerName}</div>
                        <div className="text-xs text-muted-foreground">{c.customerEmail}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${
                        c.planName === 'Studio' ? 'bg-brand/20 text-brand border-brand/20' : 'bg-muted text-muted-foreground border-border'
                      }`}>
                        {c.planName}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                        c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        c.status === 'Trialing' ? 'bg-sky-500/10 text-sky-500 border-sky-500/20' :
                        c.status === 'Past Due' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 font-medium">
                      ${c.amount} <span className="text-[10px] text-muted-foreground">/ {c.period}</span>
                    </td>
                    <td className="p-3 text-muted-foreground">{c.startedAt}</td>
                    <td className="p-3 text-muted-foreground">{c.renewsAt}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewItem(c)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:border-brand/40 hover:text-brand"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditItem(c)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:border-brand/40 hover:text-brand"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-sm text-muted-foreground">
                      No customer subscriptions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewItem(null)}>
          <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-display text-lg font-semibold">Subscription details</h3>
              <button onClick={() => setViewItem(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Customer</div>
                <div className="font-semibold text-base">{viewItem.customerName}</div>
                <div className="text-sm text-muted-foreground">{viewItem.customerEmail}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Plan tier</div>
                  <div className="font-semibold text-sm">{viewItem.planName}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Amount</div>
                  <div className="font-semibold text-sm">${viewItem.amount} / {viewItem.period}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Started date</div>
                  <div className="text-sm">{viewItem.startedAt}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Renewal date</div>
                  <div className="text-sm">{viewItem.renewsAt}</div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setViewItem(null)}
                className="rounded-md border border-border bg-background px-4 py-2 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditItem(null)}>
          <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg font-semibold">Edit subscription status</h3>
            <p className="text-xs text-muted-foreground mt-1">Modify status parameters for {editItem.customerName}.</p>
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground">
                Plan tier
                <select
                  value={editItem.planName}
                  onChange={(e) => setList((prev) => prev.map((x) => (x.id === editItem.id ? { ...x, planName: e.target.value } : x)))}
                  className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
                >
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Studio">Studio</option>
                </select>
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                Subscription Status
                <select
                  value={editItem.status}
                  onChange={(e) => setList((prev) => prev.map((x) => (x.id === editItem.id ? { ...x, status: e.target.value as CustomerPlan['status'] } : x)))}
                  className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Trialing">Trialing</option>
                  <option value="Past Due">Past Due</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditItem(null)}
                className="rounded-md bg-brand-gradient px-4 py-2 text-sm text-white font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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
