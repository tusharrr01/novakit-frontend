'use client';

import React, { useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { faqStore, type Faq } from '@/src/lib/site-content';
import { exportFaqsCsv } from '@/src/utils/faq';
import { FaqForm } from './FaqForm';
import { FaqList } from './FaqList';

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

  function handleExport() {
    exportFaqsCsv(filtered);
  }

  if (view === 'add') {
    return (
      <FaqForm
        onBack={() => {
          setView('list');
          refresh();
        }}
      />
    );
  }

  if (view === 'edit' && editItem) {
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
  }

  return (
    <>
      <FaqList
        filtered={filtered}
        totalCount={items.length}
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        categories={categories}
        publishedFilter={publishedFilter}
        setPublishedFilter={setPublishedFilter}
        onAdd={() => setView('add')}
        onEdit={(item) => {
          setEditItem(item);
          setView('edit');
        }}
        onDelete={(id) => setDeleteId(id)}
        onExport={handleExport}
      />

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
    </>
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
