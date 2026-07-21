'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Calendar,
  Camera,
  CheckCircle2,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Fingerprint,
  Github,
  Globe,
  Key,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Package,
  Receipt,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Trash2,
  User as UserIcon,
  Wallet,
} from 'lucide-react';
import { SiteHeader } from '@/src/components/layout/SiteHeader';
import { SiteFooter } from '@/src/components/layout/SiteFooter';
import { authStore, getInitials, useAuth } from '@/src/lib/auth';
import { getPurchasesWithProduct, daysUntil, formatDate } from '@/src/lib/purchases';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useToggleTwoFactorMutation,
  useDeleteAccountMutation,
} from '@/src/redux/api/profileApi';
import { useGetMyOrdersQuery } from '@/src/redux/api/orderApi';

type Tab =
  | 'overview'
  | 'purchases'
  | 'active'
  | 'downloads'
  | 'billing'
  | 'settings'
  | 'security'
  | 'notifications';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
  { id: 'active', label: 'Active templates', icon: Package },
  { id: 'downloads', label: 'Downloads', icon: Download },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'settings', label: 'Account', icon: SettingsIcon },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function ProfilePage() {
  const { user, isAuthenticated, hydrated } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [hydrated, isAuthenticated, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <p className="text-sm text-muted-foreground">Redirecting to sign in…</p>
        </div>
      </div>
    );
  }

  const purchases = getPurchasesWithProduct();
  const totalSpent = purchases.reduce((sum, p) => sum + p.price, 0);
  const activeCount = purchases.filter((p) => p.status !== 'Expired').length;
  const totalDownloads = purchases.reduce((sum, p) => sum + p.downloads, 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <div>
        <SiteHeader />

        {/* ambient background light */}
        <div className="pointer-events-none absolute inset-x-0 top-16 -z-0 h-72 bg-gradient-to-b from-brand/10 via-brand/5 to-transparent" />

        <main className="relative mx-auto max-w-7xl px-3 py-8 sm:px-4 lg:px-6">
          {/* Header card */}
          <section className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-6 backdrop-blur">
            <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-brand-glow/20 blur-3xl" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-gradient text-2xl font-semibold text-white shadow-lg shadow-brand/30">
                    {getInitials(user.name)}
                  </div>
                  <button className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground">
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-2xl font-semibold tracking-tight">{user.name}</h1>
                    <BadgeCheck className="h-5 w-5 text-brand" />
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{user.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 font-medium uppercase tracking-wider text-brand">
                      <Sparkles className="h-3 w-3" /> {user.plan} plan
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5 text-muted-foreground">
                      <Calendar className="h-3 w-3" /> Joined {formatDate(user.joinedAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand/40"
                >
                  Browse templates <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={() => {
                    authStore.signOut();
                    router.push('/');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard icon={ShoppingBag} label="Total purchases" value={String(purchases.length)} />
              <StatCard icon={Package} label="Active licenses" value={String(activeCount)} />
              <StatCard icon={Download} label="Downloads" value={String(totalDownloads)} />
              <StatCard icon={Wallet} label="Lifetime spend" value={`$${totalSpent}`} />
            </div>
          </section>

          {/* Layout */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-border bg-card/60 p-1.5 backdrop-blur lg:flex-col lg:overflow-visible">
                {TABS.map((t) => {
                  const active = tab === t.id;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition cursor-pointer ${
                        active
                          ? 'bg-brand-gradient text-white shadow-md shadow-brand/20'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="whitespace-nowrap">{t.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Content */}
            <section className="min-w-0">
              {tab === 'overview' && <OverviewTab purchases={purchases} />}
              {tab === 'purchases' && <PurchasesTab purchases={purchases} />}
              {tab === 'active' && <ActiveTab purchases={purchases.filter((p) => p.status !== 'Expired')} />}
              {tab === 'downloads' && <DownloadsTab purchases={purchases} />}
              {tab === 'billing' && <BillingTab purchases={purchases} totalSpent={totalSpent} />}
              {tab === 'settings' && <SettingsTab />}
              {tab === 'security' && <SecurityTab />}
              {tab === 'notifications' && <NotificationsTab />}
            </section>
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}

/* ---------------- Reusable pieces ---------------- */

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-brand" />
      </div>
      <div className="mt-1 font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

/* ---------------- Overview ---------------- */

function OverviewTab({ purchases }: { purchases: ReturnType<typeof getPurchasesWithProduct> }) {
  const recent = purchases.slice(0, 3);
  return (
    <div className="space-y-6">
      <Panel
        title="Welcome back 👋"
        subtitle="Here's what's happening across your NovaKit account this week."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <QuickCard icon={Download} label="Latest download" value="Aurora Admin v3.2.0" hint="2 days ago" />
          <QuickCard icon={Star} label="Reviews written" value="4" hint="+1 this month" />
          <QuickCard icon={ShieldCheck} label="Security score" value="92%" hint="Enable 2FA to improve" />
        </div>
      </Panel>

      <Panel title="Recent activity" subtitle="Purchases, downloads and license updates">
        <ul className="divide-y divide-border/60">
          {recent.map((p) => {
            const Icon = p.product!.icon;
            return (
              <li key={p.id} className="flex items-center gap-3 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.product!.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.license} license · Purchased {formatDate(p.purchasedAt)}
                  </div>
                </div>
                <StatusPill status={p.status} />
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel title="Recommended for you" subtitle="Based on your recent activity">
        <div className="grid gap-3 sm:grid-cols-2">
          {purchases.slice(0, 2).map((p) => {
            const Icon = p.product!.icon;
            return (
              <Link
                key={p.id}
                href={`/products/${p.product!.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3 transition hover:border-brand/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.product!.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{p.product!.tagline}</div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground transition group-hover:text-brand" />
              </Link>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function QuickCard({ icon: Icon, label, value, hint }: { icon: React.ElementType; label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/60 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-brand" /> {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function StatusPill({ status }: { status: 'Active' | 'Expiring' | 'Expired' }) {
  const style = {
    Active: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
    Expiring: 'border-amber-500/30 bg-amber-500/10 text-amber-500',
    Expired: 'border-red-500/30 bg-red-500/10 text-red-500',
  }[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" /> {status}
    </span>
  );
}

/* ---------------- Purchases ---------------- */

function PurchasesTab({ purchases }: { purchases: ReturnType<typeof getPurchasesWithProduct> }) {
  return (
    <Panel
      title="Purchase history"
      subtitle="All templates and licenses you've purchased on NovaKit."
      actions={
        <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:border-brand/40 cursor-pointer">
          <Receipt className="h-3.5 w-3.5" /> Export CSV
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr className="border-b border-border/60">
              <th className="py-3 pr-4 font-medium">Template</th>
              <th className="py-3 pr-4 font-medium">License</th>
              <th className="py-3 pr-4 font-medium">Price</th>
              <th className="py-3 pr-4 font-medium">Purchased</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {purchases.map((p) => {
              const Icon = p.product!.icon;
              return (
                <tr key={p.id} className="align-middle">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{p.product!.name}</div>
                        <div className="text-xs text-muted-foreground">v{p.product!.version}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">{p.license}</td>
                  <td className="py-3 pr-4">${p.price}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{formatDate(p.purchasedAt)}</td>
                  <td className="py-3 pr-4"><StatusPill status={p.status} /></td>
                  <td className="py-3 pr-4">
                    <div className="flex justify-end gap-2">
                      <button className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs hover:border-brand/40 cursor-pointer">
                        <Download className="h-3.5 w-3.5" /> Get files
                      </button>
                      <Link
                        href={`/products/${p.product!.slug}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs hover:border-brand/40"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ---------------- Active templates ---------------- */

function ActiveTab({ purchases }: { purchases: ReturnType<typeof getPurchasesWithProduct> }) {
  return (
    <div className="space-y-6">
      <Panel title="Active templates" subtitle="Templates you can download, update and use in your projects.">
        <div className="grid gap-4 sm:grid-cols-2">
          {purchases.map((p) => {
            const Icon = p.product!.icon;
            const days = daysUntil(p.expiresAt);
            const total = Math.max(1, Math.round((new Date(p.expiresAt).getTime() - new Date(p.purchasedAt).getTime()) / (1000 * 60 * 60 * 24)));
            const pct = Math.max(6, Math.min(100, Math.round(((total - days) / total) * 100)));
            return (
              <div key={p.id} className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md shadow-brand/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{p.product!.name}</div>
                      <div className="text-xs text-muted-foreground">{p.license} · v{p.product!.version}</div>
                    </div>
                  </div>
                  <StatusPill status={p.status} />
                </div>

                <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{p.product!.tagline}</p>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Updates window</span>
                    <span className="font-medium">{days > 0 ? `${days} days left` : 'Ended'}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-gradient px-3 py-2 text-xs font-medium text-white cursor-pointer">
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs hover:border-brand/40 cursor-pointer">
                    <Github className="h-3.5 w-3.5" /> Repo access
                  </button>
                  <Link
                    href={`/products/${p.product!.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs hover:border-brand/40"
                  >
                    Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

/* ---------------- Downloads ---------------- */

function DownloadsTab({ purchases }: { purchases: ReturnType<typeof getPurchasesWithProduct> }) {
  return (
    <Panel title="Downloads" subtitle="Source, Figma files and changelogs for your templates.">
      <ul className="divide-y divide-border/60">
        {purchases.flatMap((p) => [
          { key: p.id + '-src', template: p.product!.name, icon: p.product!.icon, name: `${p.product!.slug}-source.zip`, size: '12.4 MB', date: p.purchasedAt },
          { key: p.id + '-fig', template: p.product!.name, icon: p.product!.icon, name: `${p.product!.slug}-design.fig`, size: '48.9 MB', date: p.purchasedAt },
        ]).map((f) => {
          const Icon = f.icon;
          return (
            <li key={f.key} className="flex items-center gap-3 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{f.name}</div>
                <div className="text-xs text-muted-foreground">{f.template} · {f.size} · {formatDate(f.date)}</div>
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs hover:border-brand/40 cursor-pointer">
                <Download className="h-3.5 w-3.5" /> Download
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

/* ---------------- Billing ---------------- */

function BillingTab({ purchases, totalSpent }: { purchases: ReturnType<typeof getPurchasesWithProduct>; totalSpent: number }) {
  return (
    <div className="space-y-6">
      <Panel title="Payment methods" subtitle="Cards and wallets used for purchases." actions={
        <button className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-3 py-1.5 text-xs font-medium text-white cursor-pointer">
          <CreditCard className="h-3.5 w-3.5" /> Add method
        </button>
      }>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-brand/20 via-brand-glow/10 to-transparent p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Visa · default</span>
              <BadgeCheck className="h-4 w-4 text-brand" />
            </div>
            <div className="mt-4 font-display text-lg tracking-widest">•••• •••• •••• 4242</div>
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Exp 08 / 28</span>
              <span>{purchases[0] && purchases[0].product?.name}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground">
              <Wallet className="h-4 w-4 text-brand" /> Add PayPal or Apple Pay
            </div>
            <p className="mt-1 text-xs">Speed up checkout with a saved wallet.</p>
          </div>
        </div>
      </Panel>

      <Panel title="Invoices" subtitle={`Lifetime spend $${totalSpent}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px] text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border/60">
                <th className="py-3 pr-4 font-medium">Invoice</th>
                <th className="py-3 pr-4 font-medium">Item</th>
                <th className="py-3 pr-4 font-medium">Amount</th>
                <th className="py-3 pr-4 font-medium">Date</th>
                <th className="py-3 pr-4 font-medium text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {purchases.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 pr-4 font-mono text-xs">{p.invoiceId}</td>
                  <td className="py-3 pr-4">{p.product!.name} · {p.license}</td>
                  <td className="py-3 pr-4">${p.price}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{formatDate(p.purchasedAt)}</td>
                  <td className="py-3 pr-4 text-right">
                    <button className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs hover:border-brand/40 cursor-pointer">
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Billing address" subtitle="Used on your receipts and invoices.">
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow icon={UserIcon} label="Name" value="Ava Bennett" />
          <InfoRow icon={Mail} label="Email" value="ava@company.com" />
          <InfoRow icon={MapPin} label="Address" value="221B Baker Street, London" />
          <InfoRow icon={Globe} label="Country" value="United Kingdom" />
        </div>
      </Panel>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/60 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-brand" /> {label}
      </div>
      <div className="mt-0.5 text-sm font-medium">{value}</div>
    </div>
  );
}

/* ---------------- Settings ---------------- */

function SettingsTab() {
  const { user } = useAuth();
  const { data: profileResp } = useGetProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  const profileData = profileResp?.data || user;

  const [name, setName] = useState(profileData?.name ?? '');
  const [email, setEmail] = useState(profileData?.email ?? '');
  const [website, setWebsite] = useState(profileData?.website ?? '');
  const [location, setLocation] = useState(profileData?.location ?? '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profileData) {
      setName(profileData.name || '');
      setEmail(profileData.email || '');
      setWebsite(profileData.website || '');
      setLocation(profileData.location || '');
    }
  }, [profileData]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await updateProfile({ name, website, location }).unwrap();
      authStore.update({ name, email });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to update profile.');
    }
  }

  async function handleDeleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action is permanent.')) {
      try {
        await deleteAccount(undefined).unwrap();
        authStore.signOut();
        window.location.href = '/';
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete account.');
      }
    }
  }

  return (
    <div className="space-y-6">
      <Panel title="Profile information" subtitle="This is what other team members and support see.">
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <TextField icon={UserIcon} label="Full name" value={name} onChange={setName} />
          <TextField icon={Mail} label="Email (read only)" value={email} onChange={() => {}} disabled />
          <TextField icon={Globe} label="Website" placeholder="https://" value={website} onChange={setWebsite} />
          <TextField icon={MapPin} label="Location" placeholder="City, Country" value={location} onChange={setLocation} />

          {error && (
            <div className="sm:col-span-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
              {error}
            </div>
          )}

          <div className="sm:col-span-2 flex items-center justify-end gap-2">
            {saved && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5" /> Saved
              </span>
            )}
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand/25 cursor-pointer disabled:opacity-60"
            >
              <Save className="h-3.5 w-3.5" /> {isUpdating ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="Preferences" subtitle="Personalize how NovaKit feels for you.">
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectRow label="Language" value="English (US)" />
          <SelectRow label="Timezone" value="UTC+00:00 London" />
          <SelectRow label="Currency" value="USD ($)" />
          <SelectRow label="Theme" value="Follow system" />
        </div>
      </Panel>

      <Panel title="Danger zone" subtitle="Irreversible account actions.">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-4">
          <div>
            <div className="text-sm font-medium">Delete account</div>
            <p className="text-xs text-muted-foreground">Removes your profile, purchases and access to downloads.</p>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20 cursor-pointer disabled:opacity-60"
          >
            <Trash2 className="h-3.5 w-3.5" /> {isDeleting ? 'Deleting...' : 'Delete account'}
          </button>
        </div>
      </Panel>
    </div>
  );
}

function TextField({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
        />
      </div>
    </div>
  );
}

function SelectRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-background/60 p-3">
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
      <button className="text-xs text-brand hover:underline cursor-pointer">Change</button>
    </div>
  );
}

/* ---------------- Security ---------------- */

function SecurityTab() {
  const { data: profileResp } = useGetProfileQuery(undefined);
  const [changePassword, { isLoading: isChangingPw }] = useChangePasswordMutation();
  const [toggle2FA, { isLoading: isToggling2FA }] = useToggleTwoFactorMutation();

  const profileData = profileResp?.data;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [show, setShow] = useState(false);
  const [twofa, setTwofa] = useState(profileData?.two_factor_enabled ?? false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  useEffect(() => {
    if (profileData) {
      setTwofa(Boolean(profileData.two_factor_enabled));
    }
  }, [profileData]);

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      setPwSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPwSuccess(false), 2000);
    } catch (err: any) {
      setPwError(err?.data?.message || 'Password update failed.');
    }
  }

  async function handleToggle2FA() {
    try {
      const res = await toggle2FA(undefined).unwrap();
      setTwofa(res?.data?.two_factor_enabled ?? !twofa);
    } catch {
      setTwofa(!twofa);
    }
  }

  const sessions = useMemo(
    () => [
      { device: 'MacBook Pro · Chrome', location: 'London, UK', last: 'Active now', current: true, icon: LayoutDashboard },
      { device: 'iPhone 15 · Safari', location: 'London, UK', last: '2 hours ago', current: false, icon: Smartphone },
      { device: 'Windows · Firefox', location: 'Berlin, DE', last: '3 days ago', current: false, icon: LayoutDashboard },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <Panel title="Password" subtitle="Use a strong, unique password.">
        <form onSubmit={handlePasswordUpdate} className="grid gap-4 sm:grid-cols-2">
          <PasswordField
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={show}
            setShow={setShow}
          />
          <PasswordField
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            show={show}
            setShow={setShow}
          />

          {pwError && (
            <div className="sm:col-span-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
              {pwError}
            </div>
          )}

          {pwSuccess && (
            <div className="sm:col-span-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-500">
              Password updated successfully!
            </div>
          )}

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isChangingPw || !currentPassword || !newPassword}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:opacity-60"
            >
              <Key className="h-3.5 w-3.5" /> {isChangingPw ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="Two-factor authentication" subtitle="Add an extra layer of security when signing in.">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Fingerprint className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-medium">Authenticator app</div>
              <div className="text-xs text-muted-foreground">{twofa ? 'Enabled with time-based codes.' : 'Use Google Authenticator, 1Password or Authy.'}</div>
            </div>
          </div>
          <button
            onClick={handleToggle2FA}
            disabled={isToggling2FA}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium cursor-pointer disabled:opacity-60 ${twofa ? 'border border-border bg-background hover:border-brand/40' : 'bg-brand-gradient text-white'}`}
          >
            {isToggling2FA ? 'Updating...' : twofa ? 'Disable' : 'Enable 2FA'}
          </button>
        </div>
      </Panel>

      <Panel title="Active sessions" subtitle="Devices signed in to your account.">
        <ul className="divide-y divide-border/60">
          {sessions.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.device} className="flex items-center gap-3 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {s.device}
                    {s.current && (
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-500">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{s.location} · {s.last}</div>
                </div>
                {!s.current && (
                  <button className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-red-500 hover:border-red-500/40 cursor-pointer">
                    <LogOut className="h-3.5 w-3.5" /> Revoke
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  setShow,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  setShow: (v: boolean) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-11 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Notifications ---------------- */

function NotificationsTab() {
  const items = [
    { id: 'updates', title: 'Template updates', desc: 'Get notified when a template you own ships an update.', enabled: true },
    { id: 'billing', title: 'Billing & receipts', desc: 'Payment confirmations, invoices and card expiry alerts.', enabled: true },
    { id: 'news', title: 'Product news', desc: 'New launches, drops and community highlights.', enabled: false },
    { id: 'security', title: 'Security alerts', desc: 'New sign-ins, password changes and unusual activity.', enabled: true },
  ];
  return (
    <Panel title="Notifications" subtitle="Choose what you'd like to hear from NovaKit about.">
      <ul className="divide-y divide-border/60">
        {items.map((i) => (
          <NotificationRow key={i.id} title={i.title} desc={i.desc} defaultOn={i.enabled} />
        ))}
      </ul>
    </Panel>
  );
}

function NotificationRow({ title, desc, defaultOn }: { title: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        role="switch"
        aria-checked={on}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${on ? 'bg-brand-gradient' : 'bg-border'}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </li>
  );
}
