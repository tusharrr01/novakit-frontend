'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Search, Filter, Star, Sparkles, ArrowRight } from 'lucide-react';
import { useCurrency } from '@/src/lib/currency';
import { getIconComponent } from '@/src/lib/icons';

export interface CatalogItem {
  _id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  priceUnit?: string;
  rating: number;
  reviews: number;
  tag?: string;
  icon?: string;
  description: string;
}

export function DesignList({
  items,
  eyebrow,
  title,
  subtitle,
  categories,
  searchPlaceholder,
  detailPrefix,
  priceSuffix = 'One-time · Lifetime',
}: {
  items: CatalogItem[];
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  categories: string[];
  searchPlaceholder: string;
  detailPrefix: string; // e.g. '/templates' or '/designs'
  priceSuffix?: string;
}) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const cats = ['All', ...categories];

  const filtered = useMemo(() => {
    return items.filter(
      (p) =>
        (cat === 'All' || p.category === cat) &&
        (p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.description.toLowerCase().includes(q.toLowerCase()))
    );
  }, [items, q, cat]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/20 dark:bg-neutral-900/10">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-3 py-16 sm:px-4 lg:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">{eyebrow}</p>
          <h1 className="mt-3 max-w-2xl font-sans text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-neutral-555 dark:text-neutral-450">{subtitle}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-12 w-full rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-11 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:text-neutral-100"
              />
            </div>
            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 text-sm text-neutral-700 dark:text-neutral-300">
              <Filter className="h-4 w-4" /> Filters
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  cat === c
                    ? 'border-transparent bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-500 hover:border-indigo-500/40 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-16 sm:px-4 lg:px-6">
        <div className="mb-6 flex items-center justify-between text-sm text-neutral-500">
          <p>
            Showing <span className="text-neutral-900 dark:text-white font-medium">{filtered.length}</span> of {items.length}
          </p>
          <p>Sort · Trending</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <CatalogCard key={p._id} p={p} detailPrefix={detailPrefix} priceSuffix={priceSuffix} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mx-auto mt-12 max-w-md rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 p-10 text-center">
            <p className="text-lg font-medium text-neutral-900 dark:text-white">No results found</p>
            <p className="mt-1 text-sm text-neutral-400">Try a different search or category.</p>
          </div>
        )}
      </section>
    </>
  );
}

function CatalogCard({
  p,
  detailPrefix,
  priceSuffix,
}: {
  p: CatalogItem;
  detailPrefix: string;
  priceSuffix: string;
}) {
  const { formatPrice } = useCurrency();
  const Icon = getIconComponent(p.icon);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-600/5">
      <div className="relative aspect-[16/10] overflow-hidden bg-indigo-600">
        <div className="absolute inset-0 bg-grid opacity-10 mix-blend-overlay" />
        <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-black/20 blur-3xl" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex h-18 w-18 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="h-8 w-8 text-white drop-shadow" strokeWidth={1.6} />
          </div>
        </div>
        {p.tag && (
          <div className="absolute left-4 bottom-4 inline-flex items-center gap-1 rounded-full bg-white/90 dark:bg-neutral-950/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-50 shadow-sm backdrop-blur">
            <Sparkles className="h-3 w-3 text-indigo-600" /> {p.tag}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
            {p.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
            <span className="font-medium text-neutral-900 dark:text-neutral-50">{p.rating}</span>
            <span>({p.reviews})</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 transition-colors group-hover:text-indigo-600 dark:hover:text-indigo-400">
            {p.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{p.description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-neutral-100 dark:border-neutral-850 pt-4">
          <div>
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-50 leading-none">{formatPrice(p.price)}</div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-neutral-400">
              {p.priceUnit ?? priceSuffix}
            </div>
          </div>
          <Link
            href={`${detailPrefix}/${p.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-250 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-all group-hover:border-transparent group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-600/20"
          >
            View <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
export default DesignList;

