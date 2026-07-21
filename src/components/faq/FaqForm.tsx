'use client';

import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { faqStore, type Faq } from '@/src/lib/site-content';
import { newFaqId } from '@/src/utils/faq';
import { TextInput } from '@/src/components/shared/form-fields/TextInput';
import { TextAreaField } from '@/src/components/shared/form-fields/TextAreaField';

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
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
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
            className="rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-opacity hover:opacity-90"
          >
            {isEdit ? 'Save changes' : 'Create FAQ'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="admin-card p-6">
            <h3 className="font-display text-sm font-semibold mb-4">Content</h3>
            <div className="space-y-4">
              <TextInput
                label="Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Can I use NovaKit for client projects?"
              />
              <TextAreaField
                label="Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                placeholder="Write a clear, concise answer…"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card p-6">
            <h3 className="font-display text-sm font-semibold mb-4">Organisation</h3>
            <div className="space-y-4">
              <TextInput
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Billing, Product, Licensing…"
              />
              <TextInput
                label="Display order"
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                min={1}
              />
            </div>
          </div>

          <div className="admin-card p-6">
            <h3 className="font-display text-sm font-semibold mb-4">Status</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Published</p>
                <p className="text-xs text-muted-foreground mt-0.5">Show this FAQ on the landing page</p>
              </div>
              <button
                type="button"
                onClick={() => setPublished(!published)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none cursor-pointer ${
                  published ? 'bg-indigo-600' : 'bg-neutral-300 dark:bg-neutral-600'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    published ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
