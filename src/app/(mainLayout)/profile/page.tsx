'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '@/src/components/shared/form-fields/TextInput';
import { SelectField } from '@/src/components/shared/form-fields/SelectField';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Country, State, City } from 'country-state-city';
import { format, parseISO } from 'date-fns';
import { SelectDropdown } from '@/src/components/shared/SelectDropdown';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/elements/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/src/elements/ui/command';
import { Calendar as CalendarPicker } from '@/src/elements/ui/calendar';
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Building,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Fingerprint,
  Github,
  Globe,
  Heart,
  Instagram,
  Key,
  LayoutDashboard,
  Linkedin,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
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
  X,
} from 'lucide-react';
import { SiteHeader } from '@/src/layout/SiteHeader';
import { SiteFooter } from '@/src/layout/SiteFooter';
import { authStore, getInitials, useAuth } from '@/src/lib/auth';
import { getPurchasesWithProduct, daysUntil, formatDate } from '@/src/lib/purchases';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} from '@/src/redux/api/profileApi';
import { useGetMyOrdersQuery } from '@/src/redux/api/orderApi';

type Tab =
  | 'settings'
  | 'purchases'
  | 'active'
  | 'wishlist'
  | 'billing'
  | 'security'
  | 'notifications';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'settings', label: 'Account', icon: SettingsIcon },
  { id: 'active', label: 'Active templates', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'security', label: 'Settings & security', icon: ShieldCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

function ProfileContent() {
  const { user, isAuthenticated, hydrated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: profileResp } = useGetProfileQuery(undefined);
  const [updateProfile, { isLoading: isUploadingAvatar }] = useUpdateProfileMutation();
  const profileData = profileResp?.data || user;

  const avatarInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const res = await updateProfile({ avatar: base64Data }).unwrap();
        authStore.update({ avatar: base64Data });
        toast.success(res?.message || 'Profile avatar updated successfully');
      } catch (err: any) {
        toast.error(err?.data?.message || 'Failed to update avatar');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = async () => {
    try {
      const res = await updateProfile({ avatar: null }).unwrap();
      authStore.update({ avatar: '' });
      toast.success(res?.message || 'Profile photo removed');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to remove photo');
    }
  };

  const currentTabParam = searchParams?.get('tab') as Tab | null;
  const validTabs: Tab[] = ['settings', 'purchases', 'active', 'wishlist', 'billing', 'security', 'notifications'];
  const initialTab = currentTabParam && validTabs.includes(currentTabParam) ? currentTabParam : 'settings';

  const [tab, setTab] = useState<Tab>(initialTab);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const formSubmitRef = React.useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (currentTabParam && validTabs.includes(currentTabParam)) {
      setTab(currentTabParam);
      setIsDirty(false);
    }
  }, [currentTabParam]);

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
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="relative group cursor-pointer" title="Edit profile photo">
                        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-brand-gradient text-2xl font-semibold text-white shadow-lg shadow-brand/30">
                          {profileData?.avatar ? (
                            <img src={profileData.avatar} alt={profileData?.name || 'User'} className="h-full w-full object-cover" />
                          ) : (
                            getInitials(profileData?.name || user.name)
                          )}
                          {isUploadingAvatar && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-[10px] font-medium text-white rounded-2xl">
                              Uploading...
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          disabled={isUploadingAvatar}
                          title="Edit profile photo"
                          className="absolute -bottom-1 -right-1 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition shadow-xs cursor-pointer"
                        >
                          <Camera className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </PopoverTrigger>

                    <PopoverContent align="start" side="bottom" sideOffset={6} className="w-48 p-1.5 rounded-xl border border-border bg-popover shadow-xl">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-accent transition cursor-pointer"
                      >
                        <Camera className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData?.avatar ? 'Update photo' : 'Upload photo'}</span>
                      </button>

                      {profileData?.avatar && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span>Remove photo</span>
                        </button>
                      )}
                    </PopoverContent>
                  </Popover>

                  <input
                    type="file"
                    ref={avatarInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-2xl font-semibold tracking-tight">{profileData?.name || user.name}</h1>
                    <BadgeCheck className="h-5 w-5 text-brand" />
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{profileData?.email || user.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    {profileData?.plan && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 font-medium uppercase tracking-wider text-brand">
                        <Sparkles className="h-3 w-3" /> {profileData.plan} plan
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5 text-muted-foreground">
                      <Calendar className="h-3 w-3" /> Joined {formatDate(profileData?.created_at || profileData?.joinedAt || user.joinedAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {tab === 'settings' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (formSubmitRef.current) {
                        formSubmitRef.current.click();
                      }
                    }}
                    disabled={!isDirty || isSaving}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      isDirty && !isSaving
                        ? 'bg-brand-gradient text-white shadow-lg shadow-brand/25 cursor-pointer hover:opacity-90'
                        : 'border border-border bg-background/50 text-muted-foreground opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Save className="h-3.5 w-3.5" />
                    {isSaving ? 'Saving...' : 'Save changes'}
                  </button>
                )}
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

          </section>

          {/* Layout */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] items-start">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-20 lg:self-start z-10">
              <nav className="flex gap-1.5 lg:gap-2.5 overflow-x-auto rounded-2xl border border-border bg-card/60 p-2 backdrop-blur lg:flex-col lg:overflow-visible">
                {TABS.map((t) => {
                  const active = tab === t.id;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTab(t.id);
                        setIsDirty(false);
                        router.replace(`/profile?tab=${t.id}`, { scroll: false });
                      }}
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
            <section className="min-w-0 lg:max-h-[calc(100vh-250px)] lg:overflow-y-auto lg:pr-2.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
              {tab === 'settings' && (
                <SettingsTab
                  setIsDirty={setIsDirty}
                  setIsSaving={setIsSaving}
                  formSubmitRef={formSubmitRef}
                />
              )}
              {tab === 'purchases' && <PurchasesTab purchases={purchases} />}
              {tab === 'active' && <ActiveTab purchases={purchases.filter((p) => p.status !== 'Expired')} />}
              {tab === 'wishlist' && <WishlistTab />}
              {tab === 'billing' && <BillingTab purchases={purchases} totalSpent={totalSpent} />}
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

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
          <SiteHeader />
          <div className="mx-auto max-w-md px-4 py-24 text-center">
            <p className="text-sm text-muted-foreground">Loading profile…</p>
          </div>
          <SiteFooter />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
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
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
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

/* ---------------- Wishlist ---------------- */

function WishlistTab() {
  const [filter, setFilter] = useState<'all' | 'template' | 'design' | 'service'>('all');

  const initialItems = useMemo<any[]>(() => [], []);

  const [items, setItems] = useState(initialItems);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((i) => i.category === filter);
  }, [filter, items]);

  const counts = useMemo(
    () => ({
      all: items.length,
      template: items.filter((i) => i.category === 'template').length,
      design: items.filter((i) => i.category === 'design').length,
      service: items.filter((i) => i.category === 'service').length,
    }),
    [items]
  );

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <Panel title="Wishlist" subtitle="Templates, design systems and services saved for later.">
      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
            filter === 'all'
              ? 'bg-brand-gradient text-white shadow-md shadow-brand/20'
              : 'border border-border bg-background/60 text-muted-foreground hover:bg-accent hover:text-foreground'
          }`}
        >
          All ({counts.all})
        </button>
        <button
          onClick={() => setFilter('template')}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
            filter === 'template'
              ? 'bg-brand-gradient text-white shadow-md shadow-brand/20'
              : 'border border-border bg-background/60 text-muted-foreground hover:bg-accent hover:text-foreground'
          }`}
        >
          Templates ({counts.template})
        </button>
        <button
          onClick={() => setFilter('design')}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
            filter === 'design'
              ? 'bg-brand-gradient text-white shadow-md shadow-brand/20'
              : 'border border-border bg-background/60 text-muted-foreground hover:bg-accent hover:text-foreground'
          }`}
        >
          Designs ({counts.design})
        </button>
        <button
          onClick={() => setFilter('service')}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
            filter === 'service'
              ? 'bg-brand-gradient text-white shadow-md shadow-brand/20'
              : 'border border-border bg-background/60 text-muted-foreground hover:bg-accent hover:text-foreground'
          }`}
        >
          Services ({counts.service})
        </button>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <Heart className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
          <p className="text-sm font-medium">No items saved in wishlist</p>
          <p className="mt-1 text-xs text-muted-foreground">Explore our marketplace to save items for later.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-semibold text-sm">{item.title}</span>
                      <span className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-brand uppercase">
                        {item.type}
                      </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.subtitle}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-amber-500 font-medium">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {item.rating}
                      </span>
                      <span>·</span>
                      <span className="font-medium text-foreground">${item.price}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium hover:border-brand/40 transition"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </Link>
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-gradient px-3.5 py-1.5 text-xs font-medium text-white shadow-md shadow-brand/20 hover:opacity-90 transition"
                  >
                    Get Now
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    title="Remove from wishlist"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition cursor-pointer"
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

/* ---------------- Billing ---------------- */

function BillingTab({ purchases, totalSpent }: { purchases: ReturnType<typeof getPurchasesWithProduct>; totalSpent: number }) {
  const { user } = useAuth();
  const { data: profileResp } = useGetProfileQuery(undefined);
  const profileData = profileResp?.data || user;

  const addressString = [profileData?.address, profileData?.city, profileData?.state, profileData?.zip].filter(Boolean).join(', ') || 'Not set';

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
          <InfoRow icon={UserIcon} label="Name" value={profileData?.name || 'Not set'} />
          <InfoRow icon={Mail} label="Email" value={profileData?.email || 'Not set'} />
          <InfoRow icon={MapPin} label="Address" value={addressString} />
          <InfoRow icon={Globe} label="Country" value={profileData?.country || 'Not set'} />
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

/* ---------------- PhoneField (dial-code picker) ---------------- */

/* Generates 🇮🇳 style flag from ISO code using Unicode Regional Indicator Symbols */
const getFlagEmoji = (iso: string) =>
  iso
    .toUpperCase()
    .split('')
    .map((ch) => String.fromCodePoint(0x1f1e6 - 65 + ch.charCodeAt(0)))
    .join('');

/** Country-specific local phone number digit lengths { min, max } keyed by dial code */
const PHONE_LENGTHS: Record<string, { min: number; max: number }> = {
  '+1':   { min: 10, max: 10 }, // US, Canada
  '+7':   { min: 10, max: 10 }, // Russia, Kazakhstan
  '+20':  { min: 10, max: 10 }, // Egypt
  '+27':  { min:  9, max:  9 }, // South Africa
  '+30':  { min: 10, max: 10 }, // Greece
  '+31':  { min:  9, max:  9 }, // Netherlands
  '+32':  { min:  8, max:  9 }, // Belgium
  '+33':  { min:  9, max:  9 }, // France
  '+34':  { min:  9, max:  9 }, // Spain
  '+36':  { min:  9, max:  9 }, // Hungary
  '+39':  { min:  9, max: 11 }, // Italy
  '+40':  { min:  9, max:  9 }, // Romania
  '+41':  { min:  9, max:  9 }, // Switzerland
  '+43':  { min:  7, max: 13 }, // Austria
  '+44':  { min: 10, max: 10 }, // UK
  '+45':  { min:  8, max:  8 }, // Denmark
  '+46':  { min:  7, max:  9 }, // Sweden
  '+47':  { min:  8, max:  8 }, // Norway
  '+48':  { min:  9, max:  9 }, // Poland
  '+49':  { min: 10, max: 11 }, // Germany
  '+52':  { min: 10, max: 10 }, // Mexico
  '+54':  { min: 10, max: 11 }, // Argentina
  '+55':  { min: 10, max: 11 }, // Brazil
  '+56':  { min:  9, max:  9 }, // Chile
  '+57':  { min: 10, max: 10 }, // Colombia
  '+58':  { min: 10, max: 10 }, // Venezuela
  '+60':  { min:  9, max: 10 }, // Malaysia
  '+61':  { min:  9, max:  9 }, // Australia
  '+62':  { min:  9, max: 12 }, // Indonesia
  '+63':  { min: 10, max: 10 }, // Philippines
  '+64':  { min:  8, max: 10 }, // New Zealand
  '+65':  { min:  8, max:  8 }, // Singapore
  '+66':  { min:  9, max:  9 }, // Thailand
  '+81':  { min: 10, max: 11 }, // Japan
  '+82':  { min:  9, max: 11 }, // South Korea
  '+84':  { min:  9, max: 10 }, // Vietnam
  '+86':  { min: 11, max: 11 }, // China
  '+90':  { min: 10, max: 10 }, // Turkey
  '+91':  { min: 10, max: 10 }, // India
  '+92':  { min: 10, max: 10 }, // Pakistan
  '+93':  { min:  9, max:  9 }, // Afghanistan
  '+94':  { min:  9, max:  9 }, // Sri Lanka
  '+95':  { min:  8, max: 10 }, // Myanmar
  '+98':  { min: 10, max: 10 }, // Iran
  '+212': { min:  9, max:  9 }, // Morocco
  '+213': { min:  9, max:  9 }, // Algeria
  '+216': { min:  8, max:  8 }, // Tunisia
  '+218': { min:  9, max:  9 }, // Libya
  '+221': { min:  9, max:  9 }, // Senegal
  '+233': { min:  9, max:  9 }, // Ghana
  '+234': { min:  8, max: 10 }, // Nigeria
  '+237': { min:  9, max:  9 }, // Cameroon
  '+251': { min:  9, max:  9 }, // Ethiopia
  '+254': { min:  9, max:  9 }, // Kenya
  '+255': { min:  9, max:  9 }, // Tanzania
  '+256': { min:  9, max:  9 }, // Uganda
  '+260': { min:  9, max:  9 }, // Zambia
  '+263': { min:  9, max:  9 }, // Zimbabwe
  '+351': { min:  9, max:  9 }, // Portugal
  '+353': { min:  9, max:  9 }, // Ireland
  '+358': { min:  9, max: 10 }, // Finland
  '+375': { min:  9, max:  9 }, // Belarus
  '+380': { min:  9, max:  9 }, // Ukraine
  '+420': { min:  9, max:  9 }, // Czech Republic
  '+421': { min:  9, max:  9 }, // Slovakia
  '+880': { min: 10, max: 10 }, // Bangladesh
  '+886': { min:  9, max: 10 }, // Taiwan
  '+960': { min:  7, max:  7 }, // Maldives
  '+961': { min:  7, max:  8 }, // Lebanon
  '+962': { min:  9, max:  9 }, // Jordan
  '+964': { min: 10, max: 10 }, // Iraq
  '+965': { min:  8, max:  8 }, // Kuwait
  '+966': { min:  9, max:  9 }, // Saudi Arabia
  '+968': { min:  8, max:  8 }, // Oman
  '+971': { min:  9, max:  9 }, // UAE
  '+972': { min:  9, max:  9 }, // Israel
  '+973': { min:  8, max:  8 }, // Bahrain
  '+974': { min:  8, max:  8 }, // Qatar
  '+977': { min: 10, max: 10 }, // Nepal
};

/** Returns the min/max digit lengths for a given dial code (falls back to ITU-T E.164 range) */
function getPhoneLength(dialCode: string): { min: number; max: number } {
  return PHONE_LENGTHS[dialCode] ?? { min: 7, max: 15 };
}

const DIAL_COUNTRIES = Country.getAllCountries()
  .filter((c) => c.phonecode)
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((c) => ({
    isoCode: c.isoCode,
    name: c.name,
    flag: getFlagEmoji(c.isoCode),
    dialCode: `+${c.phonecode.replace(/\+/g, '')}`,
  }));

function PhoneField({
  dialCode,
  phone,
  onDialCodeChange,
  onPhoneChange,
  error,
  label = 'Mobile number',
}: {
  dialCode: string;
  phone: string;
  onDialCodeChange: (code: string) => void;
  onPhoneChange: (val: string) => void;
  error?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = DIAL_COUNTRIES.find((c) => c.dialCode === dialCode) ?? DIAL_COUNTRIES.find((c) => c.dialCode === '+91')!;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 select-none">
          {label}
        </label>
      )}
      <div className={`flex w-full h-11 overflow-hidden rounded-xl border bg-background transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 ${error ? 'border-red-500' : 'border-border'}`}>
        {/* Dial-code trigger */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-expanded={open}
              className="flex shrink-0 items-center gap-1 border-r border-border bg-muted/30 px-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors select-none cursor-pointer"
            >
              <span className="tabular-nums">{selected.dialCode}</span>
              <svg className="h-3 w-3 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-72 p-0 rounded-xl shadow-2xl border border-border bg-popover overflow-hidden"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <Command>
              <div className="border-b border-border px-3 py-2">
                <CommandInput placeholder="Search country or code…" className="h-8 text-sm" />
              </div>
              <CommandList className="max-h-56 overflow-y-auto">
                <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">No country found.</CommandEmpty>
                <CommandGroup>
                  {DIAL_COUNTRIES.map((c) => (
                    <CommandItem
                      key={c.isoCode}
                      value={`${c.name} ${c.dialCode} ${c.isoCode}`}
                      onSelect={() => {
                        onDialCodeChange(c.dialCode);
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg"
                    >
                      <span className="text-base">{c.flag}</span>
                      <span className="flex-1 text-sm truncate">{c.name}</span>
                      <span className="text-xs font-semibold text-muted-foreground tabular-nums">{c.dialCode}</span>
                      {c.dialCode === dialCode && (
                        <svg className="h-4 w-4 text-indigo-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Number input */}
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          placeholder={`${getPhoneLength(dialCode).max} digits`}
          value={phone}
          maxLength={getPhoneLength(dialCode).max}
          onChange={(e) => {
            const max = getPhoneLength(dialCode).max;
            const digits = e.target.value.replace(/\D/g, '').slice(0, max);
            onPhoneChange(digits);
          }}
          className="flex-1 min-w-0 bg-transparent px-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

/* ---------------- Settings ---------------- */

const profileSchema = Yup.object({
  name: Yup.string().trim().min(2, 'Name must be at least 2 characters').required('Full name is required'),
  phone: Yup.string()
    .trim()
    .transform((v) => v.replace(/\D/g, ''))
    .test('phone-length', '', function (val) {
      if (!val) return true; // field is optional
      const dialCode: string = (this.parent as { dialCode?: string }).dialCode ?? '+91';
      const { min, max } = getPhoneLength(dialCode);
      if (val.length < min)
        return this.createError({ message: `Must be at least ${min} digits for this country` });
      if (val.length > max)
        return this.createError({ message: `Must be at most ${max} digits for this country` });
      return true;
    })
    .optional(),
  dob: Yup.string().optional(),
  company: Yup.string().trim().optional(),
  website: Yup.string().trim().transform((v) => (v === '' ? undefined : v)).url('Enter a valid URL (e.g. https://...)').optional(),
  linkedin: Yup.string().trim().transform((v) => (v === '' ? undefined : v)).url('Enter a valid LinkedIn URL').optional(),
  github: Yup.string().trim().transform((v) => (v === '' ? undefined : v)).url('Enter a valid GitHub URL').optional(),
  instagram: Yup.string().trim().transform((v) => (v === '' ? undefined : v)).url('Enter a valid Instagram URL').optional(),
  country: Yup.string().optional(),
  state: Yup.string().optional(),
  city: Yup.string().optional(),
  zip: Yup.string().trim().optional(),
  address: Yup.string().trim().optional(),
  dialCode: Yup.string().optional(),
});

function normalizeCountryName(rawCountry?: string | null): string {
  if (!rawCountry) return '';
  const search = rawCountry.trim().toLowerCase();
  const found = Country.getAllCountries().find(
    (c) => c.name.toLowerCase() === search || c.isoCode.toLowerCase() === search
  );
  return found ? found.name : rawCountry;
}

function normalizeStateName(rawCountry?: string | null, rawState?: string | null): string {
  if (!rawCountry || !rawState) return rawState || '';
  const countryObj = Country.getAllCountries().find(
    (c) => c.name.toLowerCase() === rawCountry.trim().toLowerCase() || c.isoCode.toLowerCase() === rawCountry.trim().toLowerCase()
  );
  if (!countryObj) return rawState;
  const search = rawState.trim().toLowerCase();
  const states = State.getStatesOfCountry(countryObj.isoCode);
  const found = states.find(
    (s) => s.name.toLowerCase() === search || s.isoCode.toLowerCase() === search
  );
  return found ? found.name : rawState;
}

function SettingsTab({
  setIsDirty,
  setIsSaving,
  formSubmitRef,
}: {
  setIsDirty?: (dirty: boolean) => void;
  setIsSaving?: (saving: boolean) => void;
  formSubmitRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const { user } = useAuth();
  const { data: profileResp } = useGetProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const profileData = profileResp?.data || user;

  const initialValues = useMemo(() => {
    const normCountry = normalizeCountryName(profileData?.country);
    const normState = normalizeStateName(normCountry, profileData?.state);
    return {
      name: profileData?.name || '',
      phone: profileData?.phone || '',
      dob: profileData?.dob || '',
      company: profileData?.company || '',
      website: profileData?.website || '',
      linkedin: profileData?.linkedin || '',
      github: profileData?.github || '',
      instagram: profileData?.instagram || '',
      country: normCountry,
      state: normState,
      city: profileData?.city || '',
      zip: profileData?.zip || '',
      address: profileData?.address || '',
      dialCode: profileData?.dialCode || '+91',
    };
  }, [profileData]);

  useEffect(() => {
    if (setIsSaving) setIsSaving(isUpdating);
  }, [isUpdating, setIsSaving]);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={profileSchema}
      onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
        setStatus(null);
        try {
          const res = await updateProfile(values).unwrap();
          authStore.update({ name: values.name, email: profileData?.email ?? '' });
          resetForm({ values });
          setIsDirty?.(false);
          setStatus({ success: true });
          toast.success(res?.message || 'Profile updated successfully');
          setTimeout(() => setStatus(null), 2500);
        } catch (err: any) {
          const errorMsg = err?.data?.message || 'Failed to update profile.';
          setStatus({ error: errorMsg });
          toast.error(errorMsg);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, touched, isSubmitting, dirty, setFieldValue, status }) => {
        // Notify parent of dirty state
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          setIsDirty?.(dirty);
        }, [dirty]);

        // Country / State / City cascading options
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const allCountries = useMemo(
          () => Country.getAllCountries().map((c) => ({ label: c.name, value: c.name })),
          []
        );

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const selectedCountryObj = useMemo(() => {
          if (!values.country) return undefined;
          const search = values.country.trim().toLowerCase();
          return Country.getAllCountries().find(
            (c) => c.name.toLowerCase() === search || c.isoCode.toLowerCase() === search
          );
        }, [values.country]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const resolvedCountryValue = useMemo(() => {
          if (!values.country) return '';
          return selectedCountryObj ? selectedCountryObj.name : values.country;
        }, [values.country, selectedCountryObj]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const stateOptions = useMemo(
          () =>
            selectedCountryObj
              ? State.getStatesOfCountry(selectedCountryObj.isoCode).map((s) => ({ label: s.name, value: s.name }))
              : [],
          [selectedCountryObj]
        );

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const selectedStateObj = useMemo(() => {
          if (!selectedCountryObj || !values.state) return undefined;
          const search = values.state.trim().toLowerCase();
          return State.getStatesOfCountry(selectedCountryObj.isoCode).find(
            (s) => s.name.toLowerCase() === search || s.isoCode.toLowerCase() === search
          );
        }, [selectedCountryObj, values.state]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const resolvedStateValue = useMemo(() => {
          if (!values.state) return '';
          return selectedStateObj ? selectedStateObj.name : values.state;
        }, [values.state, selectedStateObj]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const cityOptions = useMemo(
          () =>
            selectedCountryObj && selectedStateObj
              ? City.getCitiesOfState(selectedCountryObj.isoCode, selectedStateObj.isoCode).map((c) => ({
                  label: c.name,
                  value: c.name,
                }))
              : [],
          [selectedCountryObj, selectedStateObj]
        );

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const resolvedCityValue = useMemo(() => {
          if (!values.city) return '';
          if (cityOptions.length > 0) {
            const matched = cityOptions.find((c) => c.value.toLowerCase() === values.city.trim().toLowerCase());
            return matched ? matched.value : values.city;
          }
          return values.city;
        }, [values.city, cityOptions]);

        return (
          <div className="space-y-6">
            <Form className="space-y-6">
              {/* Hidden submit trigger for header button */}
              <button ref={formSubmitRef} type="submit" className="hidden" />

              {/* Personal & Contact */}
              <Panel title="Personal & Contact details" subtitle="Manage your personal profile and primary contact information.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <TextInput
                      id="name"
                      name="name"
                      label="Full name"
                      icon={UserIcon}
                      placeholder="John Doe"
                      value={values.name}
                      onChange={(e) => setFieldValue('name', e.target.value)}
                      error={touched.name && errors.name ? errors.name as string : undefined}
                    />
                  </div>

                  <div>
                    <TextInput
                      id="email"
                      name="email"
                      label="Email"
                      icon={Mail}
                      value={profileData?.email ?? ''}
                      disabled
                    />
                  </div>

                  {/* Phone with country code */}
                  <PhoneField
                    dialCode={values.dialCode ?? '+91'}
                    phone={values.phone}
                    onDialCodeChange={(code) => {
                      setFieldValue('dialCode', code);
                      // Truncate phone to new country's max on country switch
                      const newMax = getPhoneLength(code).max;
                      if (values.phone.length > newMax) {
                        setFieldValue('phone', values.phone.slice(0, newMax));
                      }
                    }}
                    onPhoneChange={(val) => setFieldValue('phone', val)}
                    error={touched.phone && errors.phone ? errors.phone as string : undefined}
                  />

                  {/* Date of birth */}
                  <div>
                    <DatePickerField
                      label="Date of birth"
                      value={values.dob}
                      onChange={(val) => setFieldValue('dob', val)}
                    />
                    {touched.dob && errors.dob && (
                      <p className="mt-1 text-xs text-red-500">{errors.dob as string}</p>
                    )}
                  </div>
                </div>
              </Panel>

              {/* Social & Portfolio */}
              <Panel title="Social & Portfolio Links" subtitle="Share your online presence, portfolio website and social profiles.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput
                    id="website"
                    name="website"
                    label="Portfolio URL"
                    icon={Globe}
                    placeholder="https://yourportfolio.com"
                    value={values.website}
                    onChange={(e) => setFieldValue('website', e.target.value)}
                    error={touched.website && errors.website ? errors.website as string : undefined}
                  />
                  <TextInput
                    id="linkedin"
                    name="linkedin"
                    label="LinkedIn profile"
                    icon={Linkedin}
                    placeholder="https://linkedin.com/in/username"
                    value={values.linkedin}
                    onChange={(e) => setFieldValue('linkedin', e.target.value)}
                    error={touched.linkedin && errors.linkedin ? errors.linkedin as string : undefined}
                  />
                  <TextInput
                    id="github"
                    name="github"
                    label="GitHub profile"
                    icon={Github}
                    placeholder="https://github.com/username"
                    value={values.github}
                    onChange={(e) => setFieldValue('github', e.target.value)}
                    error={touched.github && errors.github ? errors.github as string : undefined}
                  />
                  <TextInput
                    id="instagram"
                    name="instagram"
                    label="Instagram profile"
                    icon={Instagram}
                    placeholder="https://instagram.com/username"
                    value={values.instagram}
                    onChange={(e) => setFieldValue('instagram', e.target.value)}
                    error={touched.instagram && errors.instagram ? errors.instagram as string : undefined}
                  />
                </div>
              </Panel>

              {/* Address & Location */}
              <Panel title="Address & Location" subtitle="Manage your address, region and billing location details.">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Country */}
                  <SelectField
                    id="country"
                    name="country"
                    label="Country"
                    options={allCountries}
                    value={resolvedCountryValue}
                    onChange={(val) => {
                      if (val !== values.country) {
                        setFieldValue('country', val);
                        setFieldValue('state', '');
                        setFieldValue('city', '');
                      }
                    }}
                    placeholder="Select Country"
                    error={touched.country && errors.country ? errors.country as string : undefined}
                  />

                  {/* State */}
                  <SelectField
                    id="state"
                    name="state"
                    label="State / Province"
                    options={stateOptions}
                    value={resolvedStateValue}
                    onChange={(val) => {
                      if (val !== values.state) {
                        setFieldValue('state', val);
                        setFieldValue('city', '');
                      }
                    }}
                    placeholder={
                      !resolvedCountryValue
                        ? 'Select Country first'
                        : stateOptions.length === 0
                        ? 'No states available'
                        : 'Select State'
                    }
                    disabled={!resolvedCountryValue || stateOptions.length === 0}
                    error={touched.state && errors.state ? errors.state as string : undefined}
                  />

                  {/* City */}
                  {cityOptions.length > 0 ? (
                    <SelectField
                      id="city"
                      name="city"
                      label="City"
                      options={cityOptions}
                      value={resolvedCityValue}
                      onChange={(val) => setFieldValue('city', val)}
                      placeholder={!resolvedStateValue ? 'Select State first' : 'Select City'}
                      disabled={!resolvedStateValue}
                      error={touched.city && errors.city ? errors.city as string : undefined}
                    />
                  ) : (
                    <TextInput
                      id="city"
                      name="city"
                      label="City"
                      icon={MapPin}
                      placeholder={!resolvedStateValue ? 'Select State first' : 'Enter city name'}
                      value={values.city}
                      onChange={(e) => setFieldValue('city', e.target.value)}
                      disabled={!resolvedStateValue}
                      error={touched.city && errors.city ? errors.city as string : undefined}
                    />
                  )}

                  <TextInput
                    id="zip"
                    name="zip"
                    label="Zip / Postal Code"
                    icon={MapPin}
                    placeholder="94103"
                    value={values.zip}
                    onChange={(e) => setFieldValue('zip', e.target.value)}
                    error={touched.zip && errors.zip ? errors.zip as string : undefined}
                  />

                  <div className="sm:col-span-2">
                    <TextInput
                      id="address"
                      name="address"
                      label="Street Address"
                      icon={MapPin}
                      placeholder="123 Market Street, Suite 400"
                      value={values.address}
                      onChange={(e) => setFieldValue('address', e.target.value)}
                      error={touched.address && errors.address ? errors.address as string : undefined}
                    />
                  </div>
                </div>

              </Panel>
            </Form>

            <Panel title="Preferences" subtitle="Personalize how NovaKit feels for you.">
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectRow label="Language" value="English (US)" />
                <SelectRow label="Timezone" value="UTC+00:00 London" />
                <SelectRow label="Currency" value="USD ($)" />
                <SelectRow label="Theme" value="Follow system" />
              </div>
            </Panel>
          </div>
        );
      }}
    </Formik>
  );
}

function TextField({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  type = 'text',
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>}
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type={type}
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

function DatePickerField({
  label,
  value,
  onChange,
  placeholder = 'Select date of birth',
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => {
    if (!value) return undefined;
    try {
      const parsed = parseISO(value);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    } catch {
      return undefined;
    }
  }, [value]);

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 select-none">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm flex items-center justify-between outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer ${
              !value ? 'text-muted-foreground' : 'text-foreground'
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden truncate">
              <Calendar className="h-4 w-4 text-brand shrink-0" />
              <span className="truncate">
                {selectedDate ? format(selectedDate, 'PPP') : placeholder}
              </span>
            </div>
            {value && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="p-1 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0 bg-card border border-border shadow-2xl rounded-2xl z-50">
          <CalendarPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                onChange(`${year}-${month}-${day}`);
              } else {
                onChange('');
              }
              setOpen(false);
            }}
            captionLayout="dropdown"
            startMonth={new Date(1930, 0)}
            endMonth={new Date()}
            defaultMonth={selectedDate || new Date(2000, 0)}
          />
        </PopoverContent>
      </Popover>
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
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [show, setShow] = useState(false);

  const pwRules = useMemo(
    () => [
      { label: '8+ chars', ok: newPassword.length >= 8 },
      { label: '1 number', ok: /\d/.test(newPassword) },
      { label: '1 special char', ok: /[^A-Za-z0-9]/.test(newPassword) },
    ],
    [newPassword]
  );

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password.');
      return;
    }
    if (!newPassword) {
      toast.error('Please enter a new password.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }
    if (!/\d/.test(newPassword)) {
      toast.error('New password must contain at least 1 number.');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      toast.error('New password must contain at least 1 special character.');
      return;
    }
    if (currentPassword === newPassword) {
      toast.error('New password cannot be the same as your current password.');
      return;
    }

    try {
      const res = await changePassword({ currentPassword, newPassword }).unwrap();
      setCurrentPassword('');
      setNewPassword('');
      toast.success(res?.message || 'Password updated successfully!');
    } catch (err: any) {
      const errorMsg = err?.data?.message || err?.message || 'Password update failed.';
      toast.error(errorMsg);
    }
  }

  async function handleDeleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action is permanent.')) {
      try {
        await deleteAccount(undefined).unwrap();
        toast.success('Account deleted successfully');
        authStore.signOut();
        window.location.href = '/';
      } catch (err: any) {
        toast.error(err?.data?.message || 'Failed to delete account.');
      }
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
      <Panel
        title="Password"
        subtitle="Use a strong, unique password."
        actions={
          <button
            type="submit"
            form="password-form"
            disabled={isChangingPw || !currentPassword || !newPassword || !pwRules.every((r) => r.ok)}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:opacity-60"
          >
            <Key className="h-3.5 w-3.5" /> {isChangingPw ? 'Updating...' : 'Update password'}
          </button>
        }
      >
        <form id="password-form" onSubmit={handlePasswordUpdate} className="grid gap-4 sm:grid-cols-2">
          <PasswordField
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={show}
            setShow={setShow}
          />
          <div>
            <PasswordField
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              show={show}
              setShow={setShow}
            />
            <div className="mt-2.5 flex flex-wrap gap-3 text-xs">
              {pwRules.map((r) => (
                <span
                  key={r.label}
                  className={`inline-flex items-center gap-1 transition-colors ${
                    r.ok ? 'text-emerald-500 font-medium' : 'text-muted-foreground'
                  }`}
                >
                  <Check className="h-3 w-3" /> {r.label}
                </span>
              ))}
            </div>
          </div>
        </form>
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
  const { data: profileResp } = useGetProfileQuery(undefined);
  const [updateProfile] = useUpdateProfileMutation();
  const userNotifications = profileResp?.data?.notifications || {};

  const items = [
    { key: 'template_updates', title: 'Template updates', desc: 'Get notified when a template you own ships an update.', defaultOn: userNotifications.template_updates ?? true },
    { key: 'billing_receipts', title: 'Billing & receipts', desc: 'Payment confirmations, invoices and card expiry alerts.', defaultOn: userNotifications.billing_receipts ?? true },
    { key: 'product_news', title: 'Product news', desc: 'New launches, drops and community highlights.', defaultOn: userNotifications.product_news ?? false },
    { key: 'security_alerts', title: 'Security alerts', desc: 'New sign-ins, password changes and unusual activity.', defaultOn: userNotifications.security_alerts ?? true },
  ];

  const handleToggle = async (key: string, currentValue: boolean) => {
    const newNotifications = {
      template_updates: userNotifications.template_updates ?? true,
      billing_receipts: userNotifications.billing_receipts ?? true,
      product_news: userNotifications.product_news ?? false,
      security_alerts: userNotifications.security_alerts ?? true,
      [key]: !currentValue,
    };
    try {
      const res = await updateProfile({ notifications: newNotifications }).unwrap();
      toast.success(res?.message || 'Notification preference updated');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update notification preference');
    }
  };

  return (
    <Panel title="Notifications" subtitle="Choose what you'd like to hear from NovaKit about.">
      <ul className="divide-y divide-border/60">
        {items.map((i) => (
          <NotificationRow
            key={i.key}
            title={i.title}
            desc={i.desc}
            on={i.defaultOn}
            onToggle={() => handleToggle(i.key, i.defaultOn)}
          />
        ))}
      </ul>
    </Panel>
  );
}

function NotificationRow({ title, desc, on, onToggle }: { title: string; desc: string; on: boolean; onToggle: () => void }) {
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <button
        onClick={onToggle}
        role="switch"
        aria-checked={on}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${on ? 'bg-brand-gradient' : 'bg-border'}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </li>
  );
}
