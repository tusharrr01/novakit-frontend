import type { ReactNode } from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-brand-glow/20 blur-3xl" />

      <div className="relative z-10 flex min-h-screen">
        {/* Left visual panel */}
        <div className="relative hidden w-1/2 flex-col justify-between border-r border-border/60 p-10 lg:flex">
          <div className="flex items-center justify-between">
            <Logo />
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
              ← Back to site
            </Link>
          </div>

          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-brand" /> Trusted by 12,000+ builders
            </div>
            <h2 className="max-w-md font-display text-4xl font-semibold leading-[1.05]">
              Ship your next product with a{' '}
              <span className="text-brand-gradient">beautifully engineered</span> foundation.
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              NovaKit gives you pixel-perfect templates, admin dashboards, and auth flows —
              already wired, themed and production-ready.
            </p>
            <div className="grid max-w-md grid-cols-3 gap-3">
              {[
                { k: '150+', v: 'Templates' },
                { k: '48h', v: 'Ship time' },
                { k: '99.9%', v: 'Uptime' },
              ].map((s) => (
                <div key={s.v} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur">
                  <div className="font-display text-2xl font-semibold text-brand-gradient">{s.k}</div>
                  <div className="text-xs text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-brand" />
            End-to-end encrypted · SOC 2 Type II
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex w-full flex-col lg:w-1/2">
          <div className="flex items-center justify-between p-4 lg:hidden">
            <Logo />
            <ThemeToggle />
          </div>
          <div className="hidden justify-end p-4 lg:flex">
            <ThemeToggle />
          </div>

          <div className="flex flex-1 items-center justify-center px-4 pb-12">
            <div className="w-full max-w-md">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">
                {eyebrow}
              </p>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

              <div className="mt-8">{children}</div>

              {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
