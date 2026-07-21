'use client';

import React from 'react';
import { Search, Filter, Download, Plus, Pencil, Trash2 } from 'lucide-react';
import type { Faq } from '@/src/lib/site-content';

export function FaqList({
  filtered,
  totalCount,
  query,
  setQuery,
  category,
  setCategory,
  categories,
  publishedFilter,
  setPublishedFilter,
  onAdd,
  onEdit,
  onDelete,
  onExport,
}: {
  filtered: Faq[];
  totalCount: number;
  query: string;
  setQuery: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  categories: string[];
  publishedFilter: 'All' | 'Published' | 'Draft';
  setPublishedFilter: (v: 'All' | 'Published' | 'Draft') => void;
  onAdd: () => void;
  onEdit: (item: Faq) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold">FAQs</h2>
            <p className="text-sm text-muted-foreground">
              {filtered.length} of {totalCount} questions · drag and drop or edit display order values
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
              <Plus className="h-4 w-4" /> Add FAQ
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
              placeholder="Search question, answer or category…"
              className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-4 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent text-xs outline-none font-medium"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1">
            <select
              value={publishedFilter}
              onChange={(e) => setPublishedFilter(e.target.value as typeof publishedFilter)}
              className="bg-transparent text-xs outline-none font-medium"
            >
              <option value="All">All statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pt-6">
        <div className="overflow-hidden admin-card-static">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-accent/30">
                <tr>
                  <th className="p-3">Order</th>
                  <th className="p-3">Question</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f.id} className="border-b border-border last:border-0 hover:bg-accent/20">
                    <td className="p-3 font-mono text-xs text-muted-foreground">#{f.order}</td>
                    <td className="p-3 max-w-lg">
                      <div className="font-semibold text-foreground">{f.question}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{f.answer}</div>
                    </td>
                    <td className="p-3 text-sm font-medium text-brand">{f.category}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${
                        f.published ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground'
                      }`}>
                        {f.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(f)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:border-brand/40 hover:text-brand"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(f.id)}
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
                      No FAQs found.
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
