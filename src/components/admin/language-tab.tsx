'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Globe,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  ArrowLeft,
  Download,
  Send,
  RotateCcw,
  Check,
  CheckCircle2,
  Search as SearchIcon,
  BarChart3,
  Languages,
} from 'lucide-react';
import {
  i18nStore,
  useI18nState,
  buildEnglishDictionary,
  type Language as I18nLanguage,
  type LanguageDictionary,
} from '@/src/lib/i18n';

type LangView =
  | { mode: 'list' }
  | { mode: 'add' }
  | { mode: 'edit'; code: string }
  | { mode: 'manage'; code: string };

export function LanguageLibraryTab() {
  const [view, setView] = useState<LangView>({ mode: 'list' });

  if (view.mode === 'add') return <LanguageForm mode="add" onBack={() => setView({ mode: 'list' })} />;
  if (view.mode === 'edit') return <LanguageForm mode="edit" code={view.code} onBack={() => setView({ mode: 'list' })} />;
  if (view.mode === 'manage') return <ManageTranslations code={view.code} onBack={() => setView({ mode: 'list' })} />;
  return (
    <LanguageList
      onAdd={() => setView({ mode: 'add' })}
      onEdit={(c) => setView({ mode: 'edit', code: c })}
      onManage={(c) => setView({ mode: 'manage', code: c })}
    />
  );
}

/* ---------------- List view ---------------- */

function LanguageList({
  onAdd,
  onEdit,
  onManage,
}: {
  onAdd: () => void;
  onEdit: (c: string) => void;
  onManage: (c: string) => void;
}) {
  const state = useI18nState();
  const [query, setQuery] = useState('');
  const filtered = state.languages.filter(
    (l) =>
      l.name.toLowerCase().includes(query.toLowerCase()) ||
      l.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-brand">Language Library</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage languages, translations, and localization settings.
            </p>
          </div>
          <button
            onClick={onAdd}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-brand-gradient px-4 text-sm font-medium text-white shadow-lg shadow-brand/20 transition hover:opacity-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add New
          </button>
        </div>

        {/* Search */}
        <div className="admin-card-static p-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
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
          <div className="grid grid-cols-[40px_80px_1fr_120px_100px_140px_160px] items-center gap-3 border-b border-border/60 bg-accent/30 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span></span>
            <span>Flag</span>
            <span>Name</span>
            <span>Locale</span>
            <span>RTL</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          {filtered.length === 0 && (
            <div className="px-6 py-16 text-center text-sm text-muted-foreground">
              No languages match your search.
            </div>
          )}
          <ul>
            {filtered.map((l) => {
              const isDefault = l.code === 'en';
              return (
                <li
                  key={l.code}
                  className="grid grid-cols-[40px_80px_1fr_120px_100px_140px_160px] items-center gap-3 border-b border-border/60 px-4 py-4 last:border-0 hover:bg-accent/20"
                >
                  <input type="checkbox" className="h-4 w-4 rounded border-border" />
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
                    <Globe className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium">{l.name}</span>
                  <span className="text-sm text-muted-foreground">{l.code}</span>
                  <span
                    className={`inline-flex w-fit items-center rounded-md px-2.5 py-0.5 text-[11px] font-medium ${
                      l.rtl
                        ? 'border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {l.rtl ? 'Yes' : 'No'}
                  </span>
                  <StatusToggle
                    enabled={l.enabled !== false}
                    onToggle={(v) => i18nStore.setStatus(l.code, v)}
                  />
                  <div className="flex items-center justify-end gap-1.5">
                    <IconAction title="Manage translations" onClick={() => onManage(l.code)} tone="brand">
                      <BookOpen className="h-4 w-4" />
                    </IconAction>
                    <IconAction title="Edit" onClick={() => onEdit(l.code)} tone="brand">
                      <Pencil className="h-4 w-4" />
                    </IconAction>
                    {!isDefault && (
                      <IconAction
                        title="Delete"
                        onClick={() => {
                          if (confirm(`Delete language "${l.name}"?`)) i18nStore.removeLanguage(l.code);
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

function StatusToggle({ enabled, onToggle }: { enabled: boolean; onToggle: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onToggle(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        enabled ? 'bg-brand' : 'bg-muted'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
          enabled ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

/* ---------------- Add / Edit form ---------------- */

const COMMON_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'he', name: 'Hebrew' },
  { code: 'ru', name: 'Russian' },
  { code: 'si', name: 'Sinhala' },
];

function LanguageForm({ mode, code, onBack }: { mode: 'add' | 'edit'; code?: string; onBack: () => void }) {
  const state = useI18nState();
  const existing = code ? state.languages.find((l) => l.code === code) : undefined;
  const [chosenCode, setChosenCode] = useState(existing?.code || '');
  const [displayName, setDisplayName] = useState(existing?.name || '');
  const [rtl, setRtl] = useState(existing?.rtl ?? false);
  const [enabled, setEnabled] = useState(existing?.enabled !== false);
  const [isDefault, setIsDefault] = useState(state.active === existing?.code);
  const [pendingDict, setPendingDict] = useState<LanguageDictionary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  async function readJsonFile(f: File): Promise<LanguageDictionary | null> {
    try {
      const text = await f.text();
      const parsed = JSON.parse(text);
      const dict = (parsed.translations || parsed) as LanguageDictionary;
      if (typeof dict !== 'object') throw new Error('Invalid JSON');
      return dict;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bad JSON');
      return null;
    }
  }

  function downloadEnglish() {
    const dict = buildEnglishDictionary();
    const blob = new Blob([JSON.stringify({ language: { code: 'en', name: 'English' }, translations: dict }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'novakit-front-en.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function save() {
    setError(null);
    const codeFinal = (chosenCode || existing?.code || '').trim().toLowerCase();
    if (!codeFinal) return setError('Please choose a language.');
    if (!displayName.trim()) return setError('Display name is required.');
    i18nStore.upsertLanguage(
      { code: codeFinal, name: displayName.trim(), rtl, enabled },
      pendingDict ?? undefined
    );
    if (isDefault && enabled) i18nStore.setActive(codeFinal);
    onBack();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <button
            onClick={onBack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card transition hover:border-brand/40"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="font-display text-2xl font-semibold text-brand">
              {mode === 'add' ? 'Add New Language' : 'Edit Language'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === 'add'
                ? 'Set up a new language and upload localization files.'
                : 'Update language details and translation files.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="h-11 rounded-md border border-border bg-background px-5 text-sm font-medium transition hover:border-brand/40"
          >
            Go Back
          </button>
          <button
            onClick={save}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-brand-gradient px-5 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:opacity-95 cursor-pointer"
          >
            <Check className="h-4 w-4" /> {mode === 'add' ? 'Create Language' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* Basic info */}
        <div className="admin-card p-6">
          <div className="mb-5 flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand/10 text-brand">
              <Globe className="h-4 w-4" />
            </span>
            <h3 className="font-display text-base font-semibold">Basic Information</h3>
          </div>

          <label className="block text-sm">
            <span className="font-medium">
              Choose Language <span className="text-red-500">*</span>
            </span>
            <select
              value={chosenCode}
              onChange={(e) => {
                const c = e.target.value;
                setChosenCode(c);
                const preset = COMMON_LANGUAGES.find((x) => x.code === c);
                if (preset && !displayName) setDisplayName(preset.name);
              }}
              disabled={mode === 'edit'}
              className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand/50 disabled:opacity-60"
            >
              <option value="">Select language</option>
              {COMMON_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.code})
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block text-sm">
            <span className="font-medium">
              Display Name <span className="text-red-500">*</span>
            </span>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. English"
              className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand/50"
            />
          </label>

          <ToggleRow
            title="Right-to-Left (RTL)"
            desc="Enable for scripts like Arabic or Hebrew"
            checked={rtl}
            onChange={setRtl}
          />
          <ToggleRow
            title="Active Status"
            desc="Enable this language for users"
            checked={enabled}
            onChange={setEnabled}
          />
          <ToggleRow
            title="Set as Default"
            desc="Make this the primary language for the platform"
            checked={isDefault}
            onChange={setIsDefault}
          />
        </div>

        {/* Translations & Assets */}
        <div className="admin-card p-6">
          <div className="mb-5 flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand/10 text-brand">
              <Languages className="h-4 w-4" />
            </span>
            <h3 className="font-display text-base font-semibold">Translations &amp; Assets</h3>
          </div>

          <p className="text-sm font-medium">Flag Icon</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-md border border-dashed border-border bg-background text-muted-foreground">
              <Globe className="h-5 w-5" />
            </div>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium transition hover:border-brand/40"
            >
              <Download className="h-3.5 w-3.5 rotate-180" /> Upload Flag Icon
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            PNG, SVG, WEBP. Max 2MB. Square ratio best.
          </p>

          <div className="mt-6">
            <p className="mb-3 text-sm font-medium">Front JSON</p>
            <input
              ref={fileInput}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (!f) return;
                const dict = await readJsonFile(f);
                if (dict) setPendingDict(dict);
              }}
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-background/60 px-6 py-10 text-center transition hover:border-brand/40"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand/10 text-brand">
                <Send className="h-4 w-4 rotate-45" />
              </span>
              <span className="text-sm font-medium">
                {pendingDict ? `Loaded ${Object.keys(pendingDict).length} keys` : 'Front JSON'}
              </span>
              <span className="text-xs text-muted-foreground">Drop file or click</span>
            </button>
            <button
              type="button"
              onClick={downloadEnglish}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
            >
              <Download className="h-3.5 w-3.5" /> Download Front JSON
            </button>
          </div>

          {mode === 'edit' && (
            <div className="mt-5 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
              <span className="font-medium">⚠</span> Existing translation files remain active unless you upload new ones.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  title,
  desc,
  checked,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-md border border-border bg-background/60 px-4 py-3">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <StatusToggle enabled={checked} onToggle={onChange} />
    </div>
  );
}

/* ---------------- Manage translations ---------------- */

function ManageTranslations({ code, onBack }: { code: string; onBack: () => void }) {
  const state = useI18nState();
  const language = state.languages.find((l) => l.code === code);
  const englishDict = useMemo(() => buildEnglishDictionary(), []);
  const initialDict = useMemo(() => {
    const base: LanguageDictionary = { ...englishDict };
    const existing = state.dictionaries[code] || {};
    for (const k of Object.keys(englishDict)) base[k] = existing[k] ?? englishDict[k];
    return base;
  }, [code, englishDict, state.dictionaries]);
  const [draft, setDraft] = useState<LanguageDictionary>(initialDict);
  const [query, setQuery] = useState('');
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const entries = Object.entries(draft).filter(
    ([k, v]) =>
      !query ||
      k.toLowerCase().includes(query.toLowerCase()) ||
      v.toLowerCase().includes(query.toLowerCase())
  );

  function save() {
    i18nStore.saveDictionary(code, draft);
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 1800);
  }

  function reset() {
    setDraft(initialDict);
  }

  if (!language) {
    return (
      <div className="admin-card p-8 text-center text-sm text-muted-foreground">
        Language not found.
        <div className="mt-4">
          <button onClick={onBack} className="text-brand hover:underline">
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={onBack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card transition hover:border-brand/40"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="font-display text-2xl font-semibold text-brand">
              Manage Translations <span className="text-muted-foreground/70">({language.name})</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Edit localization keys and values for this language.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium transition hover:border-brand/40"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <button
            onClick={save}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-brand-gradient px-4 text-sm font-semibold text-white shadow-lg shadow-brand/20 cursor-pointer"
          >
            <Check className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </div>

      {savedAt && (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400">
          Translations saved.
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
              placeholder="Search keys or values..."
              className="h-11 w-full rounded-md border border-transparent bg-accent/40 pl-10 pr-3 text-sm outline-none focus:border-brand/40"
            />
          </div>
          <div className="hidden items-center gap-1 rounded-md border border-border bg-background p-1 text-xs text-muted-foreground sm:inline-flex">
            <span className="rounded-lg bg-accent px-2 py-1 text-foreground">Front</span>
          </div>
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {entries.length === 0 && (
          <div className="admin-card px-6 py-10 text-center text-sm text-muted-foreground">
            No keys match your search.
          </div>
        )}
        {entries.map(([key, value]) => (
          <div key={key} className="admin-card p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {key.length > 60 ? key.slice(0, 60) + '…' : key}
            </p>
            <input
              value={value}
              onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
              className="h-11 w-full rounded-md border border-transparent bg-accent/30 px-3 text-sm outline-none focus:border-brand/40 focus:bg-background"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {entries.length} of {Object.keys(draft).length} keys shown
        </span>
        <button onClick={reset} className="hover:text-foreground">
          Reset changes
        </button>
      </div>
    </div>
  );
}
