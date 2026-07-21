'use client';

import React, { useMemo, useState } from 'react';
import {
  Plus,
  Trash2,
  Pencil,
  Search,
  Filter,
  ChevronLeft,
  Download,
  Star,
  Upload,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { testimonialStore, type Testimonial } from '@/src/lib/site-content';

function newTestimonialId() {
  return `test_${Date.now()}`;
}

export function TestimonialsTab() {
  const [items, setItems] = useState<Testimonial[]>(() => testimonialStore.list());
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'All' | 'Published' | 'Draft' | 'Featured'>('All');
  const [rating, setRating] = useState<'All' | '5' | '4' | '3' | '2' | '1'>('All');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((t) => {
        if (status === 'All') return true;
        if (status === 'Published') return t.published;
        if (status === 'Draft') return !t.published;
        return t.featured;
      })
      .filter((t) => (rating === 'All' ? true : String(t.rating) === rating))
      .filter((t) => (q ? `${t.name} ${t.role} ${t.company} ${t.quote}`.toLowerCase().includes(q) : true));
  }, [items, query, status, rating]);

  function refresh() {
    setItems(testimonialStore.list());
  }

  function exportCsv() {
    const rows = [
      ['id', 'name', 'role', 'company', 'quote', 'rating', 'featured', 'published'],
      ...filtered.map((t) => [
        t.id,
        t.name,
        t.role,
        t.company,
        t.quote,
        String(t.rating),
        String(t.featured),
        String(t.published),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'testimonials.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (view === 'add')
    return (
      <TestimonialForm
        onBack={() => {
          setView('list');
          refresh();
        }}
      />
    );
  if (view === 'edit' && editItem)
    return (
      <TestimonialForm
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
            <h2 className="font-display text-2xl font-semibold">Testimonials</h2>
            <p className="text-sm text-muted-foreground">
              {filtered.length} of {items.length} testimonials · featured items appear on the landing page
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
                          onClick={() => {
                            setEditItem(t);
                            setView('edit');
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:border-brand/40 hover:text-brand"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(t.id)}
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

      {deleteId && (
        <ConfirmDeleteModal
          title="Delete testimonial?"
          description="Are you sure you want to delete this customer testimonial? It will be permanently removed from the website dashboard listings."
          onCancel={() => setDeleteId(null)}
          onConfirm={() => {
            testimonialStore.remove(deleteId);
            setDeleteId(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function TestimonialForm({ item, onBack }: { item?: Testimonial; onBack: () => void }) {
  const isEdit = !!item;
  const [name, setName] = useState(item?.name ?? '');
  const [role, setRole] = useState(item?.role ?? '');
  const [company, setCompany] = useState(item?.company ?? '');
  const [quote, setQuote] = useState(item?.quote ?? '');
  const [rating, setRating] = useState<number>(item?.rating ?? 5);
  const [published, setPublished] = useState<boolean>(item?.published ?? true);
  const [featured, setFeatured] = useState<boolean>(item?.featured ?? false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;
    testimonialStore.upsert({
      id: item?.id ?? newTestimonialId(),
      name: name.trim(),
      role: role.trim(),
      company: company.trim(),
      quote: quote.trim(),
      rating,
      published,
      featured,
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
            <h2 className="font-display text-2xl font-semibold">
              {isEdit ? 'Edit testimonial' : 'Create testimonial'}
            </h2>
            <p className="text-sm text-muted-foreground">
              These appear in the landing page carousel when published.
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
            {isEdit ? 'Save changes' : 'Create testimonial'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="admin-card p-6">
            <h3 className="font-display text-sm font-semibold">Content</h3>
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Author name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                  />
                </label>
                <div className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Rating star scale</span>
                  <div className="flex h-10 items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i + 1)}
                        className={`text-amber-500 hover:scale-110 transition ${
                          i < rating ? 'opacity-100' : 'opacity-25'
                        }`}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Job Title</span>
                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Lead Designer"
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Company name</span>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                  />
                </label>
              </div>

              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Testimonial Quote</span>
                <textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  rows={4}
                  placeholder="Acme Corp shipped their landing page in 2 days using NovaKit. An absolute game changer…"
                  className="w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card p-6">
            <h3 className="font-display text-sm font-semibold">Live Preview</h3>
            <div className="mt-4 rounded-xl border border-border bg-background p-5 text-left shadow-lg">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-current' : 'opacity-25'}`} />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground italic">
                “{quote || 'Acme Corp shipped their landing page in 2 days using NovaKit…'}”
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
                  {name ? name[0] : 'U'}
                </span>
                <div>
                  <div className="text-xs font-semibold">{name || 'Sarah Jenkins'}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {role || 'Lead Designer'}, {company || 'Acme Corp'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card p-6">
            <h3 className="font-display text-sm font-semibold">Visibility</h3>
            <div className="mt-4 space-y-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-background p-3 hover:border-brand/40">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="mt-0.5 h-4 w-4"
                />
                <span className="text-sm">
                  <span className="block font-medium">Published</span>
                  <span className="text-xs text-muted-foreground">Show this testimonial on the landing page.</span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-background p-3 hover:border-brand/40">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="mt-0.5 h-4 w-4"
                />
                <span className="text-sm">
                  <span className="block font-medium">Featured</span>
                  <span className="text-xs text-muted-foreground">Pin to top of the dashboard slider listings.</span>
                </span>
              </label>
            </div>
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
