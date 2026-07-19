'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Settings,
  Package,
  Palette,
  Wrench,
  Megaphone,
  ShieldCheck,
  ShoppingBag,
  Bell,
  Search,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { ThemeToggle } from '@/src/layout/theme-toggle';
import { Logo } from '@/src/layout/logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Route protection
  React.useEffect(() => {
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

  const role = (session?.user as any)?.role_key || 'user';
  const isAdmin = role === 'admin' || role === 'super_admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-center p-8">
        <ShieldCheck className="h-16 w-16 text-rose-500 mb-4" />
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

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Templates', href: '/admin/templates', icon: Package },
    { name: 'Designs', href: '/admin/designs', icon: Palette },
    { name: 'Services', href: '/admin/services', icon: Wrench },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { name: 'RBAC Controls', href: '/admin/rbac', icon: ShieldCheck },
    { name: 'Orders Log', href: '/admin/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex text-neutral-800 dark:text-neutral-200">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 flex flex-col justify-between shrink-0">
        <div className="flex flex-col">
          {/* Brand header */}
          <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-900 flex items-center justify-between">
            <Logo />
            <span className="text-[9px] font-extrabold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                      : 'text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile section */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
              {session?.user?.name?.[0] || 'A'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold truncate text-neutral-900 dark:text-white">{session?.user?.name || 'Administrator'}</span>
              <span className="text-[10px] text-neutral-400 truncate uppercase font-bold tracking-wider">{role}</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Workspace content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header toolbar */}
        <header className="h-16 border-b border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 px-6 flex items-center justify-between shrink-0">
          <div className="relative w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Quick search configurations..."
              className="h-9 w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full pl-9 pr-4 text-xs outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="h-9 w-9 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center hover:border-indigo-500 transition text-neutral-500">
              <Bell className="h-4.5 w-4.5" />
            </button>
            <Link href="/" className="text-xs font-semibold text-neutral-500 hover:text-indigo-650 flex items-center gap-1">
              Marketplace <ChevronDown className="h-3 w-3" />
            </Link>
          </div>
        </header>

        {/* Dynamic page container */}
        <div className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
