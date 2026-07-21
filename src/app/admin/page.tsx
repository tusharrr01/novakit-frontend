'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  PanelLeft,
  ShoppingBag,
  Users as UsersIcon,
  Settings,
  BarChart3,
  Package,
  Plus,
  Sparkles,
  LogOut,
  Wallet,
  Globe,
  CreditCard,
  Layers,
  Megaphone,
  AtSign,
  ShieldCheck,
  Receipt,
  Eye,
  MessageSquare,
  Key as KeyIcon,
  Languages,
  SlidersHorizontal,
} from 'lucide-react';

import { ThemeToggle } from '@/src/layout/theme-toggle';
import { Logo } from '@/src/layout/logo';
import { LanguageSwitcher, CurrencySwitcher } from '@/src/components/site/site-header';
import { SystemPreferencesTab } from '@/src/components/admin/system-preferences-tab';
import { PageManagementTab } from '@/src/components/admin/page-management-tab';
import { ProductsTab } from '@/src/components/admin/products-tab';
import { DesignsAdmin } from '@/src/components/admin/designs-admin';
import { AnnouncementsTab } from '@/src/components/admin/announcements-tab';
import { OrdersTab } from '@/src/components/admin/orders-tab';
import { OverviewTab } from '@/src/components/admin/overview-tab';
import { NotificationsBell } from '@/src/components/admin/notifications-bell';

import { AnalyticsTab } from '@/src/components/admin/analytics-tab';
import { UsersTab } from '@/src/components/admin/users-tab';
import { RolesTab } from '@/src/components/admin/roles-tab';
import { PlansTab } from '@/src/components/admin/plans-tab';
import { FaqsTab } from '@/src/components/admin/faqs-tab';
import { TestimonialsTab } from '@/src/components/admin/testimonials-tab';
import { AuthPagesTab } from '@/src/components/admin/authpages-tab';
import { EmailTemplatesTab } from '@/src/components/admin/emails-tab';
import { PaymentsTab } from '@/src/components/admin/payments-tab';
import { LanguageLibraryTab } from '@/src/components/admin/language-tab';
import { CurrencyOptionsTab } from '@/src/components/admin/currency-tab';
import { getInitials } from '@/src/lib/auth';

type TabKey =
  | 'overview'
  | 'analytics'
  | 'users'
  | 'products'
  | 'orders'
  | 'plans'
  | 'payouts'
  | 'roles'
  | 'pages'
  | 'faqs'
  | 'testimonials'
  | 'authpages'
  | 'emails'
  | 'announcements'
  | 'payments'
  | 'language'
  | 'currency'
  | 'syspref';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Collapsible sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Tab states
  const [tab, setTab] = useState<TabKey>('overview');
  const [productSub, setProductSub] = useState<'templates' | 'designs' | 'services'>('templates');
  const [planSub, setPlanSub] = useState<'management' | 'customers'>('management');

  // Route protection checks
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-500 text-sm">
        Verifying administrator session...
      </div>
    );
  }

  const role = (session?.user as any)?.role || (session?.user as any)?.role_key || 'user';
  const isAdmin = role === 'admin' || role === 'super_admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-center p-8">
        <ShieldCheck className="h-16 w-16 text-rose-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Access Denied</h1>
        <p className="mt-2 text-sm text-neutral-500 max-w-sm">
          You do not have the required administrative permissions to access this control dashboard.
        </p>
        <Link href="/" className="mt-6 text-sm font-semibold text-indigo-600 hover:underline">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const userName = session?.user?.name || 'Administrator';
  const userEmail = session?.user?.email || 'admin@novakit.app';

  // Navigation configurations
  const menuGroups = [
    {
      title: 'Main',
      items: [
        { key: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { key: 'analytics', label: 'Analytics', icon: BarChart3 },
        { key: 'users', label: 'Users', icon: UsersIcon },
        {
          key: 'products',
          label: 'Products',
          icon: Package,
          expandable: true,
          subItems: [
            { subKey: 'templates', label: 'Templates' },
            { subKey: 'designs', label: 'Designs' },
            { subKey: 'services', label: 'Services' },
          ],
        },
        { key: 'orders', label: 'Orders', icon: ShoppingBag },
        {
          key: 'plans',
          label: 'Plans',
          icon: Receipt,
          expandable: true,
          subItems: [
            { subKey: 'management', label: 'Plan management' },
            { subKey: 'customers', label: 'Customer plans' },
          ],
        },
      ],
    },
    {
      title: 'Operations',
      items: [
        { key: 'payouts', label: 'Payouts', icon: Wallet },
        { key: 'roles', label: 'Permission management', icon: ShieldCheck },
        { key: 'pages', label: 'Page management', icon: Layers },
      ],
    },
    {
      title: 'Content',
      items: [
        { key: 'faqs', label: 'FAQs', icon: MessageSquare },
        { key: 'testimonials', label: 'Testimonials', icon: Eye },
        { key: 'authpages', label: 'Auth pages', icon: KeyIcon },
        { key: 'emails', label: 'Email templates', icon: AtSign },
        { key: 'announcements', label: 'Announcements', icon: Megaphone },
      ],
    },
    {
      title: 'Settings',
      items: [
        { key: 'payments', label: 'Payment gateways', icon: CreditCard },
        { key: 'language', label: 'Language library', icon: Languages },
        { key: 'currency', label: 'Currency options', icon: SlidersHorizontal },
        { key: 'syspref', label: 'System preferences', icon: Settings },
      ],
    },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar navigation panel */}
      <aside
        className={`flex flex-col border-r border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-border/60">
          {sidebarOpen ? <Logo /> : <div className="h-8 w-8 rounded bg-brand/10" />}
        </div>

        <div className="flex-1 overflow-y-auto thin-scrollbar p-3 space-y-4">
          {menuGroups.map((g) => (
            <div key={g.title} className="space-y-1">
              {sidebarOpen && (
                <h4 className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {g.title}
                </h4>
              )}
              <div className="space-y-0.5">
                {g.items.map((i) => {
                  const Icon = i.icon;
                  const isSelected = tab === i.key;
                  return (
                    <div key={i.key} className="space-y-0.5">
                      <button
                        onClick={() => {
                          setTab(i.key as TabKey);
                          if (i.key === 'products') setProductSub('templates');
                          if (i.key === 'plans') setPlanSub('management');
                        }}
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-all ${
                          isSelected
                            ? 'bg-brand/10 text-brand font-medium'
                            : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {sidebarOpen && <span className="truncate">{i.label}</span>}
                      </button>

                      {/* Expandable submenus */}
                      {i.expandable && sidebarOpen && isSelected && (
                        <div className="ml-7 border-l border-border pl-2 space-y-1">
                          {i.subItems?.map((s) => {
                            const subActive =
                              i.key === 'products'
                                ? productSub === s.subKey
                                : planSub === s.subKey;
                            return (
                              <button
                                key={s.subKey}
                                onClick={() => {
                                  if (i.key === 'products') {
                                    setProductSub(s.subKey as any);
                                  } else {
                                    setPlanSub(s.subKey as any);
                                  }
                                }}
                                className={`block w-full py-1 text-left text-xs transition ${
                                  subActive ? 'text-brand font-medium' : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                {s.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User context footer */}
        <div className="p-4 border-t border-border/60 flex flex-col gap-2">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-white shadow">
                {getInitials(userName)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold">{userName}</div>
                <div className="truncate text-[10px] text-muted-foreground">{userEmail}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => router.push('/')}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs transition text-rose-500 hover:bg-rose-500/10`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>Marketplace</span>}
          </button>
        </div>
      </aside>

      {/* Main dashboard content container */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-card/45 px-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:border-brand/40"
              aria-label="Toggle sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
            {sidebarOpen && (
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60 hidden sm:inline">
                Admin Panel / {tab}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <CurrencySwitcher />
            <ThemeToggle />
            <NotificationsBell />
          </div>
        </header>

        {/* Dynamic content rendering frame */}
        <div className="flex-1 min-h-0 p-4 lg:p-6 overflow-hidden">
          {tab === 'overview' && <OverviewTab />}
          {tab === 'analytics' && <AnalyticsTab />}
          {tab === 'users' && <UsersTab />}
          {tab === 'products' && (
            productSub === 'designs' ? (
              <DesignsAdmin />
            ) : (
              <ProductsTab sub={productSub} />
            )
          )}
          {tab === 'orders' && <OrdersTab />}
          {tab === 'plans' && <PlansTab sub={planSub} />}
          {tab === 'payouts' && <ComingSoon label="Payouts" />}
          {tab === 'roles' && <RolesTab />}
          {tab === 'pages' && <PageManagementTab />}
          {tab === 'faqs' && <FaqsTab />}
          {tab === 'testimonials' && <TestimonialsTab />}
          {tab === 'authpages' && <AuthPagesTab />}
          {tab === 'emails' && <EmailTemplatesTab />}
          {tab === 'announcements' && <AnnouncementsTab />}
          {tab === 'payments' && <PaymentsTab />}
          {tab === 'language' && <LanguageLibraryTab />}
          {tab === 'currency' && <CurrencyOptionsTab />}
          {tab === 'syspref' && <SystemPreferencesTab />}
        </div>
      </main>
    </div>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center p-6 border border-border bg-card/40 rounded-xl">
      <Sparkles className="h-12 w-12 text-brand animate-pulse mb-3" />
      <h2 className="font-display text-xl font-semibold tracking-tight">{label} Module</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        This administration tab is currently under active development. More features are coming soon.
      </p>
    </div>
  );
}
