'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
import { authStore, getInitials, useAuth } from '@/src/lib/auth';
import { i18nStore, useI18n } from '@/src/lib/i18n';
import { currencyStore, useCurrency } from '@/src/lib/currency';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();

  const nav = [
    { label: t('Templates'), to: '/templates' },
    { label: t('Design'), to: '/design' },
    { label: t('Services'), to: '/services' },
    { label: t('Pricing'), to: '/products' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.label}
                  href={n.to}
                  className={`rounded-full px-3 py-1.5 text-sm transition hover:bg-accent hover:text-foreground ${
                    active ? 'text-foreground bg-accent' : 'text-muted-foreground'
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
            <UserMenu name={user.name} email={user.email} plan={user.plan} />
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground sm:inline-flex"
              >
                {t('Sign in')}
              </Link>
              <Link
                href="/auth/register"
                className="hidden items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-brand/20 transition hover:opacity-90 sm:inline-flex"
              >
                {t('Get started')} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-3 py-3 sm:px-4 lg:px-6">
            {nav.map((n) => (
              <Link
                key={n.label}
                href={n.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-brand-gradient px-3 py-2 text-sm font-medium text-white"
              >
                <UserIcon className="h-4 w-4" /> {t('Your profile')}
              </Link>
            ) : (
              <div className="mt-2 flex gap-2 border-t border-border/60 pt-3">
                <Link href="/auth/login" className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm">
                  {t('Sign in')}
                </Link>
                <Link href="/auth/register" className="flex-1 rounded-lg bg-brand-gradient px-3 py-2 text-center text-sm font-medium text-white">
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

export function LanguageSwitcher() {
  const { active, languages } = useI18n();
  const current = languages.find((l) => l.code === active);
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
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 text-xs font-medium transition hover:border-brand/40"
        aria-label="Change language"
      >
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="uppercase">{current?.code || 'en'}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-popover p-1 shadow-xl">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                i18nStore.setActive(l.code);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-accent"
            >
              <span className="flex items-center gap-2">
                <span className="inline-flex h-5 w-8 items-center justify-center rounded bg-muted text-[10px] font-semibold uppercase text-muted-foreground">
                  {l.code}
                </span>
                <span>{l.name}</span>
              </span>
              {active === l.code && <Check className="h-3.5 w-3.5 text-brand" />}
            </button>
          ))}
          {languages.length === 1 && (
            <p className="px-3 py-2 text-[11px] text-muted-foreground">
              Add languages in Admin → Language library.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function UserMenu({ name, email, plan }: { name: string; email: string; plan: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useI18n();

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
        aria-label="Open profile menu"
        className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/70 py-1 pl-1 pr-3 text-sm transition hover:border-brand/40"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-[11px] font-semibold text-white">
          {getInitials(name)}
        </span>
        <span className="hidden max-w-[110px] truncate text-xs font-medium sm:inline">{name}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl shadow-black/10">
          <div className="border-b border-border/60 bg-card/60 p-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white">
                {getInitials(name)}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{name}</div>
                <div className="truncate text-xs text-muted-foreground">{email}</div>
              </div>
            </div>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand">
              {plan} plan
            </div>
          </div>
          <div className="p-1 text-sm">
            <MenuLink href="/profile" icon={UserIcon} label={t('Your profile')} onClose={() => setOpen(false)} />
            <MenuLink href="/profile" icon={ShoppingBag} label={t('Purchases & downloads')} onClose={() => setOpen(false)} />
            <MenuLink href="/profile" icon={Receipt} label={t('Billing & invoices')} onClose={() => setOpen(false)} />
            <MenuLink href="/profile" icon={SettingsIcon} label={t('Settings')} onClose={() => setOpen(false)} />
          </div>
          <div className="border-t border-border/60 p-1">
            <button
              onClick={() => {
                authStore.signOut();
                setOpen(false);
                router.push('/');
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" /> {t('Sign out')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
  onClose,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
    >
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}

export function CurrencySwitcher() {
  const { active, currencies } = useCurrency();
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
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 text-xs font-medium transition hover:border-brand/40"
        aria-label="Change currency"
      >
        <CircleDollarSign className="h-3.5 w-3.5 text-muted-foreground" />
        <span>{active?.code || 'USD'}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-popover p-1 shadow-xl">
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                currencyStore.setActive(c.code);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-accent"
            >
              <span className="flex items-center gap-2">
                <span className="inline-flex h-5 w-8 items-center justify-center rounded bg-muted text-[11px] font-semibold text-muted-foreground">
                  {c.symbol}
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-sm">{c.code}</span>
                  <span className="text-[10px] text-muted-foreground">{c.name}</span>
                </span>
              </span>
              {active?.code === c.code && <Check className="h-3.5 w-3.5 text-brand" />}
            </button>
          ))}
          {currencies.length === 1 && (
            <p className="px-3 py-2 text-[11px] text-muted-foreground">
              Add currencies in Admin → Currency options.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
