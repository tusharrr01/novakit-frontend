'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Download,
  ArrowRight,
  Receipt,
  CheckCircle2,
  Clock,
  Undo2,
  Ban,
  Filter,
} from 'lucide-react';
import { SiteHeader } from '@/src/components/layout/SiteHeader';
import { SiteFooter } from '@/src/components/layout/SiteFooter';
import { useAuth } from '@/src/lib/auth';
import { useCurrency } from '@/src/lib/currency';
import { ORDERS, ORDER_STATUSES, formatOrderDate, productFor, type OrderStatus } from '@/src/lib/orders';

function statusClasses(s: OrderStatus) {
  switch (s) {
    case 'Paid': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'Refunded': return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'Cancelled': return 'bg-muted text-muted-foreground border-border';
  }
}

function StatusIcon({ s }: { s: OrderStatus }) {
  const cls = 'h-3.5 w-3.5';
  if (s === 'Paid') return <CheckCircle2 className={cls} />;
  if (s === 'Pending') return <Clock className={cls} />;
  if (s === 'Refunded') return <Undo2 className={cls} />;
  return <Ban className={cls} />;
}

export default function OrdersPage() {
  const { isAuthenticated, hydrated } = useAuth();
  const router = useRouter();
  const { format } = useCurrency();
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.push('/auth/login');
  }, [hydrated, isAuthenticated, router]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ORDERS.filter((o) => {
      if (statusFilter !== 'All' && o.status !== statusFilter) return false;
      if (!query) return true;
      return (
        o.id.toLowerCase().includes(query) ||
        o.items.some((it) => productFor(it.productSlug)?.name.toLowerCase().includes(query))
      );
    });
  }, [q, statusFilter]);

  const paidCount = ORDERS.filter((o) => o.status === 'Paid').length;
  const totalSpent = ORDERS.filter((o) => o.status === 'Paid').reduce((s, o) => s + o.total, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <ShoppingBag className="h-3.5 w-3.5" /> Order history
            </div>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Your orders</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Every purchase you've made — click an order for a full receipt and license details.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-3">
            <div className="rounded-lg border border-border/70 bg-card p-3 text-center sm:text-left">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Paid orders</div>
              <div className="font-display text-lg font-semibold">{paidCount}</div>
            </div>
            <div className="rounded-lg border border-border/70 bg-card p-3 text-center sm:text-left">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Lifetime spend</div>
              <div className="font-display text-lg font-semibold">{format(totalSpent)}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by order # or product..."
              className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-brand"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="mr-1 hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
              <Filter className="h-3.5 w-3.5" /> Status:
            </div>
            {(['All', ...ORDER_STATUSES] as const).map((s) => {
              const active = statusFilter === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                    active
                      ? 'border-brand/60 bg-brand/10 text-brand'
                      : 'border-border bg-background text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders list */}
        <div className="mt-6 space-y-3">
          {filtered.length === 0 && (
            <div className="rounded-lg border border-dashed border-border/70 bg-card p-10 text-center">
              <ShoppingBag className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">No orders yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                When you buy a template, it'll show up here with your license and invoice.
              </p>
              <Link
                href="/templates"
                className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-brand-gradient px-4 py-2 text-xs font-semibold text-white hover:opacity-95"
              >
                Browse templates <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {filtered.map((o) => {
            const first = productFor(o.items[0].productSlug);
            const extra = o.items.length - 1;
            const FirstIcon = first?.icon;
            return (
              <Link
                key={o.id}
                href={`/orders/${o.number}`}
                className="group block rounded-lg border border-border/70 bg-card p-4 transition hover:border-brand/40 hover:bg-accent/40"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border/70 bg-muted text-muted-foreground">
                      {FirstIcon ? <FirstIcon className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{o.id}</span>
                        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] ${statusClasses(o.status)}`}>
                          <StatusIcon s={o.status} /> {o.status}
                        </span>
                      </div>
                      <div className="mt-0.5 font-medium">
                        {first?.name ?? o.items[0].productSlug}
                        {extra > 0 && <span className="ml-1 text-xs text-muted-foreground">+{extra} more</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {o.items[0].license} · Placed {formatOrderDate(o.placedAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Total</div>
                      <div className="font-display text-base font-semibold">{format(o.total)}</div>
                    </div>
                    <ArrowRight className="hidden h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-brand sm:block" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between rounded-lg border border-border/70 bg-card p-4 text-sm">
          <div className="flex items-center gap-3">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Need a VAT invoice or receipt? Open any order.</span>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent">
            <Download className="h-3.5 w-3.5" /> Export all
          </button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

