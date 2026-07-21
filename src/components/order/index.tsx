'use client';

import { useMemo, useState } from 'react';
import {
  Search,
  Filter,
  Download,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Ban,
  Undo2,
  Mail,
  Copy,
  Receipt,
  User as UserIcon,
  Package,
  CreditCard,
} from 'lucide-react';
import { ORDERS, ORDER_STATUSES, findOrder, formatOrderDate, productFor, type Order, type OrderStatus } from '@/src/lib/orders';
import { useCurrency } from '@/src/lib/currency';
import { DataTable, ColumnDef } from '@/src/components/shared/DataTable';

function statusClasses(s: OrderStatus) {
  switch (s) {
    case 'Paid':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'Pending':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'Refunded':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'Cancelled':
      return 'bg-muted text-muted-foreground border-border';
  }
}

function StatusIcon({ s }: { s: OrderStatus }) {
  const cls = 'h-3.5 w-3.5';
  if (s === 'Paid') return <CheckCircle2 className={cls} />;
  if (s === 'Pending') return <Clock className={cls} />;
  if (s === 'Refunded') return <Undo2 className={cls} />;
  return <Ban className={cls} />;
}

function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs ${statusClasses(status)}`}>
      <StatusIcon s={status} /> {status}
    </span>
  );
}

export function OrdersTab() {
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [selected, setSelected] = useState<string | null>(null);
  const { format } = useCurrency();

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ORDERS.filter((o) => {
      if (statusFilter !== 'All' && o.status !== statusFilter) return false;
      if (!query) return true;
      return (
        o.id.toLowerCase().includes(query) ||
        o.customer.name.toLowerCase().includes(query) ||
        o.customer.email.toLowerCase().includes(query) ||
        o.items.some((it) => productFor(it.productSlug)?.name.toLowerCase().includes(query))
      );
    });
  }, [q, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: ORDERS.length };
    for (const s of ORDER_STATUSES) c[s] = ORDERS.filter((o) => o.status === s).length;
    return c;
  }, []);

  const totalRevenue = ORDERS.filter((o) => o.status === 'Paid').reduce((s, o) => s + o.total, 0);
  const pendingRevenue = ORDERS.filter((o) => o.status === 'Pending').reduce((s, o) => s + o.total, 0);
  const refundedRevenue = ORDERS.filter((o) => o.status === 'Refunded').reduce((s, o) => s + o.total, 0);

  if (selected) {
    const order = findOrder(selected);
    if (!order) {
      setSelected(null);
      return null;
    }
    return <OrderDetailPanel order={order} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <ShoppingBag className="h-3.5 w-3.5" /> Orders
            </div>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">All orders</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review, filter and manage every order placed across your store.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total orders', value: String(ORDERS.length), icon: ShoppingBag },
            { label: 'Paid revenue', value: format(totalRevenue), icon: CheckCircle2 },
            { label: 'Pending', value: format(pendingRevenue), icon: Clock },
            { label: 'Refunded', value: format(refundedRevenue), icon: Undo2 },
          ].map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="admin-card-static rounded-lg border border-border/70 bg-card p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{k.label}</span>
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="mt-1 font-display text-lg font-semibold">{k.value}</div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search order, customer or product..."
              className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-brand"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="mr-1 hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
              <Filter className="h-3.5 w-3.5" /> Filter:
            </div>
            {(['All', ...ORDER_STATUSES] as const).map((s) => {
              const active = statusFilter === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                    active
                      ? 'border-brand/60 bg-brand/10 text-brand'
                      : 'border-border bg-background text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {s} <span className="opacity-60">({counts[s]})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-5 min-h-0 flex-1 overflow-hidden rounded-lg border border-border/70 bg-card">
        <div className="h-full overflow-auto custom-scrollbar">
        <DataTable
          data={filtered}
          columns={[
            {
              header: 'Order',
              cell: (row) => (
                <button
                  type="button"
                  onClick={() => setSelected(row.id)}
                  className="font-mono text-xs text-indigo-600 dark:text-indigo-400 hover:underline text-left font-semibold"
                >
                  {row.id}
                </button>
              ),
            },
            {
              header: 'Customer',
              cell: (row) => (
                <div onClick={() => setSelected(row.id)} className="cursor-pointer">
                  <div className="font-medium text-foreground">{row.customer.name}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">{row.customer.email}</div>
                </div>
              ),
            },
            {
              header: 'Items',
              cell: (row) => {
                const first = productFor(row.items[0].productSlug);
                const extra = row.items.length - 1;
                return (
                  <div onClick={() => setSelected(row.id)} className="cursor-pointer text-neutral-500 dark:text-neutral-400">
                    <span className="text-foreground font-medium">{first?.name ?? row.items[0].productSlug}</span>
                    {extra > 0 && <span className="ml-1 text-xs text-neutral-400 font-normal">+{extra} more</span>}
                    <div className="text-xs">{row.items[0].license} license</div>
                  </div>
                );
              },
            },
            {
              header: 'Placed',
              cell: (row) => (
                <span onClick={() => setSelected(row.id)} className="cursor-pointer text-xs text-neutral-500">
                  {formatOrderDate(row.placedAt)}
                </span>
              ),
            },
            {
              header: 'Payment',
              cell: (row) => (
                <span onClick={() => setSelected(row.id)} className="cursor-pointer text-xs text-neutral-500">
                  {row.paymentMethod}
                </span>
              ),
            },
            {
              header: 'Total',
              cell: (row) => (
                <span onClick={() => setSelected(row.id)} className="cursor-pointer font-medium text-right block w-full">
                  {format(row.total)}
                </span>
              ),
            },
            {
              header: 'Status',
              cell: (row) => (
                <div onClick={() => setSelected(row.id)} className="cursor-pointer">
                  <StatusPill status={row.status} />
                </div>
              ),
            },
          ]}
          pagination={false}
          getRowId={(row) => row.id}
        />
        </div>
      </div>
    </div>
  );
}

function OrderDetailPanel({ order, onBack }: { order: Order; onBack: () => void }) {
  const { format } = useCurrency();
  const [status, setStatus] = useState<OrderStatus>(order.status);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to orders
        </button>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <ShoppingBag className="h-3.5 w-3.5" /> Order
            </div>
            <h1 className="mt-1 flex items-center gap-3 font-display text-2xl font-semibold tracking-tight">
              <span className="font-mono">{order.id}</span>
              <StatusPill status={status} />
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Placed {formatOrderDate(order.placedAt)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent">
              <Mail className="h-3.5 w-3.5" /> Email customer
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent">
              <Receipt className="h-3.5 w-3.5" /> Invoice
            </button>
            {status !== 'Refunded' && status === 'Paid' && (
              <button
                onClick={() => setStatus('Refunded')}
                className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
              >
                <Undo2 className="h-3.5 w-3.5" /> Refund
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-4 lg:col-span-2">
            {/* Items */}
            <div className="admin-card-static rounded-lg border border-border/70 bg-card">
              <div className="flex items-center justify-between border-b border-border p-4">
                <h3 className="font-display text-base font-semibold">Items</h3>
                <span className="text-xs text-muted-foreground">{order.items.length} in this order</span>
              </div>
              <ul className="divide-y divide-border/70">
                {order.items.map((it, i) => {
                  const p = productFor(it.productSlug);
                  const Icon = p?.icon ?? Package;
                  return (
                    <li key={i} className="flex items-center gap-4 p-4">
                      <span className="grid h-10 w-10 place-items-center rounded-lg border border-border/70 bg-muted text-muted-foreground">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{p?.name ?? it.productSlug}</div>
                        <div className="text-xs text-muted-foreground">
                          {it.license} license · Qty {it.quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{format(it.unitPrice * it.quantity)}</div>
                        {it.quantity > 1 && (
                          <div className="text-xs text-muted-foreground">{format(it.unitPrice)} each</div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-border p-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{format(order.subtotal)}</span>
                </div>
                <div className="mt-1 flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>{format(order.tax)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span>{format(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="admin-card-static rounded-lg border border-border/70 bg-card p-4">
              <h3 className="font-display text-base font-semibold">Timeline</h3>
              <ol className="mt-3 space-y-3">
                {order.timeline.map((e, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
                      {i < order.timeline.length - 1 && <span className="flex-1 w-px bg-border" />}
                    </div>
                    <div className="min-w-0 flex-1 pb-3">
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="text-sm font-medium">{e.label}</div>
                        <div className="text-xs text-muted-foreground">{formatOrderDate(e.at)}</div>
                      </div>
                      {e.detail && <div className="text-xs text-muted-foreground">{e.detail}</div>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {order.notes && (
              <div className="admin-card-static rounded-lg border border-border/70 bg-card p-4">
                <h3 className="font-display text-base font-semibold">Notes</h3>
                <p className="mt-2 text-sm text-muted-foreground">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div className="admin-card-static rounded-lg border border-border/70 bg-card p-4">
              <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">Customer</h3>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-gradient text-sm font-semibold text-white">
                  {order.customer.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </span>
                <div className="min-w-0">
                  <div className="truncate font-medium">{order.customer.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{order.customer.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><UserIcon className="h-3.5 w-3.5" /> Customer ID: {order.customer.id}</div>
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {order.customer.country}</div>
              </div>
            </div>

            <div className="admin-card-static rounded-lg border border-border/70 bg-card p-4">
              <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">Payment</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="inline-flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> {order.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Invoice</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                    {order.invoiceId}
                    <button title="Copy" className="text-muted-foreground hover:text-foreground">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <div className="admin-card-static rounded-lg border border-border/70 bg-card p-4">
              <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">Billing address</h3>
              <pre className="mt-3 whitespace-pre-wrap font-sans text-xs text-muted-foreground">{order.billingAddress}</pre>
            </div>

            <div className="admin-card-static rounded-lg border border-border/70 bg-card p-4">
              <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">Change status</h3>
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                {ORDER_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${
                      status === s
                        ? 'border-brand/60 bg-brand/10 text-brand'
                        : 'border-border bg-background text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
