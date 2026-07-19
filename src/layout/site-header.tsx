'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation.js';
import { useEffect, useRef, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  Globe,
  LogOut,
  Menu,
  Receipt,
  Settings as SettingsIcon,
  ShoppingBag,
  User as UserIcon,
  X,
} from 'lucide-react';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { useCurrency } from '@/src/lib/currency';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { t, i18n } = useTranslation();

  const user = session?.user as any;
  const isAuthenticated = status === 'authenticated';

  const nav = [
    { label: t('Templates'), href: '/templates' },
    { label: t('Design'), href: '/designs' },
    { label: t('Services'), href: '/services' },
  ];

  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'N';
    return nameStr.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => {
              const active = pathname.startsWith(n.href);
              return (
                <Link
                  key={n.label}
                  href={n.href}
                  className={`rounded-full px-3 py-1.5 text-sm transition hover:bg-neutral-100 dark:hover:bg-neutral-900 ${
                    active ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <CurrencySwitcher />
          <ThemeToggle />
          {isAuthenticated && user ? (
            <UserMenu name={user.name} email={user.email} role={user.role} getInitials={getInitials} />
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 transition hover:text-neutral-900 dark:hover:text-white sm:inline-flex"
              >
                {t('Sign in')}
              </Link>
              <Link
                href="/register"
                className="hidden items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 sm:inline-flex"
              >
                {t('Get started')} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 md:hidden text-neutral-700 dark:text-neutral-300"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-950 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-3 py-3 sm:px-4 lg:px-6">
            {nav.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                {n.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white"
              >
                <UserIcon className="h-4 w-4" /> {t('Your profile')}
              </Link>
            ) : (
              <div className="mt-2 flex gap-2 border-t border-neutral-200 dark:border-neutral-800 pt-3">
                <Link href="/login" onClick={() => setOpen(false)} className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-2 text-center text-sm text-neutral-700 dark:text-neutral-300">
                  {t('Sign in')}
                </Link>
                <Link href="/register" onClick={() => setOpen(false)} className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-medium text-white">
                  {t('Get started')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const languages = [
    { name: 'English', code: 'en' },
    { name: 'Hindi', code: 'hi' },
  ];

  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 px-3 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition hover:border-indigo-500/40"
        aria-label="Change language"
      >
        <Globe className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
        <span className="uppercase">{current.code}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-1 shadow-xl">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                i18n.changeLanguage(l.code);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <span>{l.name}</span>
              {i18n.language === l.code && <Check className="h-3.5 w-3.5 text-indigo-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CurrencySwitcher() {
  const { active, currencies, setActive } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 px-3 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition hover:border-indigo-500/40"
        aria-label="Change currency"
      >
        <CircleDollarSign className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
        <span>{active?.code || 'USD'}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-1 shadow-xl">
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                setActive(c.code);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <span className="flex items-center gap-2">
                <span className="inline-flex h-5 w-6 items-center justify-center rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-semibold text-neutral-500">
                  {c.symbol}
                </span>
                <span className="flex flex-col text-left leading-tight">
                  <span className="text-sm font-medium">{c.code}</span>
                  <span className="text-[10px] text-neutral-400">{c.name}</span>
                </span>
              </span>
              {active?.code === c.code && <Check className="h-3.5 w-3.5 text-indigo-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UserMenu({ name, email, role, getInitials }: { name: string; email: string; role: string; getInitials: any }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 py-1 pl-1 pr-3 text-sm text-neutral-800 dark:text-neutral-200 transition hover:border-indigo-500/40"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-semibold text-white">
          {getInitials(name)}
        </span>
        <span className="hidden max-w-[110px] truncate text-xs font-medium sm:inline">{name}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl shadow-black/10 text-neutral-800 dark:text-neutral-200">
          <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 p-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                {getInitials(name)}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{name}</div>
                <div className="truncate text-xs text-neutral-400">{email}</div>
              </div>
            </div>
          </div>
          <div className="p-1 text-sm">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-neutral-600 dark:text-neutral-400 transition hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
            >
              <UserIcon className="h-4 w-4" /> {name} Account
            </Link>
          </div>
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-1">
            <button
              onClick={() => {
                signOut({ redirect: true, callbackUrl: '/' });
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default SiteHeader;
