'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search as SearchIcon,
  BarChart3,
  Check,
  Pencil,
  Trash2,
} from 'lucide-react';
import { currencyStore, useCurrencyState, type Currency } from '@/src/lib/currency';

const EMPTY_CURRENCY: Currency = {
  code: '',
  name: '',
  symbol: '',
  rate: 1,
  position: 'prefix',
  decimals: 2,
};

export function CurrencyOptionsTab() {
  const state = useCurrencyState();
  const [draft, setDraft] = useState<Currency>(EMPTY_CURRENCY);
  const [editing, setEditing] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  function edit(c: Currency) {
    setEditing(c.code);
    setDraft(c);
    setError(null);
    setShowForm(true);
  }

  function resetForm() {
    setDraft(EMPTY_CURRENCY);
    setEditing(null);
    setError(null);
    setShowForm(false);
  }

  function save() {
    const code = draft.code.trim().toUpperCase();
    const name = draft.name.trim();
    const symbol = draft.symbol.trim();
    if (!code || !name || !symbol) {
      setError('Code, name and symbol are required.');
      return;
    }
    if (!Number.isFinite(draft.rate) || draft.rate <= 0) {
      setError('Rate must be a positive number.');
      return;
    }
    currencyStore.upsert({ ...draft, code, name, symbol });
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 1800);
    resetForm();
  }

  const filtered = state.currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(query.toLowerCase()) ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.symbol.includes(query)
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-brand">Currency Options</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage currencies visitors can switch between. Rates are expressed vs. base
              {state.currencies.find((c) => c.code === state.base) && (
                <span className="font-medium text-foreground"> ({state.base})</span>
              )}
              .
            </p>
          </div>
          <button
            onClick={() => {
              setDraft(EMPTY_CURRENCY);
              setEditing(null);
              setError(null);
              setShowForm(true);
            }}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-brand-gradient px-4 text-sm font-medium text-white shadow-lg shadow-brand/20 transition hover:opacity-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add New
          </button>
        </div>

        {savedAt && (
          <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-200">
            Currency saved.
          </div>
        )}
        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="admin-card-static p-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search currencies..."
                className="h-11 w-full rounded-md border border-transparent bg-accent/40 pl-10 pr-3 text-sm outline-none focus:border-brand/40"
              />
            </div>
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:border-brand/40"
              aria-label="Filter"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto thin-scrollbar pt-5">
        {/* Table */}
        <div className="overflow-hidden admin-card-static">
          <div className="grid grid-cols-[40px_70px_1fr_90px_100px_120px_120px_160px] items-center gap-3 border-b border-border/60 bg-accent/30 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span></span>
            <span>Symbol</span>
            <span>Name</span>
            <span>Code</span>
            <span>Rate</span>
            <span>Format</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          {filtered.length === 0 && (
            <div className="px-6 py-16 text-center text-sm text-muted-foreground">
              No currencies match your search.
            </div>
          )}
          <ul>
            {filtered.map((c) => {
              const isActive = c.code === state.active;
              const isBase = c.code === state.base;
              return (
                <li
                  key={c.code}
                  className="grid grid-cols-[40px_70px_1fr_90px_100px_120px_120px_160px] items-center gap-3 border-b border-border/60 px-4 py-4 last:border-0 hover:bg-accent/20"
                >
                  <input type="checkbox" className="h-4 w-4 rounded border-border" />
                  <span className="inline-flex h-9 w-12 items-center justify-center rounded-lg border border-border bg-background text-base font-semibold">
                    {c.symbol}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{c.name}</span>
                    {isBase && (
                      <span className="rounded-md border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand">
                        base
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{c.code}</span>
                  <span className="text-sm text-muted-foreground">{c.rate}</span>
                  <span className="text-xs text-muted-foreground">
                    {c.position} · {c.decimals}d
                  </span>
                  {isActive ? (
                    <span className="inline-flex w-fit items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <Check className="h-3 w-3" /> Active
                    </span>
                  ) : (
                    <button
                      onClick={() => currencyStore.setActive(c.code)}
                      className="w-fit rounded-md border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground transition hover:border-brand/40 hover:text-brand cursor-pointer"
                    >
                      Set active
                    </button>
                  )}
                  <div className="flex items-center justify-end gap-1.5">
                    <IconAction title="Edit" onClick={() => edit(c)} tone="brand">
                      <Pencil className="h-4 w-4" />
                    </IconAction>
                    {!isBase && (
                      <IconAction
                        title="Delete"
                        onClick={() => {
                          if (confirm(`Delete currency "${c.name}"?`)) currencyStore.remove(c.code);
                        }}
                        tone="danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </IconAction>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
            <span>
              <span className="font-semibold uppercase tracking-wider">Rows per page</span>{' '}
              <span className="ml-2 rounded-md border border-border bg-background px-2 py-1">10</span>
            </span>
            <span>
              Showing <span className="font-medium text-foreground">1</span> to{' '}
              <span className="font-medium text-foreground">{filtered.length}</span> of{' '}
              <span className="font-medium text-foreground">{filtered.length}</span> results
            </span>
            <span className="inline-flex items-center gap-1">
              <button className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border">‹</button>
              <button className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-brand/60 text-brand">1</button>
              <button className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border">›</button>
            </span>
          </div>
        </div>
      </div>

      {/* Add / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={resetForm}>
          <div
            className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">
                {editing ? `Edit ${editing}` : 'Add currency'}
              </h3>
              <button
                onClick={resetForm}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-medium text-muted-foreground">
                  Code
                  <input
                    value={draft.code}
                    onChange={(e) => setDraft({ ...draft, code: e.target.value })}
                    disabled={Boolean(editing)}
                    placeholder="EUR"
                    className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-sm uppercase outline-none focus:border-brand/50 disabled:opacity-60"
                  />
                </label>
                <label className="block text-xs font-medium text-muted-foreground">
                  Symbol
                  <input
                    value={draft.symbol}
                    onChange={(e) => setDraft({ ...draft, symbol: e.target.value })}
                    placeholder="€"
                    className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand/50"
                  />
                </label>
              </div>
              <label className="block text-xs font-medium text-muted-foreground">
                Name
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Euro"
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand/50"
                />
              </label>
              <label className="block text-xs font-medium text-muted-foreground">
                Rate (1 {state.base} = ? {draft.code || 'XXX'})
                <input
                  type="number"
                  step="0.0001"
                  value={draft.rate}
                  onChange={(e) => setDraft({ ...draft, rate: parseFloat(e.target.value) || 0 })}
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand/50"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-medium text-muted-foreground">
                  Position
                  <select
                    value={draft.position}
                    onChange={(e) => setDraft({ ...draft, position: e.target.value as Currency['position'] })}
                    className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand/50"
                  >
                    <option value="prefix">Prefix ({draft.symbol || '$'}10)</option>
                    <option value="suffix">Suffix (10 {draft.symbol || '$'})</option>
                  </select>
                </label>
                <label className="block text-xs font-medium text-muted-foreground">
                  Decimals
                  <input
                    type="number"
                    min={0}
                    max={4}
                    value={draft.decimals}
                    onChange={(e) => setDraft({ ...draft, decimals: parseInt(e.target.value) || 0 })}
                    className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand/50"
                  />
                </label>
              </div>

              <div className="rounded-lg border border-border bg-background/60 px-3 py-2 text-xs text-muted-foreground">
                Preview:{' '}
                <span className="font-medium text-foreground">
                  {draft.position === 'suffix'
                    ? `${(49 * (draft.rate || 1)).toFixed(draft.decimals || 0)} ${draft.symbol || '?'}`
                    : `${draft.symbol || '?'}${(49 * (draft.rate || 1)).toFixed(draft.decimals || 0)}`}
                </span>{' '}
                (from a $49 base price)
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium hover:border-brand/40"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={save}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-gradient px-4 text-sm font-medium text-white shadow shadow-brand/20 cursor-pointer"
                >
                  <Check className="h-4 w-4" /> {editing ? 'Save changes' : 'Add currency'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IconAction({
  title,
  onClick,
  children,
  tone,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  tone: 'brand' | 'danger';
}) {
  const cls =
    tone === 'danger'
      ? 'border-red-500/30 text-red-500 hover:bg-red-500/10'
      : 'border-border text-muted-foreground hover:border-brand/40 hover:text-brand';
  return (
    <button
      title={title}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${cls}`}
    >
      {children}
    </button>
  );
}
