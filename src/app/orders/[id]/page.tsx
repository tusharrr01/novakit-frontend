'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Undo2,
  Ban,
  Download,
  Receipt,
  Mail,
  CreditCard,
  Package,
  ShoppingBag,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { SiteHeader } from '@/src/layout/site-header';
import { SiteFooter } from '@/src/layout/site-footer';
import { useAuth } from '@/src/lib/auth';
import { useCurrency } from '@/src/lib/currency';
import { findOrder, formatOrderDate, productFor, type OrderStatus } from '@/src/lib/orders';

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

function OrderNotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 flex-1 flex flex-col justify-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-4 font-display text-3xl font-semibold">Order not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't find that order. It may have been cancelled or the link is incorrect.
        </p>
        <Link
          href="/orders"
          className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-brand-gradient px-4 py-2 text-sm font-semibold text-white hover:opacity-95 self-center"
        >
          <ArrowLeft className="h-4 w-4" /> Back to your orders
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const order = findOrder(id);
  const { isAuthenticated, hydrated } = useAuth();
  const router = useRouter();
  const { format } = useCurrency();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.push('/login');
  }, [hydrated, isAuthenticated, router]);

  if (!order) {
    return <OrderNotFound />;
  }

  const copyInvoice = async () => {
    try {
      await navigator.clipboard.writeText(order.invoiceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to orders
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <ShoppingBag className="h-3.5 w-3.5" /> Order
            </div>
            <h1 className="mt-1 flex items-center gap-3 font-display text-3xl font-semibold tracking-tight">
              <span className="font-mono">{order.id}</span>
              <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs ${statusClasses(order.status)}`}>
                <StatusIcon s={order.status} /> {order.status}
              </span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Placed {formatOrderDate(order.placedAt)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent">
              <Download className="h-3.5 w-3.5" /> Download invoice
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent">
              <Mail className="h-3.5 w-3.5" /> Email receipt
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-lg border border-border/70 bg-card">
              <div className="flex items-center justify-between border-b border-border p-4">
                <h2 className="font-display text-base font-semibold">Items</h2>
                <span className="text-xs text-muted-foreground">{order.items.length} in this order</span>
              </div>
              <ul className="divide-y divide-border/70">
                {order.items.map((it, i) => {
                  const p = productFor(it.productSlug);
                  const Icon = p?.icon ?? Package;
                  return (
                    <li key={i} className="flex items-center gap-4 p-4">
                      <span className="grid h-11 w-11 place-items-center rounded-lg border border-border/70 bg-muted text-muted-foreground">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{p?.name ?? it.productSlug}</div>
                        <div className="text-xs text-muted-foreground">
                          {it.license} license · Qty {it.quantity}
                        </div>
                        {p && (
                          <Link
                            href={`/templates/${p.slug}`}
                            className="mt-1 inline-flex items-center gap-1 text-xs text-brand hover:underline"
                          >
                            View product <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{format(it.unitPrice * it.quantity)}</div>
                        {it.quantity > 1 && <div className="text-xs text-muted-foreground">{format(it.unitPrice)} each</div>}
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
            </section>

            <section className="rounded-lg border border-border/70 bg-card p-5">
              <h2 className="font-display text-base font-semibold">Timeline</h2>
              <ol className="mt-4 space-y-4">
                {order.timeline.map((e, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand" />
                      {i < order.timeline.length - 1 && <span className="flex-1 w-px bg-border" />}
                    </div>
                    <div className="min-w-0 flex-1 pb-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div className="text-sm font-medium">{e.label}</div>
                        <div className="text-xs text-muted-foreground">{formatOrderDate(e.at)}</div>
                      </div>
                      {e.detail && <div className="text-xs text-muted-foreground">{e.detail}</div>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {order.notes && (
              <section className="rounded-lg border border-border/70 bg-card p-5">
                <h2 className="font-display text-base font-semibold">Notes</h2>
                <p className="mt-2 text-sm text-muted-foreground">{order.notes}</p>
              </section>
            )}
          </div>

          {/* Right */}
          <div className="space-y-4">
            <section className="rounded-lg border border-border/70 bg-card p-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Payment</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="inline-flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> {order.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Invoice</span>
                  <button onClick={copyInvoice} className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground hover:text-brand">
                    {order.invoiceId}
                    <Copy className="h-3.5 w-3.5" />
                    {copied && <span className="text-brand">Copied</span>}
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-border/70 bg-card p-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Billed to</h3>
              <div className="mt-3 text-sm">
                <div className="font-medium">{order.customer.name}</div>
                <div className="text-xs text-muted-foreground">{order.customer.email}</div>
                <pre className="mt-2 whitespace-pre-wrap font-sans text-xs text-muted-foreground">{order.billingAddress}</pre>
              </div>
            </section>

            <section className="rounded-lg border border-border/70 bg-card p-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Need help?</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Questions about this order or your license?
              </p>
              <a
                href={`mailto:support@novakit.dev?subject=${encodeURIComponent(`Order ${order.id}`)}`}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent"
              >
                <Receipt className="h-3.5 w-3.5" /> Contact support
              </a>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
