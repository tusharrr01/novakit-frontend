'use client';

import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { faqStore, type Faq } from '@/src/lib/site-content';
import { newFaqId } from '@/src/utils/faq';

export function FaqForm({
  item,
  onBack,
}: {
  item?: Faq | null;
  onBack: () => void;
}) {
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
              {isEdit ? 'Edit FAQ' : 'Create new FAQ'}
            </h2>
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
