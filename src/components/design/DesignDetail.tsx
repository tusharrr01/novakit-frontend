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
import { useCurrency } from '@/src/lib/currency';
import { getIconComponent } from '@/src/lib/icons';

export interface CatalogItemDetail {
  _id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  longDescription?: string;
  price: number;
  priceUnit?: string;
  rating: number;
  reviews: number;
  icon?: string;
  category: string;
  highlights: string[];
  author: string;
  deliverables?: string[];
  delivery_days?: number;
  revision_limit?: number;
  figma_link?: string;
  screen_count?: number;
  install_command?: string;
  themes?: { name: string; colors: string[] }[];
  bundles?: Record<string, string>;
  lastUpdated?: string;
}

export function DesignDetail({
  item,
  related = [],
  listTo,
  detailPrefix,
  crumbLabel,
  ctaLabel,
  relatedEyebrow,
}: {
  item: CatalogItemDetail;
  related: CatalogItemDetail[];
  listTo: string;
  detailPrefix: string;
  crumbLabel: string;
  ctaLabel: string;
  relatedEyebrow: string;
}) {
  const { formatPrice } = useCurrency();
  const [activeThemeIndex, setActiveThemeIndex] = useState(0);
  const [tab, setTab] = useState<'overview' | 'features' | 'delivery'>('overview');

  const Icon = getIconComponent(item.icon);

  // Fallback themes if not present in item
  const themes = item.themes && item.themes.length > 0 ? item.themes : [
    { name: 'Aurora Dark', colors: ['#0B0B14', '#6D28D9', '#A78BFA', '#E9D5FF'] },
    { name: 'Nordic Light', colors: ['#F8FAFC', '#0F172A', '#3B82F6', '#22D3EE'] },
  ];
  const activeTheme = themes[activeThemeIndex];

  return (
    <>
      <div className="border-b border-neutral-200/60 dark:border-neutral-800/60">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-4 text-xs text-neutral-500 sm:px-4 lg:px-6">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition">
            Home
          </Link>
          <span>/</span>
          <Link href={listTo} className="hover:text-neutral-900 dark:hover:text-white transition">
            {crumbLabel}
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-neutral-200 font-medium">{item.name}</span>
        </div>
      </div>

      <section className="relative overflow-hidden border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/40 dark:bg-neutral-950/20">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-indigo-650/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-3 py-12 sm:px-4 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:px-6 lg:py-16">
          {/* Left Column: Visual Mockup */}
          <div className="order-2 lg:order-1">
            <ThemedPreview item={item} theme={activeTheme} />
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase font-semibold tracking-wider text-neutral-500">
                  Palettes · {activeTheme.name}
                </p>
                <span className="text-xs text-neutral-400">
                  {themes.length} custom schemes included
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                {themes.map((t, i) => (
                  <button
                    key={t.name}
                    onClick={() => setActiveThemeIndex(i)}
                    className={`group flex items-center gap-2 rounded-full border p-1 pr-3 text-xs transition ${
                      i === activeThemeIndex
                        ? 'border-indigo-600 dark:border-indigo-500 bg-neutral-100 dark:bg-neutral-800'
                        : 'border-neutral-250 dark:border-neutral-800 hover:border-indigo-500/50'
                    }`}
                  >
                    <span className="flex -space-x-1.5">
                      {t.colors.slice(0, 3).map((c) => (
                        <span
                          key={c}
                          className="h-5 w-5 rounded-full border border-white dark:border-neutral-900"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </span>
                    <span className="text-neutral-800 dark:text-neutral-200 font-medium">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Descriptions & Details */}
          <div className="order-1 lg:order-2 flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                {item.category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                <Sparkles className="h-3 w-3" /> Featured Asset
              </span>
            </div>

            <h1 className="mt-4 font-sans text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
              {item.name}
            </h1>
            {item.tagline && <p className="mt-3 text-lg text-neutral-500 leading-normal">{item.tagline}</p>}

            <div className="mt-5 flex items-center gap-4 text-xs text-neutral-500">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{item.rating}</span>
                <span>({item.reviews} reviews)</span>
              </div>
              <span className="text-neutral-300 dark:text-neutral-800">•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-neutral-400" /> Updated {item.lastUpdated || 'Jul 2026'}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-600/5 p-5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-neutral-900 dark:text-white leading-none">{formatPrice(item.price)}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                  {item.priceUnit ?? 'One-time'}
                </span>
              </div>
              <p className="mt-2 text-xs text-neutral-400">
                Instant secure delivery · 14-day replacement window
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition">
                {ctaLabel} · {formatPrice(item.price)}
                <ArrowRight className="h-4 w-4" />
              </button>
              {item.bundles && Object.keys(item.bundles).length > 0 && (
                <Link
                  href={`${detailPrefix}/${item.slug}/preview`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-250 dark:border-neutral-850 bg-white dark:bg-neutral-950 px-5 py-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:border-indigo-500 transition"
                >
                  <Eye className="h-4 w-4" /> Run Preview
                </Link>
              )}
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-neutral-500">
              <button className="inline-flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition">
                <Heart className="h-3.5 w-3.5" /> Save
              </button>
              <button className="inline-flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition">
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
              <span className="ml-auto inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" /> Secure checkout
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs & Details section */}
      <section className="mx-auto max-w-7xl px-3 py-14 sm:px-4 lg:px-6">
        <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800">
          {(
            [
              ['overview', 'Overview'],
              ['features', 'Highlights'],
              ['delivery', 'Package details'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative px-4 py-3 text-sm font-semibold transition ${
                tab === id ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
              }`}
            >
              {label}
              {tab === id && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </button>
          ))}
        </div>

        <div className="grid gap-10 pt-10 lg:grid-cols-[1.4fr_1fr]">
          {/* Main content */}
          <div className="space-y-8 text-neutral-600 dark:text-neutral-350">
            {tab === 'overview' && (
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">About {item.name}</h2>
                <p className="mt-4 leading-relaxed text-sm">
                  {item.longDescription || item.description}
                </p>
                {item.install_command && (
                  <div className="mt-8">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400">Installation command</h4>
                    <div className="mt-2 flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-3 font-mono text-xs text-neutral-800 dark:text-neutral-300">
                      <code>{item.install_command}</code>
                      <button
                        onClick={() => navigator.clipboard.writeText(item.install_command || '')}
                        className="text-[10px] px-2 py-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded font-semibold hover:border-indigo-500"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {tab === 'features' && (
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Highlights</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {item.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 p-4"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tab === 'delivery' && (
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">What you get</h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {(item.deliverables || ['Source code bundle', 'Setup documentation', 'Lifetime free updates']).map((d) => (
                    <div
                      key={d}
                      className="flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300"
                    >
                      <Layers className="h-3.5 w-3.5 text-indigo-600" />
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 p-5 text-neutral-700 dark:text-neutral-300">
              <p className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">Author details</p>
              <p className="mt-2 text-sm text-neutral-500">
                Created and verified by <span className="font-medium text-neutral-900 dark:text-white">{item.author}</span>. Meets highest coding and design standard parameters.
              </p>
            </div>
            {item.delivery_days && (
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 p-5 text-neutral-700 dark:text-neutral-300">
                <p className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">Delivery Parameters</p>
                <ul className="mt-3 space-y-2 text-sm text-neutral-500">
                  <li>Estimated completion: <span className="font-medium text-neutral-900 dark:text-white">{item.delivery_days} business days</span></li>
                  <li>Included revisions: <span className="font-medium text-neutral-900 dark:text-white">{item.revision_limit || 3} revisions</span></li>
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* Related Products list */}
      {related.length > 0 && (
        <section className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/20 dark:bg-neutral-950/10">
          <div className="mx-auto max-w-7xl px-3 py-14 sm:px-4 lg:px-6">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {relatedEyebrow}
                </p>
                <h2 className="mt-2 font-sans text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">You may also like</h2>
              </div>
              <Link
                href={listTo}
                className="hidden items-center gap-1 text-sm font-semibold text-neutral-500 hover:text-indigo-600 transition sm:inline-flex"
              >
                Browse all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <RelatedCard key={r._id} p={r} detailPrefix={detailPrefix} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export function DesignNotFound({
  listTo,
  crumbLabel,
}: {
  listTo: string;
  crumbLabel: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">404</p>
      <h1 className="mt-3 font-sans text-4xl font-bold text-neutral-900 dark:text-white">Asset not found</h1>
      <p className="mt-3 text-neutral-500">
        The {crumbLabel.toLowerCase()} you're looking for doesn't exist or was removed.
      </p>
      <Link
        href={listTo}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition"
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
  item: CatalogItemDetail;
  theme: { name: string; colors: string[] };
}) {
  const Icon = getIconComponent(item.icon);
  const colors = theme?.colors || ['#0B0B14', '#6D28D9', '#A78BFA', '#E9D5FF'];
  const [bg, primary, accent, fg] = colors;

  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 shadow-2xl shadow-indigo-600/5">
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 backdrop-blur">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <div className="ml-3 flex-1 truncate rounded-md bg-neutral-100 dark:bg-neutral-900 px-3 py-1 text-[11px] text-neutral-500">
          {item.slug}.novakit.app
        </div>
      </div>
      <div
        className="relative aspect-[16/10] overflow-hidden"
        style={{ backgroundColor: bg, color: fg || '#FFF' }}
      >
        <div
          className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full blur-3xl"
          style={{ backgroundColor: primary || '#6D28D9', opacity: 0.5 }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: accent || '#A78BFA', opacity: 0.35 }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-3xl shadow-2xl backdrop-blur"
            style={{ backgroundColor: `${primary || '#6D28D9'}CC` }}
          >
            <Icon className="h-11 w-11 text-white" strokeWidth={1.5} />
          </div>
        </div>
        <div className="absolute inset-x-6 bottom-6">
          <div className="h-2 w-32 rounded" style={{ backgroundColor: `${fg || '#FFF'}55` }} />
          <div className="mt-2 h-3 w-52 rounded" style={{ backgroundColor: fg || '#FFF', opacity: 0.85 }} />
        </div>
      </div>
    </div>
  );
}

function RelatedCard({ p, detailPrefix }: { p: CatalogItemDetail; detailPrefix: string }) {
  const Icon = getIconComponent(p.icon);
  const { formatPrice } = useCurrency();

  return (
    <Link
      href={`${detailPrefix}/${p.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-600/5"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-indigo-600">
        <div className="absolute inset-0 bg-grid opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/25 backdrop-blur-md transition-transform group-hover:scale-110">
            <Icon className="h-7 w-7 text-white" strokeWidth={1.6} />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
            {p.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> {p.rating}
          </div>
        </div>
        <div>
          <p className="text-base font-semibold text-neutral-900 dark:text-white transition-colors group-hover:text-indigo-600">
            {p.name}
          </p>
          <p className="mt-1 line-clamp-2 text-xs text-neutral-550 dark:text-neutral-400">{p.description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-3">
          <span className="font-semibold text-neutral-900 dark:text-white">{formatPrice(p.price)}</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 group-hover:text-indigo-650">
            View <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
export default DesignDetail;

