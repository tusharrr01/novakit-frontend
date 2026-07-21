'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  PanelLeft,
  ShoppingBag,
  Users as UsersIcon,
  Settings,
  BarChart3,
  Package,
  Sparkles,
  LogOut,
  Wallet,
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
import { NotificationsBell } from '@/src/components/admin/notifications-bell';
import { getInitials } from '@/src/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Collapsible sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Route protection checks
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
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

  // Navigation configurations matched to WAPI routing names
  const menuGroups = [
    {
      title: 'Main',
      items: [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/admin/users', label: 'Users', icon: UsersIcon },
        {
          path: '/admin/template_management', // Base path for products
          label: 'Products',
          icon: Package,
          expandable: true,
          subItems: [
            { path: '/admin/template_management', label: 'Templates' },
            { path: '/admin/design_management', label: 'Designs' },
            { path: '/admin/service_management', label: 'Services' },
          ],
        },
        { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
        {
          path: '/admin/plan_management', // Base path for plans
          label: 'Plans',
          icon: Receipt,
          expandable: true,
          subItems: [
            { path: '/admin/plan_management', label: 'Plan management' },
            { path: '/admin/customer_plans', label: 'Customer plans' },
          ],
        },
      ],
    },
    {
      title: 'Operations',
      items: [
        { path: '/admin/payouts', label: 'Payouts', icon: Wallet },
        { path: '/admin/permissions_control', label: 'Permission management', icon: ShieldCheck },
        { path: '/admin/page_management', label: 'Page management', icon: Layers },
      ],
    },
    {
      title: 'Content',
      items: [
        { path: '/admin/faq_management', label: 'FAQs', icon: MessageSquare },
        { path: '/admin/testimonial_management', label: 'Testimonials', icon: Eye },
        { path: '/admin/auth_page_setup', label: 'Auth pages', icon: KeyIcon },
        { path: '/admin/email_templates', label: 'Email templates', icon: AtSign },
        { path: '/admin/announcements', label: 'Announcements', icon: Megaphone },
      ],
    },
    {
      title: 'Settings',
      items: [
        { path: '/admin/gateway_setup', label: 'Payment gateways', icon: CreditCard },
        { path: '/admin/language_library', label: 'Language library', icon: Languages },
        { path: '/admin/currency_options', label: 'Currency options', icon: SlidersHorizontal },
        { path: '/admin/system_preferences', label: 'System preferences', icon: Settings },
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

        <div className="flex-1 overflow-y-auto scrollbar-hidden p-3 space-y-4">
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
                  // If path matches perfectly or if this is products/plans and current pathname is one of subItems
                  const isSelected = i.expandable
                    ? i.subItems?.some((sub) => pathname === sub.path)
                    : pathname === i.path;
                  
                  return (
                    <div key={i.path} className="space-y-0.5">
                      <Link
                        href={i.path}
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-all ${
                          isSelected
                            ? 'bg-brand/10 text-brand font-medium'
                            : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {sidebarOpen && <span className="truncate">{i.label}</span>}
                      </Link>

                      {/* Expandable submenus */}
                      {i.expandable && sidebarOpen && isSelected && (
                        <div className="ml-7 border-l border-border pl-2 space-y-1">
                          {i.subItems?.map((s) => {
                            const subActive = pathname === s.path;
                            return (
                              <Link
                                key={s.path}
                                href={s.path}
                                className={`block w-full py-1 text-left text-xs transition ${
                                  subActive ? 'text-brand font-medium' : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                {s.label}
                              </Link>
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
        <div className="p-4 border-t border-border/60">
          <div className="flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-white shadow shrink-0">
                {getInitials(userName)}
              </span>
              {sidebarOpen && (
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold">{userName}</div>
                  <div className="truncate text-[10px] text-muted-foreground">{userEmail}</div>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                title="Log out"
                className="p-1.5 rounded-md text-rose-500 hover:bg-rose-500/10 transition shrink-0"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
          {!sidebarOpen && (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              title="Log out"
              className="p-1.5 mt-2 rounded-md text-rose-500 hover:bg-rose-500/10 transition shrink-0 w-full flex justify-center"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
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
                Admin Panel / {pathname.replace('/admin/', '').replace('_', ' ')}
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
        <div className="flex-1 min-h-0 pl-4 pt-4 pb-4 pr-0 lg:pl-6 lg:pt-6 lg:pb-6 lg:pr-0 overflow-hidden admin-page-content-area">
          {children}
        </div>
      </main>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-md scale-95 transform rounded-2xl border border-border/85 bg-card p-6 shadow-2xl transition-all dark:bg-zinc-900">
            <h3 className="text-lg font-bold tracking-tight text-foreground">Confirm Logout</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to log out of the administrator control panel? Any unsaved edits will be discarded.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  signOut({ callbackUrl: '/auth/login' });
                }}
                className="rounded-lg bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-semibold text-white shadow-md hover:shadow-rose-600/20 transition"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
