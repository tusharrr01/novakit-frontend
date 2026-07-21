'use client';

import React, { useMemo, useState } from 'react';
import {
  Plus,
  Trash2,
  Pencil,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { faqStore, type Faq } from '@/src/lib/site-content';

function newFaqId() {
  return `faq_${Date.now()}`;
}

export function FaqsTab() {
  const [items, setItems] = useState<Faq[]>(() => faqStore.list());
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [editItem, setEditItem] = useState<Faq | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [publishedFilter, setPublishedFilter] = useState<'All' | 'Published' | 'Draft'>('All');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((x) => {
      if (x.category) set.add(x.category);
    });
    return ['All', ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((x) => (category === 'All' ? true : x.category === category))
      .filter((x) => {
        if (publishedFilter === 'All') return true;
        if (publishedFilter === 'Published') return x.published;
        return !x.published;
      })
      .filter((x) => (q ? `${x.question} ${x.answer} ${x.category}`.toLowerCase().includes(q) : true));
  }, [items, query, category, publishedFilter]);

  function refresh() {
    setItems(faqStore.list());
  }

  function exportCsv() {
    const rows = [
      ['id', 'question', 'answer', 'category', 'order', 'published'],
      ...filtered.map((f) => [f.id, f.question, f.answer, f.category, String(f.order), String(f.published)]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faqs.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (view === 'add')
    return (
      <FaqForm
        onBack={() => {
          setView('list');
          refresh();
        }}
      />
    );
  if (view === 'edit' && editItem)
    return (
      <FaqForm
        item={editItem}
        onBack={() => {
          setView('list');
          setEditItem(null);
          refresh();
        }}
      />
    );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold">FAQs</h2>
            <p className="text-sm text-muted-foreground">
              {filtered.length} of {items.length} questions · drag and drop or edit display order values
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button
              onClick={() => setView('add')}
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

      <div className="flex-1 overflow-y-auto thin-scrollbar pt-6">
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
                          onClick={() => {
                            setEditItem(f);
                            setView('edit');
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:border-brand/40 hover:text-brand"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(f.id)}
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

      {deleteId && (
        <ConfirmDeleteModal
          title="Delete FAQ?"
          description="Are you sure you want to delete this FAQ? It will be permanently removed from the website FAQ section."
          onCancel={() => setDeleteId(null)}
          onConfirm={() => {
            faqStore.remove(deleteId);
            setDeleteId(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function FaqForm({ item, onBack }: { item?: Faq; onBack: () => void }) {
  const isEdit = !!item;
  const [question, setQuestion] = useState(item?.question ?? '');
  const [answer, setAnswer] = useState(item?.answer ?? '');
  const [category, setCategory] = useState(item?.category ?? 'General');
  const [order, setOrder] = useState<number>(item?.order ?? faqStore.list().length + 1);
  const [published, setPublished] = useState<boolean>(item?.published ?? true);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    faqStore.upsert({
      id: item?.id ?? newFaqId(),
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim() || 'General',
      order: Number(order) || 1,
      published,
    });
    onBack();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="font-display text-2xl font-semibold">{isEdit ? 'Edit FAQ' : 'Create new FAQ'}</h2>
            <p className="text-sm text-muted-foreground">
              These appear in the landing page FAQ section when published.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand/20"
          >
            {isEdit ? 'Save changes' : 'Create FAQ'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="admin-card p-6">
            <h3 className="font-display text-sm font-semibold">Content</h3>
            <div className="mt-4 space-y-4">
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Question</span>
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Can I use NovaKit for client projects?"
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Answer</span>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={6}
                  placeholder="Write a clear, concise answer…"
                  className="w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card p-6">
            <h3 className="font-display text-sm font-semibold">Organisation</h3>
            <div className="mt-4 space-y-4">
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Category</span>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Billing, Product, Licensing…"
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Display order</span>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  min={1}
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                />
              </label>
            </div>
          </div>

          <div className="admin-card p-6">
            <h3 className="font-display text-sm font-semibold">Status</h3>
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-md border border-border bg-background p-3">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="mt-0.5 h-4 w-4"
              />
              <span className="text-sm">
                <span className="block font-medium">Published</span>
                <span className="text-xs text-muted-foreground">Show this FAQ on the landing page.</span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}

function ConfirmDeleteModal({
  title,
  description,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
