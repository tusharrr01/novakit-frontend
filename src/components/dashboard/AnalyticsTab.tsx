'use client';

import React, { useState } from 'react';
import {
  Eye,
  BarChart3,
  Activity,
  TrendingUp,
  Globe,
  Users as UsersIcon,
  ArrowUpRight,
} from 'lucide-react';

const analyticsKpis = [
  { label: 'Total visitors', value: '142,890', delta: '+18.2%', up: true, icon: Eye, sub: 'vs last 30d' },
  { label: 'Page views', value: '512,430', delta: '+9.4%', up: true, icon: BarChart3, sub: '3.6 pages / session' },
  { label: 'Avg. session', value: '4m 12s', delta: '+0.8%', up: true, icon: Activity, sub: 'engagement up' },
  { label: 'Bounce rate', value: '38.4%', delta: '-2.1%', up: false, icon: TrendingUp, sub: 'improving' },
  { label: 'Conversion', value: '3.82%', delta: '+0.4%', up: true, icon: ArrowUpRight, sub: 'checkout flow' },
  { label: 'New signups', value: '1,284', delta: '+12.6%', up: true, icon: UsersIcon, sub: '312 today' },
];

const visitorSeries = [
  120, 138, 152, 145, 168, 190, 172, 205, 220, 198, 232, 248, 240, 268, 282,
  270, 295, 312, 302, 328, 342, 335, 358, 372, 360, 388, 402, 395, 420, 438,
];

const trafficChannels = [
  { label: 'Organic search', value: 38, color: 'var(--brand)' },
  { label: 'Direct', value: 24, color: 'var(--brand-glow)' },
  { label: 'Social', value: 18, color: 'var(--brand-2)' },
  { label: 'Email', value: 12, color: 'color-mix(in oklab, var(--brand) 40%, var(--muted))' },
  { label: 'Referral', value: 8, color: 'color-mix(in oklab, var(--foreground) 30%, transparent)' },
];

const devicesData = [
  { label: 'Desktop', value: 58, color: 'var(--brand)' },
  { label: 'Mobile', value: 34, color: 'var(--brand-glow)' },
  { label: 'Tablet', value: 8, color: 'var(--brand-2)' },
];

const topPages = [
  { path: '/templates/aurora-admin', views: '24,182', avg: '3m 48s', bounce: '32%' },
  { path: '/pricing', views: '18,940', avg: '2m 12s', bounce: '41%' },
  { path: '/templates/prism-saas', views: '16,224', avg: '4m 05s', bounce: '28%' },
  { path: '/', views: '14,802', avg: '1m 52s', bounce: '48%' },
  { path: '/blog/design-systems', views: '12,318', avg: '5m 22s', bounce: '22%' },
  { path: '/docs/getting-started', views: '9,410', avg: '6m 40s', bounce: '18%' },
];

const referrers = [
  { name: 'google.com', visits: '48,210', pct: 92 },
  { name: 'producthunt.com', visits: '18,412', pct: 62 },
  { name: 'twitter.com', visits: '14,908', pct: 52 },
  { name: 'github.com', visits: '9,140', pct: 38 },
  { name: 'dribbble.com', visits: '6,220', pct: 26 },
];

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

export function AnalyticsTab() {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');
  const maxV = Math.max(...visitorSeries);
  const minV = Math.min(...visitorSeries);
  const step = 600 / (visitorSeries.length - 1);
  const points = visitorSeries.map((v, i) => {
    const x = i * step;
    const y = 180 - ((v - minV) / (maxV - minV)) * 150 - 10;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const linePath = 'M' + points.join(' L');
  const areaPath = `${linePath} L600,200 L0,200 Z`;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold">Analytics</h2>
            <p className="text-sm text-muted-foreground">
              Traffic, engagement and conversion insights across your storefront.
            </p>
          </div>
          <div className="flex gap-1 rounded-md border border-border p-0.5 text-xs">
            {(['7d', '30d', '90d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setRange(t)}
                className={`rounded-md px-3 py-1 transition ${
                  range === t ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pt-6">
        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {analyticsKpis.map((s) => (
            <div key={s.label} className="relative overflow-hidden admin-card p-5">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/10 blur-2xl" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-brand" />
              </div>
              <div className="mt-3 font-display text-2xl font-semibold">{s.value}</div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className={`inline-flex items-center gap-1 ${s.up ? 'text-emerald-500' : 'text-destructive'}`}>
                  {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3 rotate-180" />}
                  {s.delta}
                </span>
                <span className="text-muted-foreground">{s.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Visitors trend + Channels */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="admin-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Visitors trend</h3>
                <p className="text-xs text-muted-foreground">Unique visitors · {range}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-brand" /> Visitors
                </span>
              </div>
            </div>
            <svg viewBox="0 0 600 200" className="mt-6 h-56 w-full">
              <defs>
                <linearGradient id="ag" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[40, 80, 120, 160].map((y) => (
                <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="var(--border)" strokeDasharray="3 4" />
              ))}
              <path d={areaPath} fill="url(#ag)" />
              <path d={linePath} fill="none" stroke="var(--brand)" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="admin-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Traffic channels</h3>
                <p className="text-xs text-muted-foreground">Share of visits</p>
              </div>
              <Globe className="h-4 w-4 text-brand" />
            </div>
            <div className="mt-6 flex items-center gap-6">
              <DonutChart data={trafficChannels} />
              <div className="flex-1 space-y-2">
                {trafficChannels.map((s) => (
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
        </div>

        {/* Devices + Top pages + Referrers */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="admin-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Devices</h3>
                <p className="text-xs text-muted-foreground">Sessions by device</p>
              </div>
              <Activity className="h-4 w-4 text-brand" />
            </div>
            <div className="mt-6 flex items-center gap-6">
              <DonutChart data={devicesData} />
              <div className="flex-1 space-y-2">
                {devicesData.map((d) => (
                  <div key={d.label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                      {d.label}
                    </span>
                    <span className="text-muted-foreground">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="admin-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Top pages</h3>
                <p className="text-xs text-muted-foreground">Most visited pages · {range}</p>
              </div>
              <Eye className="h-4 w-4 text-brand" />
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="py-2 pr-4 font-medium">Page</th>
                    <th className="py-2 pr-4 font-medium">Views</th>
                    <th className="py-2 pr-4 font-medium">Avg. time</th>
                    <th className="py-2 font-medium">Bounce</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((p) => (
                    <tr key={p.path} className="border-b border-border/50 last:border-0">
                      <td className="py-2.5 pr-4 font-mono text-xs">{p.path}</td>
                      <td className="py-2.5 pr-4">{p.views}</td>
                      <td className="py-2.5 pr-4 text-muted-foreground">{p.avg}</td>
                      <td className="py-2.5 text-muted-foreground">{p.bounce}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Referrers + Realtime */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="admin-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Top referrers</h3>
                <p className="text-xs text-muted-foreground">External sources sending traffic</p>
              </div>
              <TrendingUp className="h-4 w-4 text-brand" />
            </div>
            <div className="mt-4 space-y-3">
              {referrers.map((r) => (
                <div key={r.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-xs">{r.name}</span>
                    <span className="text-muted-foreground">{r.visits}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Realtime</h3>
                <p className="text-xs text-muted-foreground">Active in last 5 min</p>
              </div>
              <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
            </div>
            <div className="mt-4 font-display text-4xl font-semibold">318</div>
            <p className="text-xs text-muted-foreground">visitors on site right now</p>
            <div className="mt-5 space-y-2">
              {[
                { p: '/templates/aurora-admin', n: 82 },
                { p: '/pricing', n: 61 },
                { p: '/templates/prism-saas', n: 47 },
                { p: '/', n: 39 },
                { p: '/blog/design-systems', n: 24 },
              ].map((row) => (
                <div key={row.p} className="flex items-center justify-between text-sm">
                  <span className="truncate font-mono text-xs">{row.p}</span>
                  <span className="text-muted-foreground">{row.n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
