'use client';

import React from 'react';
import {
  Wallet,
  ShoppingBag,
  Users as UsersIcon,
  BarChart3,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Eye,
  Activity,
  Star,
  MessageSquare,
  AlertTriangle,
  CreditCard,
} from 'lucide-react';

const stats = [
  { label: 'Revenue', value: '$128,430', delta: '+12.4%', up: true, icon: Wallet, sub: 'MRR $42.1k' },
  { label: 'Orders', value: '2,341', delta: '+8.1%', up: true, icon: ShoppingBag, sub: '184 today' },
  { label: 'Customers', value: '18,204', delta: '+3.2%', up: true, icon: UsersIcon, sub: '312 new' },
  { label: 'Refund rate', value: '1.2%', delta: '-0.3%', up: false, icon: BarChart3, sub: '28 refunds' },
  { label: 'Active licenses', value: '9,812', delta: '+5.7%', up: true, icon: CheckCircle2, sub: '94% healthy' },
  { label: 'Avg. order value', value: '$54.90', delta: '+2.1%', up: true, icon: TrendingUp, sub: 'Up from $53.75' },
];

const orders = [
  { id: '#NK-4021', customer: 'Ava Bennett', product: 'Aurora Admin', amount: '$49', status: 'Paid' },
  { id: '#NK-4020', customer: 'Leo Martins', product: 'Nimbus AI Chat', amount: '$39', status: 'Paid' },
  { id: '#NK-4019', customer: 'Mira Chen', product: 'Prism SaaS', amount: '$89', status: 'Refunded' },
  { id: '#NK-4018', customer: 'Jonah Reed', product: 'Zenith Landing', amount: '$29', status: 'Pending' },
  { id: '#NK-4017', customer: 'Sana Iqbal', product: 'Cobalt Commerce', amount: '$59', status: 'Paid' },
];

const activity = [
  { icon: ShoppingBag, text: 'New order from Ava Bennett', meta: 'Aurora Admin · $49', time: '2m ago' },
  { icon: UsersIcon, text: 'New signup', meta: 'leo.martins@studio.co', time: '14m ago' },
  { icon: Star, text: '5★ review on Prism SaaS', meta: '“Best template I\'ve bought”', time: '38m ago' },
  { icon: AlertTriangle, text: 'Refund requested', meta: '#NK-4019 · Mira Chen', time: '1h ago' },
  { icon: MessageSquare, text: 'New support ticket', meta: 'Zenith Landing · Priority', time: '2h ago' },
  { icon: CreditCard, text: 'Payout completed', meta: '$8,412 to bank ••4021', time: '5h ago' },
];

const trafficSources = [
  { label: 'Direct', value: 42, color: 'var(--brand)' },
  { label: 'Search', value: 28, color: 'var(--brand-glow)' },
  { label: 'Social', value: 18, color: 'var(--brand-2)' },
  { label: 'Referral', value: 12, color: 'color-mix(in oklab, var(--foreground) 30%, transparent)' },
];

const geoRows = [
  { country: 'United States', flag: '🇺🇸', users: '6,241', revenue: '$52,190', pct: 92 },
  { country: 'United Kingdom', flag: '🇬🇧', users: '2,108', revenue: '$18,430', pct: 62 },
  { country: 'Germany', flag: '🇩🇪', users: '1,542', revenue: '$14,220', pct: 51 },
  { country: 'India', flag: '🇮🇳', users: '2,984', revenue: '$11,802', pct: 44 },
  { country: 'Australia', flag: '🇦🇺', users: '984', revenue: '$8,912', pct: 34 },
];

function StatusPill({ status }: { status: string }) {
  const map = {
    Paid: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
    Pending: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
    Refunded: 'bg-destructive/15 text-destructive border-destructive/30',
  } as const;
  const cls = map[status as keyof typeof map] || 'bg-muted text-muted-foreground border-border';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" /> {status}
    </span>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 42;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--muted)" strokeWidth="14" />
      {data.map((d, i) => {
        const len = (d.value / total) * c;
        const el = (
          <circle
            key={i}
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={d.color}
            strokeWidth="14"
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
          />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
}

export function OverviewTab() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Welcome back, <span className="text-brand-gradient">Ava</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Here's what's happening across NovaKit today.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto thin-scrollbar pt-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label} className="relative overflow-hidden admin-card p-5">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/10 blur-2xl" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-brand" />
              </div>
              <div className="mt-3 font-display text-2xl font-semibold">{s.value}</div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className={`inline-flex items-center gap-1 ${s.up ? 'text-emerald-500' : 'text-destructive'}`}>
                  {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {s.delta}
                </span>
                <span className="text-muted-foreground">{s.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue chart + Top templates */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="admin-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Revenue</h3>
                <p className="text-xs text-muted-foreground">Last 30 days · updated 2m ago</p>
              </div>
              <div className="flex gap-1 rounded-md border border-border p-0.5 text-xs">
                {['7d', '30d', '90d'].map((t, i) => (
                  <button
                    key={t}
                    className={`rounded-md px-3 py-1 ${i === 1 ? 'bg-accent text-foreground' : 'text-muted-foreground'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <svg viewBox="0 0 600 200" className="mt-6 h-56 w-full">
              <defs>
                <linearGradient id="rg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[40, 80, 120, 160].map((y) => (
                <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="var(--border)" strokeDasharray="3 4" />
              ))}
              <path
                d="M0 150 L50 140 L100 155 L150 110 L200 120 L250 80 L300 95 L350 60 L400 70 L450 40 L500 55 L550 25 L600 45 L600 200 L0 200 Z"
                fill="url(#rg)"
              />
              <path
                d="M0 150 L50 140 L100 155 L150 110 L200 120 L250 80 L300 95 L350 60 L400 70 L450 40 L500 55 L550 25 L600 45"
                fill="none"
                stroke="var(--brand)"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          <div className="admin-card p-6">
            <h3 className="font-display text-lg font-semibold">Top templates</h3>
            <p className="text-xs text-muted-foreground">By revenue · this month</p>
            <div className="mt-4 space-y-4">
              {[
                { n: 'Prism SaaS', v: '$18.2k', p: 92 },
                { n: 'Aurora Admin', v: '$12.4k', p: 74 },
                { n: 'Cobalt Commerce', v: '$9.1k', p: 58 },
                { n: 'Nimbus AI Chat', v: '$6.8k', p: 44 },
                { n: 'Quanta Blocks', v: '$4.2k', p: 30 },
              ].map((t) => (
                <div key={t.n}>
                  <div className="flex justify-between text-sm">
                    <span>{t.n}</span>
                    <span className="text-muted-foreground">{t.v}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${t.p}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Traffic + Geo + Activity */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="admin-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Traffic sources</h3>
                <p className="text-xs text-muted-foreground">Where visitors come from</p>
              </div>
              <Globe className="h-4 w-4 text-brand" />
            </div>
            <div className="mt-6 flex items-center gap-6">
              <DonutChart data={trafficSources} />
              <div className="flex-1 space-y-2">
                {trafficSources.map((s) => (
                  <div key={s.label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                      {s.label}
                    </span>
                    <span className="text-muted-foreground">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="admin-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Top countries</h3>
                <p className="text-xs text-muted-foreground">Users & revenue</p>
              </div>
              <Eye className="h-4 w-4 text-brand" />
            </div>
            <div className="mt-4 space-y-3">
              {geoRows.map((g) => (
                <div key={g.country}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span>{g.flag}</span>
                      {g.country}
                    </span>
                    <span className="text-muted-foreground">{g.revenue}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${g.pct}%` }} />
                    </div>
                    <span className="w-14 text-right text-xs text-muted-foreground">{g.users}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Live activity</h3>
                <p className="text-xs text-muted-foreground">Real-time events</p>
              </div>
              <Activity className="h-4 w-4 text-brand" />
            </div>
            <ul className="mt-4 space-y-3">
              {activity.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
                    <a.icon className="h-4 w-4 text-brand" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{a.text}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.meta}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{a.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Orders table */}
        <div className="overflow-hidden admin-card-static">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h3 className="font-display text-lg font-semibold">Recent orders</h3>
              <p className="text-xs text-muted-foreground">Latest 5 orders</p>
            </div>
            <button className="text-xs text-muted-foreground hover:text-foreground">View all →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="p-4 font-medium">Order</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-accent/40">
                    <td className="p-4 font-mono text-xs">{o.id}</td>
                    <td className="p-4">{o.customer}</td>
                    <td className="p-4 text-muted-foreground">{o.product}</td>
                    <td className="p-4 font-medium">{o.amount}</td>
                    <td className="p-4">
                      <StatusPill status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
