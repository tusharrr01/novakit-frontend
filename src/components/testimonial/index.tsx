'use client';

import React, { useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { testimonialStore, type Testimonial } from '@/src/lib/site-content';
import { exportTestimonialsCsv } from '@/src/utils/testimonial';
import { TestimonialForm } from './TestimonialForm';
import { TestimonialList } from './TestimonialList';

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

  function handleExport() {
    exportTestimonialsCsv(filtered);
  }

  if (view === 'add') {
    return (
      <TestimonialForm
        onBack={() => {
          setView('list');
          refresh();
        }}
      />
    );
  }

  if (view === 'edit' && editItem) {
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
  }

  return (
    <>
      <TestimonialList
        filtered={filtered}
        totalCount={items.length}
        query={query}
        setQuery={setQuery}
        status={status}
        setStatus={setStatus}
        rating={rating}
        setRating={setRating}
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
