'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Star,
  Sparkles,
  ShieldCheck,
  Eye,
  Zap,
  Clock,
  Heart,
  Share2,
  Layers,
} from 'lucide-react';
import type { CatalogItem } from '@/src/lib/catalog';
import { useCurrency } from '@/src/lib/currency';

type ListTo = '/templates' | '/design' | '/services';
type DetailTo = '/templates/$slug' | '/design/$slug' | '/services/$slug';

export function CatalogDetail({
  item,
  related,
  listTo,
  detailTo,
  crumbLabel,
  ctaLabel,
  relatedEyebrow,
}: {
  item: CatalogItem;
  related: CatalogItem[];
  listTo: ListTo;
  detailTo: DetailTo;
  crumbLabel: string;
  ctaLabel: string;
  relatedEyebrow: string;
}) {
  const { format } = useCurrency();
  const [activeTheme, setActiveTheme] = useState(0);
  const [tab, setTab] = useState<'overview' | 'features' | 'delivery' | 'bestfor'>('overview');
  const Icon = item.icon;
  const theme = item.themes[activeTheme];

  return (
    <>
      <div className="border-b border-border/60">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-4 text-xs text-muted-foreground sm:px-4 lg:px-6">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href={listTo} className="hover:text-foreground">
            {crumbLabel}
          </Link>
          <span>/</span>
          <span className="text-foreground">{item.name}</span>
        </div>
      </div>

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-brand-glow/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-3 py-12 sm:px-4 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:px-6 lg:py-16">
          <div className="order-2 lg:order-1">
            <ThemedPreview item={item} theme={theme} />
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Theme · {theme.name}
                </p>
                <span className="text-xs text-muted-foreground">
                  {item.themes.length} included
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                {item.themes.map((t, i) => (
                  <button
                    key={t.name}
                    onClick={() => setActiveTheme(i)}
                    className={`group flex items-center gap-2 rounded-full border p-1 pr-3 text-xs transition ${
                      i === activeTheme
                        ? 'border-brand/60 bg-accent/50'
                        : 'border-border hover:border-brand/40'
                    }`}
                  >
                    <span className="flex -space-x-1.5">
                      {t.colors.map((c) => (
                        <span
                          key={c}
                          className="h-5 w-5 rounded-full border border-background"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </span>
                    <span className="text-foreground">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-border bg-accent/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider">
                {item.category}
              </span>
              {item.tag && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-gradient px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                  <Sparkles className="h-3 w-3" /> {item.tag}
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {item.name}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">{item.tagline}</p>

            <div className="mt-5 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">{item.rating}</span>
                <span className="text-muted-foreground">({item.reviews} reviews)</span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" /> Updated {item.lastUpdated}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-brand/40 bg-accent/40 p-5 ring-2 ring-brand/20">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold">{format(item.price)}</span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {item.priceUnit ?? 'One-time'}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Instant delivery · 14-day money-back guarantee
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:brightness-110">
                {ctaLabel} · {format(item.price)}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium hover:border-brand/40">
                <Eye className="h-4 w-4" /> Preview
              </button>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <button className="inline-flex items-center gap-1.5 hover:text-foreground">
                <Heart className="h-3.5 w-3.5" /> Save
              </button>
              <button className="inline-flex items-center gap-1.5 hover:text-foreground">
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
              <span className="ml-auto inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-brand" /> Secure checkout
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-14 sm:px-4 lg:px-6">
        <div className="flex flex-wrap gap-2 border-b border-border/60">
          {(
            [
              ['overview', 'Overview'],
              ['features', 'Highlights'],
              ['delivery', 'What you get'],
              ['bestfor', 'Best for'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative px-4 py-3 text-sm font-medium transition ${
                tab === id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
              {tab === id && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-gradient" />
              )}
            </button>
          ))}
        </div>

        <div className="grid gap-10 pt-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-8">
            {tab === 'overview' && (
              <div>
                <h2 className="font-display text-2xl font-semibold">About {item.name}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {item.longDescription}
                </p>
              </div>
            )}
            {tab === 'features' && (
              <div>
                <h2 className="font-display text-2xl font-semibold">Highlights</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {item.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-4"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tab === 'delivery' && (
              <div>
                <h2 className="font-display text-2xl font-semibold">What you get</h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {item.deliverables.map((d) => (
                    <div
                      key={d}
                      className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/60 px-3 py-2 text-sm"
                    >
                      <Layers className="h-3.5 w-3.5 text-brand" />
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab === 'bestfor' && (
              <div>
                <h2 className="font-display text-2xl font-semibold">Best for</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {item.bestFor.map((b) => (
                    <div key={b} className="rounded-2xl border border-border bg-card/60 p-4 text-sm">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/50">
                        <Zap className="h-4 w-4 text-brand" />
                      </div>
                      <p className="mt-3 font-medium">{b}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card/60 p-5">
              <p className="font-display text-sm font-semibold">Delivery</p>
              <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand" /> 14-day money-back guarantee
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand" /> Free updates
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 p-5">
              <p className="font-display text-sm font-semibold">Support</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Included with every purchase. Priority support available on higher tiers.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-border/60 bg-accent/20">
        <div className="mx-auto max-w-7xl px-3 py-14 sm:px-4 lg:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">
                {relatedEyebrow}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold">You may also like</h2>
            </div>
            <Link
              href={listTo}
              className="hidden items-center gap-1 text-sm text-muted-foreground hover:text-foreground sm:inline-flex"
            >
              Browse all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <RelatedCard key={r.id} p={r} detailTo={detailTo} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function CatalogNotFound({
  listTo,
  crumbLabel,
}: {
  listTo: ListTo;
  crumbLabel: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold">Not found</h1>
      <p className="mt-3 text-muted-foreground">
        The {crumbLabel.toLowerCase()} you're looking for doesn't exist or was removed.
      </p>
      <Link
        href={listTo}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-medium text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to {crumbLabel.toLowerCase()}
      </Link>
    </div>
  );
}

function ThemedPreview({
  item,
  theme,
}: {
  item: CatalogItem;
  theme: { name: string; colors: string[] };
}) {
  const Icon = item.icon;
  const [bg, primary, accent, fg] = theme.colors;
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card/60 shadow-2xl shadow-brand/5">
      <div className="flex items-center gap-2 border-b border-border/60 bg-background/60 px-4 py-3 backdrop-blur">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
        <div className="ml-3 flex-1 truncate rounded-md bg-muted px-3 py-1 text-[11px] text-muted-foreground">
          {item.slug}.novakit.app
        </div>
      </div>
      <div
        className="relative aspect-[16/10] overflow-hidden"
        style={{ backgroundColor: bg, color: fg }}
      >
        <div
          className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full blur-3xl"
          style={{ backgroundColor: primary, opacity: 0.5 }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: accent, opacity: 0.35 }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-3xl shadow-2xl backdrop-blur"
            style={{ backgroundColor: `${primary}CC` }}
          >
            <Icon className="h-11 w-11 text-white" strokeWidth={1.5} />
          </div>
        </div>
        <div className="absolute inset-x-6 bottom-6">
          <div className="h-2 w-32 rounded" style={{ backgroundColor: `${fg}55` }} />
          <div className="mt-2 h-3 w-52 rounded" style={{ backgroundColor: fg, opacity: 0.85 }} />
        </div>
      </div>
    </div>
  );
}

function RelatedCard({ p, detailTo }: { p: CatalogItem; detailTo: DetailTo }) {
  const Icon = p.icon;
  const { format } = useCurrency();
  return (
    <Link
      href={detailTo.replace('$slug', p.slug)}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card/60 transition-all hover:-translate-y-1 hover:border-brand/50 hover:shadow-2xl hover:shadow-brand/10"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-gradient">
        <div className="absolute inset-0 bg-grid opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background/15 ring-1 ring-white/25 backdrop-blur-md transition-transform group-hover:scale-110">
            <Icon className="h-7 w-7 text-white" strokeWidth={1.6} />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full border border-border/70 bg-accent/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {p.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> {p.rating}
          </div>
        </div>
        <div>
          <p className="font-display text-base font-semibold transition-colors group-hover:text-brand">
            {p.name}
          </p>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.desc}</p>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
          <span className="font-display text-base font-semibold">{format(p.price)}</span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-brand">
            View <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
