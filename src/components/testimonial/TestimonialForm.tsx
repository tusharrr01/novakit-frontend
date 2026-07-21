'use client';

import React, { useState } from 'react';
import { ChevronLeft, Star } from 'lucide-react';
import { testimonialStore, type Testimonial } from '@/src/lib/site-content';
import { newTestimonialId } from '@/src/utils/testimonial';

export function TestimonialForm({
  item,
  onBack,
}: {
  item?: Testimonial | null;
  onBack: () => void;
}) {
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
    <form onSubmit={submit} className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 mb-6 flex flex-wrap items-center justify-between gap-3">
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
