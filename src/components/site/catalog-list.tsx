'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Search, Filter, Star, Sparkles, ArrowRight } from 'lucide-react';
import type { CatalogItem } from '@/src/lib/catalog';
import { useCurrency } from '@/src/lib/currency';

type DetailTo = '/templates/$slug' | '/design/$slug' | '/services/$slug';

export function CatalogList({
  items,
  eyebrow,
  title,
  subtitle,
  categories,
  searchPlaceholder,
  detailTo,
  priceSuffix = 'One-time · Lifetime',
}: {
  items: CatalogItem[];
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  categories: string[];
  searchPlaceholder: string;
  detailTo: DetailTo;
  priceSuffix?: string;
}) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const cats = ['All', ...categories];

  const filtered = useMemo(
    () =>
      items.filter(
        (p) =>
          (cat === 'All' || p.category === cat) &&
          (p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.desc.toLowerCase().includes(q.toLowerCase())),
      ),
    [items, q, cat],
  );

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-brand/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-3 py-16 sm:px-4 lg:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">{eyebrow}</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">{subtitle}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 text-sm">
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
                    ? 'border-transparent bg-brand-gradient text-white shadow-lg shadow-brand/20'
                    : 'border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-16 sm:px-4 lg:px-6">
        <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing <span className="text-foreground">{filtered.length}</span> of {items.length}
          </p>
          <p>Sort · Trending</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <CatalogCard key={p.id} p={p} detailTo={detailTo} priceSuffix={priceSuffix} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mx-auto mt-12 max-w-md rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="font-display text-lg">No results found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search or category.</p>
          </div>
        )}
      </section>
    </>
  );
}

function CatalogCard({
  p,
  detailTo,
  priceSuffix,
}: {
  p: CatalogItem;
  detailTo: DetailTo;
  priceSuffix: string;
}) {
  const { format } = useCurrency();
  const Icon = p.icon;
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-2xl hover:shadow-brand/10">
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient opacity-90" />
        <div className="absolute inset-0 bg-grid opacity-[0.18] mix-blend-overlay" />
        <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-white/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-black/20 blur-3xl" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-background/15 ring-1 ring-white/25 backdrop-blur-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="h-9 w-9 text-white drop-shadow" strokeWidth={1.6} />
          </div>
        </div>
        {p.tag && (
          <div className="absolute left-4 bottom-4 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground shadow-sm backdrop-blur">
            <Sparkles className="h-3 w-3 text-brand" /> {p.tag}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full border border-border/70 bg-accent/40 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {p.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
            <span className="font-medium text-foreground">{p.rating}</span>
            <span>({p.reviews})</span>
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-brand">
            {p.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.desc}</p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4">
          <div>
            <div className="font-display text-xl font-semibold leading-none">{format(p.price)}</div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              {p.priceUnit ?? priceSuffix}
            </div>
          </div>
          <Link
            href={detailTo.replace('$slug', p.slug)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium transition-all group-hover:border-transparent group-hover:bg-brand-gradient group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand/20"
          >
            View <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
