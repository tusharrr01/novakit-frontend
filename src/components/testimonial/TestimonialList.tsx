'use client';

import React from 'react';
import { Search, Filter, Star, Download, Plus, Pencil, Trash2 } from 'lucide-react';
import type { Testimonial } from '@/src/lib/site-content';

export function TestimonialList({
  filtered,
  totalCount,
  query,
  setQuery,
  status,
  setStatus,
  rating,
  setRating,
  onAdd,
  onEdit,
  onDelete,
  onExport,
}: {
  filtered: Testimonial[];
  totalCount: number;
  query: string;
  setQuery: (v: string) => void;
  status: 'All' | 'Published' | 'Draft' | 'Featured';
  setStatus: (v: 'All' | 'Published' | 'Draft' | 'Featured') => void;
  rating: 'All' | '5' | '4' | '3' | '2' | '1';
  setRating: (v: 'All' | '5' | '4' | '3' | '2' | '1') => void;
  onAdd: () => void;
  onEdit: (item: Testimonial) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold">Testimonials</h2>
            <p className="text-sm text-muted-foreground">
              {filtered.length} of {totalCount} testimonials · featured items appear on the landing page
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onExport}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button
              onClick={onAdd}
              className="inline-flex items-center gap-2 rounded-md bg-brand-gradient px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand/20"
            >
              <Plus className="h-4 w-4" /> Add testimonial
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-2 admin-card-static p-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, company or quote…"
              className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-4 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="bg-transparent text-xs outline-none font-medium"
              >
                <option value="All">All statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Featured">Featured</option>
              </select>
            </div>
            <div className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1">
              <Star className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value as typeof rating)}
                className="bg-transparent text-xs outline-none font-medium"
              >
                <option value="All">All ratings</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pt-6">
        <div className="overflow-hidden admin-card-static">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-accent/30">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Quote</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-accent/20">
                    <td className="p-3">
                      <div>
                        <div className="font-semibold text-foreground">{t.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {t.role} · {t.company}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? 'fill-current' : 'opacity-25'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="p-3 max-w-sm">
                      <div className="text-xs text-muted-foreground line-clamp-2 italic">“{t.quote}”</div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {t.published ? (
                          <span className="inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-500 font-medium">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground font-medium">
                            Draft
                          </span>
                        )}
                        {t.featured && (
                          <span className="inline-flex items-center rounded-md border border-brand/20 bg-brand/10 px-2 py-0.5 text-xs text-brand font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(t)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:border-brand/40 hover:text-brand"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(t.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-sm text-muted-foreground">
                      No testimonials found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
