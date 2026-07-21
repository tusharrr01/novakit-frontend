'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  Palette,
  Code2,
  Blocks,
  Star,
  Bot,
  Check,
  LineChart,
  Plus,
  Minus,
  Quote,
} from 'lucide-react';
import { SiteHeader } from '@/src/layout/site-header';
import { SiteFooter } from '@/src/layout/site-footer';
import { AnnouncementMarquee } from '@/src/components/site/announcement-marquee';
import { useFaqs, useTestimonials } from '@/src/lib/site-content';
import { useI18n } from '@/src/lib/i18n';
import { useCurrency } from '@/src/lib/currency';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnnouncementMarquee location="landing" />
      <SiteHeader />
      <Hero />
      <LogoStrip />
      <Bento />
      <Showcase />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-brand-glow/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-3 pt-20 pb-24 sm:px-4 lg:px-6 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            New · NovaKit v2 with AI-native building blocks
            <ArrowRight className="h-3 w-3" />
          </div>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            The <span className="text-brand-gradient">AI-first</span> toolkit
            <br />
            for shipping serious products.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Production-ready templates, admin dashboards and complete auth flows —
            beautifully designed, fully themed, and ready to launch in hours, not weeks.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/templates"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-medium text-white shadow-xl shadow-brand/25 transition hover:opacity-95"
            >
              Browse templates
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-6 py-3 text-sm font-medium backdrop-blur transition hover:border-brand/50"
            >
              <LineChart className="h-4 w-4" />
              View admin demo
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-brand" /> No credit card
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-brand" /> MIT-friendly license
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-brand" /> Lifetime updates
            </div>
          </div>
        </div>

        {/* Mock preview */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="absolute inset-0 -m-6 rounded-3xl bg-brand-gradient opacity-25 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border bg-background/50 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
              <span className="ml-3 text-xs text-muted-foreground">novakit.app / dashboard</span>
            </div>
            <div className="grid grid-cols-12 gap-0">
              <div className="col-span-12 md:col-span-3 border-r border-border p-4">
                {['Overview', 'Products', 'Orders', 'Customers', 'Analytics', 'Settings'].map(
                  (i, idx) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                        idx === 0 ? 'bg-accent text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                      {i}
                    </div>
                  ),
                )}
              </div>
              <div className="col-span-12 md:col-span-9 space-y-4 p-6">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { l: 'Revenue', v: '$128.4k', d: '+12.4%' },
                    { l: 'Sales', v: '2,341', d: '+8.1%' },
                    { l: 'Active', v: '94.2%', d: '+2.3%' },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl border border-border bg-background/50 p-4">
                      <div className="text-xs text-muted-foreground">{s.l}</div>
                      <div className="mt-1 font-display text-2xl font-semibold">{s.v}</div>
                      <div className="text-xs text-emerald-500">{s.d}</div>
                    </div>
                  ))}
                </div>
                <div className="h-40 rounded-xl border border-border bg-background/50 p-4">
                  <div className="mb-2 text-xs text-muted-foreground">Revenue over time</div>
                  <svg viewBox="0 0 400 100" className="h-24 w-full">
                    <defs>
                      <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 80 L40 60 L80 70 L120 40 L160 55 L200 30 L240 45 L280 20 L320 35 L360 10 L400 25 L400 100 L0 100 Z"
                      fill="url(#g)"
                    />
                    <path
                      d="M0 80 L40 60 L80 70 L120 40 L160 55 L200 30 L240 45 L280 20 L320 35 L360 10 L400 25"
                      fill="none"
                      stroke="var(--brand)"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoStrip() {
  const items = ['ACME', 'LINEAR', 'VERCEL', 'STRIPE', 'NOTION', 'FIGMA'];
  return (
    <section className="border-y border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4 lg:px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Powering teams at
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {items.map((l) => (
            <span
              key={l}
              className="font-display text-lg font-semibold tracking-widest text-muted-foreground/70"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bento() {
  return (
    <section className="mx-auto max-w-7xl px-3 py-24 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">
          Everything you need
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          A complete platform, not a template dump.
        </h2>
        <p className="mt-4 text-muted-foreground">
          From marketing pages to admin panels, auth flows, and AI blocks — designed to work
          together, out of the box.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2">
        <BentoCard
          className="md:col-span-3 md:row-span-2"
          eyebrow="AI Blocks"
          title="Native AI components, ready to plug in."
          desc="Chat, streaming, prompt builders, embeddings and eval kits — all themed to match your product."
          icon={Bot}
        >
          <div className="mt-6 space-y-3">
            {[
              'How can I forecast Q3 revenue?',
              'Draft a launch email in our brand voice.',
              'Summarize the last 12 orders as insights.',
            ].map((m, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-border bg-background/60 p-3 text-sm"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-[10px] font-semibold text-white">
                  AI
                </div>
                <p className="text-foreground/90">{m}</p>
              </div>
            ))}
          </div>
        </BentoCard>

        <BentoCard
          className="md:col-span-3"
          eyebrow="Design system"
          title="Themeable to the pixel."
          desc="Dark & light, semantic tokens, refined typography — extend without touching component internals."
          icon={Palette}
        >
          <div className="mt-5 flex gap-2">
            {['bg-brand', 'bg-brand-glow', 'bg-brand-2', 'bg-foreground', 'bg-muted'].map(
              (c) => (
                <div key={c} className={`h-10 flex-1 rounded-lg ${c}`} />
              ),
            )}
          </div>
        </BentoCard>

        <BentoCard
          className="md:col-span-2"
          eyebrow="Secure"
          title="Auth done right."
          desc="Login, OTP, reset — accessible & battle-tested."
          icon={ShieldCheck}
        />

        <BentoCard
          className="md:col-span-1"
          eyebrow="Fast"
          title="Ships in hours."
          icon={Zap}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <BentoCard eyebrow="Composable" title="150+ components" icon={Blocks} />
        <BentoCard eyebrow="Typed" title="Fully typed API" icon={Code2} />
        <BentoCard eyebrow="Layered" title="Layered architecture" icon={Layers} />
      </div>
    </section>
  );
}

function BentoCard({
  className = '',
  eyebrow,
  title,
  desc,
  icon: Icon,
  children,
}: {
  className?: string;
  eyebrow: string;
  title: string;
  desc?: string;
  icon: React.ElementType;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition hover:border-brand/40 ${className}`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/10 blur-2xl transition group-hover:bg-brand/20" />
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background/60 text-brand">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {eyebrow}
        </span>
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">{title}</h3>
      {desc && <p className="mt-2 text-sm text-muted-foreground">{desc}</p>}
      {children}
    </div>
  );
}

function Showcase() {
  const { format } = useCurrency();
  const items = [
    { name: 'Aurora Admin', tag: 'Dashboard', price: 49 },
    { name: 'Zenith Landing', tag: 'Marketing', price: 29 },
    { name: 'Prism SaaS', tag: 'Full Stack', price: 89 },
  ];
  return (
    <section className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-3 py-24 sm:px-4 lg:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">
              Featured templates
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Handpicked for launch day.
            </h2>
          </div>
          <Link
            href="/templates"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Browse all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((p) => (
            <div
              key={p.name}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-brand-gradient">
                <div className="absolute inset-0 bg-grid opacity-20" />
                <div className="absolute bottom-3 left-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider backdrop-blur">
                  {p.tag}
                </div>
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-current text-yellow-500" /> 4.9 &bull; 218 reviews
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg font-semibold">{format(p.price)}</div>
                  <div className="text-xs text-muted-foreground">one-time</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const { format } = useCurrency();
  const tiers = [
    {
      name: 'Starter',
      price: 0,
      desc: 'For side projects and prototypes.',
      features: ['3 templates', 'Community support', 'Personal license'],
    },
    {
      name: 'Pro',
      price: 29,
      desc: 'For freelancers and small teams.',
      featured: true,
      features: ['All templates', 'AI blocks', 'Priority support', 'Commercial license'],
    },
    {
      name: 'Studio',
      price: 99,
      desc: 'For agencies and large teams.',
      features: ['Everything in Pro', 'White-label', 'Team seats', 'Design consulting'],
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-3 py-24 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">Pricing</p>
        <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Fair pricing. No surprises.
        </h2>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`relative rounded-3xl border p-8 transition ${
              t.featured
                ? 'border-brand/50 bg-card glow-brand'
                : 'border-border bg-card hover:border-brand/30'
            }`}
          >
            {t.featured && (
              <div className="absolute -top-3 left-8 rounded-full bg-brand-gradient px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                Most popular
              </div>
            )}
            <h3 className="font-display text-lg font-semibold">{t.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold">{format(t.price)}</span>
              <span className="text-sm text-muted-foreground">/mo</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand" /> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition ${
                t.featured
                  ? 'bg-brand-gradient text-white'
                  : 'border border-border hover:border-brand/40'
              }`}
            >
              Get {t.name}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-3 pb-24 sm:px-4 lg:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 sm:p-16">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="relative text-center">
          <Sparkles className="mx-auto h-8 w-8 text-brand" />
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Start shipping <span className="text-brand-gradient">tonight</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join 12,000+ builders using NovaKit to launch beautiful, production-ready
            products in record time.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-medium text-white shadow-xl shadow-brand/25"
            >
              Create account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-6 py-3 text-sm font-medium backdrop-blur"
            >
              Explore templates
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = useTestimonials();
  const { t } = useI18n();
  const published = items.filter((tt) => tt.published);
  const featured = published.filter((tt) => tt.featured);
  const list = (featured.length ? featured : published).slice(0, 6);
  if (list.length === 0) return null;
  return (
    <section className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-3 py-24 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">
            Testimonials
          </p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Loved by builders worldwide.
          </h2>
          <p className="mt-4 text-muted-foreground">
            From indie hackers to product teams — here's what people ship with NovaKit.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((tt) => (
            <figure
              key={tt.id}
              className="relative flex h-full flex-col rounded-3xl border border-border bg-card p-6 transition hover:border-brand/40"
            >
              <Quote className="h-6 w-6 text-brand/60" />
              <blockquote className="mt-3 flex-1 text-sm text-foreground/90">
                "{t(tt.quote)}"
              </blockquote>
              <div className="mt-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < tt.rating
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-muted-foreground/40'
                    }`}
                  />
                ))}
              </div>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-border/60 pt-4">
                {tt.avatarUrl ? (
                  <img
                    src={tt.avatarUrl}
                    alt={tt.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white">
                    {tt.name
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')}
                  </span>
                )}
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{tt.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {t(tt.role)}
                    {tt.company ? ` · ${t(tt.company)}` : ''}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = useFaqs();
  const { t } = useI18n();
  const published = items
    .filter((f) => f.published)
    .sort((a, b) => a.order - b.order);
  const [open, setOpen] = useState<string | null>(published[0]?.id ?? null);
  if (published.length === 0) return null;
  return (
    <section className="mx-auto max-w-4xl px-3 py-24 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">FAQ</p>
        <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Frequently asked questions.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Everything you need to know before shipping with NovaKit.
        </p>
      </div>
      <div className="mt-12 divide-y divide-border rounded-3xl border border-border bg-card">
        {published.map((f) => {
          const active = open === f.id;
          return (
            <div key={f.id}>
              <button
                type="button"
                onClick={() => setOpen(active ? null : f.id)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-accent/40"
              >
                <span className="flex-1">
                  <span className="block font-medium">{t(f.question)}</span>
                  {f.category && (
                    <span className="mt-1 inline-block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {t(f.category)}
                    </span>
                  )}
                </span>
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                  {active ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
              {active && (
                <div className="px-6 pb-6 text-sm text-muted-foreground">{t(f.answer)}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
