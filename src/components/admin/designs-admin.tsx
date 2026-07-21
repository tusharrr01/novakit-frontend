'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Loader2,
  Upload,
  Trash2,
  Pencil,
  Eye,
  X,
  Save,
  ImageIcon,
  FileCode,
  Layers,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import {
  createCategory,
  deleteCategory,
  deleteDesign,
  emptyBundle,
  listCategories,
  listDesigns,
  makeBundleId,
  signedThumbnailUrl,
  slugify,
  upsertDesign,
  uploadThumbnail,
  type BundleLanguage,
  type CodeBundle,
  type DesignCategory,
  type DesignRow,
} from '@/src/lib/designs-db';
import { SandpackPreview } from '@/src/components/design/sandpack-preview';

const LANGUAGES: { key: BundleLanguage; label: string }[] = [
  { key: 'react', label: 'React' },
  { key: 'html', label: 'HTML' },
  { key: 'vue', label: 'Vue' },
  { key: 'vanilla', label: 'JavaScript' },
  { key: 'nextjs', label: 'Next.js' },
];

const STATUSES: DesignRow['status'][] = ['draft', 'live', 'archived'];

/* ============================================================
 * Root
 * ============================================================ */
export function DesignsAdmin() {
  const [view, setView] = useState<
    { kind: 'list' } | { kind: 'edit'; id: string | null } | { kind: 'info'; id: string }
  >({ kind: 'list' });

  if (view.kind === 'edit')
    return (
      <DesignEditor
        id={view.id}
        onBack={(saved) => setView(saved ? { kind: 'info', id: saved.id } : { kind: 'list' })}
      />
    );
  if (view.kind === 'info')
    return (
      <DesignInfo
        id={view.id}
        onBack={() => setView({ kind: 'list' })}
        onEdit={() => setView({ kind: 'edit', id: view.id })}
        onDeleted={() => setView({ kind: 'list' })}
      />
    );
  return (
    <DesignsList
      onNew={() => setView({ kind: 'edit', id: null })}
      onEdit={(id) => setView({ kind: 'edit', id })}
      onInfo={(id) => setView({ kind: 'info', id })}
    />
  );
}

/* ============================================================
 * List
 * ============================================================ */
function DesignsList({
  onNew,
  onEdit,
  onInfo,
}: {
  onNew: () => void;
  onEdit: (id: string) => void;
  onInfo: (id: string) => void;
}) {
  const [designs, setDesigns] = useState<DesignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | DesignRow['status']>('all');
  const [category, setCategory] = useState<string>('All');
  const [categories, setCategories] = useState<DesignCategory[]>([]);
  const [showCats, setShowCats] = useState(false);

  const refresh = useCallback(() => {
    setLoading(true);
    listDesigns({ status: 'all' })
      .then(setDesigns)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
    listCategories().then(setCategories).catch(() => setCategories([]));
  }, [refresh]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return designs.filter((d) => {
      if (status !== 'all' && d.status !== status) return false;
      if (category !== 'All' && d.category !== category) return false;
      if (!query) return true;
      return (
        d.name.toLowerCase().includes(query) ||
        d.slug.toLowerCase().includes(query) ||
        d.tags.some((t) => t.toLowerCase().includes(query))
      );
    });
  }, [designs, q, status, category]);

  const catNames = ['All', ...Array.from(new Set(categories.map((c) => c.name).concat(designs.map((d) => d.category))))];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand">
              <Sparkles className="h-3.5 w-3.5" /> Design library
            </div>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">Designs</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Live-preview components with prompts and multi-language code bundles.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCats(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-accent"
            >
              <Layers className="h-3.5 w-3.5" /> Categories
            </button>
            <button
              onClick={onNew}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-3.5 py-1.5 text-xs font-medium text-white shadow"
            >
              <Plus className="h-3.5 w-3.5" /> New design
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="h-9 w-full rounded-md border border-border bg-card pl-8 pr-3 text-sm outline-none focus:border-brand"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as never)}
            className="h-9 rounded-md border border-border bg-card px-2 text-sm"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 rounded-md border border-border bg-card px-2 text-sm"
          >
            {catNames.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto thin-scrollbar rounded-xl border border-border bg-card">
        {loading ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
            <Sparkles className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No designs match your filters.</p>
            <button
              onClick={onNew}
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-gradient px-3 py-1.5 text-xs font-medium text-white"
            >
              <Plus className="h-3.5 w-3.5" /> Create your first design
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Design</th>
                <th className="px-4 py-2 font-medium">Category</th>
                <th className="px-4 py-2 font-medium">Bundles</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Views</th>
                <th className="px-4 py-2 font-medium">Updated</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <DesignRowItem key={d.id} d={d} onEdit={onEdit} onInfo={onInfo} onDeleted={refresh} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showCats && (
        <CategoriesModal
          categories={categories}
          onClose={() => setShowCats(false)}
          onChanged={() => listCategories().then(setCategories)}
        />
      )}
    </div>
  );
}

function DesignRowItem({
  d,
  onEdit,
  onInfo,
  onDeleted,
}: {
  d: DesignRow;
  onEdit: (id: string) => void;
  onInfo: (id: string) => void;
  onDeleted: () => void;
}) {
  const [thumb, setThumb] = useState<string | null>(null);
  useEffect(() => {
    signedThumbnailUrl(d.thumbnail_path).then(setThumb);
  }, [d.thumbnail_path]);

  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-accent/40">
      <td className="px-4 py-2">
        <button
          onClick={() => onInfo(d.id)}
          className="flex items-center gap-3 text-left"
        >
          <div className="h-9 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
            {thumb ? (
              <img src={thumb} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <ImageIcon className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium">{d.name}</div>
            <div className="truncate text-xs text-muted-foreground">/{d.slug}</div>
          </div>
        </button>
      </td>
      <td className="px-4 py-2 text-muted-foreground">{d.category}</td>
      <td className="px-4 py-2">
        <div className="flex flex-wrap gap-1">
          {d.bundles.map((b) => (
            <span
              key={b.id}
              className="rounded-full border border-border bg-background px-1.5 py-0.5 text-[10px] uppercase"
            >
              {b.language}
            </span>
          ))}
          {d.bundles.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
        </div>
      </td>
      <td className="px-4 py-2">
        <StatusPill status={d.status} />
      </td>
      <td className="px-4 py-2 text-muted-foreground">{d.views}</td>
      <td className="px-4 py-2 text-xs text-muted-foreground">
        {new Date(d.updated_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onInfo(d.id)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            title="View"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onEdit(d.id)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={async () => {
              if (!confirm(`Delete "${d.name}"?`)) return;
              await deleteDesign(d.id);
              onDeleted();
            }}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function StatusPill({ status }: { status: DesignRow['status'] }) {
  const styles: Record<DesignRow['status'], string> = {
    live: 'bg-green-500/10 text-green-500',
    draft: 'bg-amber-500/10 text-amber-500',
    archived: 'bg-muted text-muted-foreground',
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}

function CategoriesModal({
  categories,
  onClose,
  onChanged,
}: {
  categories: DesignCategory[];
  onClose: () => void;
  onChanged: () => void;
}) {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Categories</h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-1.5">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-md border border-border px-3 py-1.5 text-sm"
            >
              <span>{c.name}</span>
              <button
                onClick={async () => {
                  await deleteCategory(c.id);
                  onChanged();
                }}
                className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <form
          className="mt-4 flex items-center gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!name.trim()) return;
            setBusy(true);
            try {
              await createCategory(name.trim());
              setName('');
              onChanged();
            } finally {
              setBusy(false);
            }
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add category"
            className="h-9 flex-1 rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-brand"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-brand-gradient px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
 * Info (read-only detail)
 * ============================================================ */
function DesignInfo({
  id,
  onBack,
  onEdit,
  onDeleted,
}: {
  id: string;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: () => void;
}) {
  const [design, setDesign] = useState<DesignRow | null>(null);
  const [thumb, setThumb] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    listDesigns({ status: 'all' }).then((rows) => {
      const d = rows.find((r) => r.id === id) ?? null;
      setDesign(d);
      if (d) signedThumbnailUrl(d.thumbnail_path).then(setThumb);
    });
  }, [id]);

  if (!design)
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );

  const bundle = design.bundles[idx];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-brand">
              {design.category}
            </div>
            <h1 className="mt-1 font-display text-2xl font-semibold">{design.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              /{design.slug} · <StatusPill status={design.status} /> · by {design.author}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-accent"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
            <button
              onClick={async () => {
                if (!confirm(`Delete "${design.name}"?`)) return;
                await deleteDesign(design.id);
                onDeleted();
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto thin-scrollbar pr-1">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1">
              {design.bundles.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => setIdx(i)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                    i === idx
                      ? 'border-brand bg-brand/10 text-brand'
                      : 'border-border bg-card text-muted-foreground'
                  }`}
                >
                  {b.label || b.language}
                </button>
              ))}
            </div>
            {bundle && (
              <div className="overflow-hidden rounded-xl border border-border bg-card p-2">
                <SandpackPreview bundle={bundle} height={420} />
              </div>
            )}
          </div>
          <aside className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              {thumb ? (
                <img src={thumb} alt="" className="aspect-video w-full object-cover" />
              ) : (
                <div className="flex aspect-video items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )}
            </div>
            <InfoBox label="Tagline" value={design.tagline || '—'} />
            <InfoBox label="Description" value={design.description || '—'} />
            <InfoBox label="Tags" value={design.tags.join(', ') || '—'} />
            <InfoBox label="Install" value={design.install_command || '—'} mono />
            <InfoBox label="Prompt" value={design.prompt || '—'} mono />
          </aside>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 whitespace-pre-wrap text-sm ${mono ? 'font-mono text-xs' : ''}`}>{value}</div>
    </div>
  );
}

/* ============================================================
 * Editor
 * ============================================================ */
function DesignEditor({
  id,
  onBack,
}: {
  id: string | null;
  onBack: (saved: DesignRow | null) => void;
}) {
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<DesignRow>>({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    category: 'Components',
    tags: [],
    status: 'draft',
    thumbnail_path: null,
    prompt: '',
    bundles: [emptyBundle('react')],
    install_command: '',
    author: 'NovaKit',
  });
  const [thumb, setThumb] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [activeBundleIdx, setActiveBundleIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const slugTouched = useRef(false);
  const [categories, setCategories] = useState<DesignCategory[]>([]);

  useEffect(() => {
    listCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    listDesigns({ status: 'all' })
      .then((rows) => {
        const found = rows.find((r) => r.id === id);
        if (found) {
          setForm(found);
          slugTouched.current = true;
          signedThumbnailUrl(found.thumbnail_path).then(setThumb);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const setBundle = (i: number, patch: Partial<CodeBundle>) => {
    setForm((f) => ({
      ...f,
      bundles: (f.bundles ?? []).map((b, idx) => (idx === i ? { ...b, ...patch } : b)),
    }));
  };

  const activeBundle = form.bundles?.[activeBundleIdx];

  const save = async () => {
    setError(null);
    if (!form.name?.trim()) {
      setError('Name is required.');
      return;
    }
    setSaving(true);
    try {
      const saved = await upsertDesign({
        ...form,
        name: form.name.trim(),
        slug: (form.slug || slugify(form.name)).trim(),
      });
      onBack(saved);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <button
          onClick={() => onBack(null)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand">
              <Sparkles className="h-3.5 w-3.5" /> {id ? 'Edit design' : 'New design'}
            </div>
            <h1 className="mt-1 font-display text-2xl font-semibold">
              {form.name || 'Untitled design'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {error && (
              <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-xs text-destructive">
                <AlertTriangle className="h-3 w-3" />
                {error}
              </span>
            )}
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-3.5 py-1.5 text-xs font-medium text-white disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto thin-scrollbar pr-1 pb-4">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          {/* LEFT — form */}
          <div className="space-y-4">
            {/* Metadata */}
            <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
              <h2 className="text-sm font-medium">Metadata</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Name">
                  <input
                    value={form.name ?? ''}
                    onChange={(e) => {
                      const name = e.target.value;
                      setForm((f) => ({
                        ...f,
                        name,
                        slug: slugTouched.current ? f.slug : slugify(name),
                      }));
                    }}
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                  />
                </Field>
                <Field label="Slug">
                  <input
                    value={form.slug ?? ''}
                    onChange={(e) => {
                      slugTouched.current = true;
                      setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
                    }}
                    className="h-9 w-full rounded-md border border-border bg-background px-3 font-mono text-sm"
                  />
                </Field>
                <Field label="Category">
                  <input
                    list="design-cats"
                    value={form.category ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                  />
                  <datalist id="design-cats">
                    {categories.map((c) => (
                      <option key={c.id} value={c.name} />
                    ))}
                  </datalist>
                </Field>
                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as DesignRow['status'] }))}
                    className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Author">
                  <input
                    value={form.author ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                  />
                </Field>
                <Field label="Install command">
                  <input
                    value={form.install_command ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, install_command: e.target.value }))}
                    placeholder="npx shadcn add …"
                    className="h-9 w-full rounded-md border border-border bg-background px-3 font-mono text-xs"
                  />
                </Field>
              </div>
              <Field label="Tagline">
                <input
                  value={form.tagline ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                />
              </Field>
              <Field label="Description">
                <textarea
                  value={form.description ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </Field>
              <Field label="Tags">
                <div className="flex flex-wrap gap-1.5 rounded-md border border-border bg-background p-2">
                  {(form.tags ?? []).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, tags: (f.tags ?? []).filter((x) => x !== t) }))
                        }
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const t = tagInput.trim().replace(/^#/, '');
                        if (t) {
                          setForm((f) => ({
                            ...f,
                            tags: Array.from(new Set([...(f.tags ?? []), t])),
                          }));
                          setTagInput('');
                        }
                      }
                    }}
                    placeholder="type & Enter"
                    className="min-w-[100px] flex-1 bg-transparent text-xs outline-none"
                  />
                </div>
              </Field>
            </section>

            {/* Thumbnail */}
            <section className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-brand" />
                <h2 className="text-sm font-medium">Thumbnail</h2>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Cover image shown on the gallery. Recommended 16:10, PNG or JPG.
              </p>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const path = await uploadThumbnail(file);
                    setForm((f) => ({ ...f, thumbnail_path: path }));
                    signedThumbnailUrl(path).then(setThumb);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Upload failed.');
                  }
                }}
              />
              <ThumbnailDropzone
                thumb={thumb}
                onFile={async (file) => {
                  try {
                    const path = await uploadThumbnail(file);
                    setForm((f) => ({ ...f, thumbnail_path: path }));
                    signedThumbnailUrl(path).then(setThumb);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Upload failed.');
                  }
                }}
                onPick={() => fileInput.current?.click()}
                onRemove={
                  form.thumbnail_path
                    ? () => {
                        setForm((f) => ({ ...f, thumbnail_path: null }));
                        setThumb(null);
                      }
                    : undefined
                }
              />
            </section>


            {/* Prompt */}
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-sm font-medium">AI prompt</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                What a user can paste into Lovable, Cursor or ChatGPT to recreate this design.
              </p>
              <textarea
                value={form.prompt ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, prompt: e.target.value }))}
                rows={5}
                placeholder="Build a hero section with…"
                className="mt-2 w-full rounded-md border border-border bg-background p-3 font-mono text-xs"
              />
            </section>

            {/* Bundles */}
            <section className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">Code bundles</h2>
                <div className="flex items-center gap-1">
                  <select
                    onChange={(e) => {
                      const lang = e.target.value as BundleLanguage;
                      if (!lang) return;
                      setForm((f) => ({
                        ...f,
                        bundles: [...(f.bundles ?? []), emptyBundle(lang)],
                      }));
                      setActiveBundleIdx((form.bundles?.length ?? 0));
                      e.currentTarget.value = '';
                    }}
                    className="h-8 rounded-md border border-border bg-background px-2 text-xs"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      + Add bundle…
                    </option>
                    {LANGUAGES.map((l) => (
                      <option key={l.key} value={l.key}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(form.bundles?.length ?? 0) === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No bundles yet.</p>
              ) : (
                <>
                  <div className="mt-3 flex flex-wrap items-center gap-1 border-b border-border pb-2">
                    {form.bundles!.map((b, i) => (
                      <div
                        key={b.id}
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${
                          i === activeBundleIdx
                            ? 'border-brand bg-brand/10 text-brand'
                            : 'border-border bg-background text-muted-foreground'
                        }`}
                      >
                        <button onClick={() => setActiveBundleIdx(i)} className="capitalize">
                          {b.label || b.language}
                        </button>
                        <button
                          onClick={() => {
                            setForm((f) => ({
                              ...f,
                              bundles: (f.bundles ?? []).filter((_, idx) => idx !== i),
                            }));
                            setActiveBundleIdx(0);
                          }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {activeBundle && (
                    <BundleEditor
                      bundle={activeBundle}
                      onChange={(patch) => setBundle(activeBundleIdx, patch)}
                    />
                  )}
                </>
              )}
            </section>
          </div>

          {/* RIGHT — live preview */}
          <aside className="space-y-3 xl:sticky xl:top-0 xl:self-start">
            <div className="rounded-2xl border border-border bg-card p-3">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-brand" /> Live preview
                {activeBundle && (
                  <span className="ml-auto capitalize">{activeBundle.label || activeBundle.language}</span>
                )}
              </div>
              {activeBundle ? (
                <SandpackPreview bundle={activeBundle} height={420} />
              ) : (
                <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                  Add a bundle to see the preview.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function BundleEditor({
  bundle,
  onChange,
}: {
  bundle: CodeBundle;
  onChange: (patch: Partial<CodeBundle>) => void;
}) {
  const [activeFile, setActiveFile] = useState(bundle.files[0]?.name ?? '');
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    if (!bundle.files.find((f) => f.name === activeFile)) {
      setActiveFile(bundle.files[0]?.name ?? '');
    }
  }, [bundle.files, activeFile]);

  const file = bundle.files.find((f) => f.name === activeFile);

  const addFile = () => {
    const base = `file-${bundle.files.length + 1}.tsx`;
    onChange({
      files: [...bundle.files, { name: base, content: '' }],
    });
    setActiveFile(base);
  };

  const setFile = (name: string, content: string) => {
    onChange({
      files: bundle.files.map((f) => (f.name === name ? { ...f, content } : f)),
    });
  };

  const removeFile = (name: string) => {
    if (bundle.files.length <= 1) return;
    onChange({ files: bundle.files.filter((f) => f.name !== name) });
  };

  const doRename = (oldName: string) => {
    const newName = renameValue.trim();
    if (!newName || newName === oldName) {
      setRenaming(null);
      return;
    }
    onChange({
      files: bundle.files.map((f) => (f.name === oldName ? { ...f, name: newName } : f)),
      entry: bundle.entry === oldName ? newName : bundle.entry,
    });
    setActiveFile(newName);
    setRenaming(null);
  };

  return (
    <div className="mt-3 space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <Field label="Label">
          <input
            value={bundle.label ?? ''}
            onChange={(e) => onChange({ label: e.target.value })}
            className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
          />
        </Field>
        <Field label="Entry file">
          <select
            value={bundle.entry}
            onChange={(e) => onChange({ entry: e.target.value })}
            className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
          >
            {bundle.files.map((f) => (
              <option key={f.name}>{f.name}</option>
            ))}
          </select>
        </Field>
        <Field label="&nbsp;">
          <button
            type="button"
            onClick={() => {
              const newId = makeBundleId();
              onChange({ id: newId });
            }}
            className="hidden"
          />
          <button
            type="button"
            onClick={addFile}
            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs hover:bg-accent"
          >
            <Plus className="h-3 w-3" /> New file
          </button>
        </Field>
      </div>

      <FileDropZone
        onFiles={async (files) => {
          const newFiles = await Promise.all(
            files.map(async (f) => ({ name: f.name, content: await f.text() })),
          );
          // Merge: overwrite same-name, append new ones
          const map = new Map(bundle.files.map((f) => [f.name, f]));
          for (const nf of newFiles) map.set(nf.name, nf);
          const merged = Array.from(map.values());
          onChange({ files: merged });
          if (newFiles[0]) setActiveFile(newFiles[0].name);
        }}
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-2">
            {bundle.files.map((f) => (
              <div
                key={f.name}
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${
                  f.name === activeFile
                    ? 'border-brand bg-background text-foreground'
                    : 'border-transparent bg-background/60 text-muted-foreground'
                }`}
              >
                {renaming === f.name ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => doRename(f.name)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') doRename(f.name);
                      if (e.key === 'Escape') setRenaming(null);
                    }}
                    className="w-32 rounded border border-border bg-background px-1 text-xs"
                  />
                ) : (
                  <button
                    onDoubleClick={() => {
                      setRenaming(f.name);
                      setRenameValue(f.name);
                    }}
                    onClick={() => setActiveFile(f.name)}
                    className="inline-flex items-center gap-1"
                  >
                    <FileCode className="h-3 w-3" />
                    {f.name}
                  </button>
                )}
                {bundle.files.length > 1 && (
                  <button
                    onClick={() => removeFile(f.name)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {file && (
            <textarea
              value={file.content}
              onChange={(e) => setFile(file.name, e.target.value)}
              spellCheck={false}
              className="block h-[360px] w-full resize-y bg-[#0b0b14] p-4 font-mono text-xs leading-relaxed text-slate-100 outline-none"
            />
          )}
        </div>
      </FileDropZone>
      <p className="text-[10px] text-muted-foreground">
        Drag &amp; drop files onto the editor to add them. Double-click a tab to rename. The <b>entry file</b> is what the preview mounts.
      </p>
    </div>
  );
}


function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  );
}

function ThumbnailDropzone({
  thumb,
  onFile,
  onPick,
  onRemove,
}: {
  thumb: string | null;
  onFile: (file: File) => void;
  onPick: () => void;
  onRemove?: () => void;
}) {
  const [over, setOver] = useState(false);
  return (
    <div className="mt-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith('image/'));
          if (file) onFile(file);
        }}
        onClick={onPick}
        role="button"
        tabIndex={0}
        className={`group relative flex aspect-[16/9] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition ${
          over
            ? 'border-brand bg-brand/5'
            : 'border-border bg-background hover:border-brand/60 hover:bg-accent/40'
        }`}
      >
        {thumb ? (
          <>
            <img src={thumb} alt="" className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/0 text-white opacity-0 transition group-hover:bg-black/50 group-hover:opacity-100">
              <Upload className="h-5 w-5" />
              <span className="text-xs font-medium">Drop to replace</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="rounded-full bg-brand/10 p-3 text-brand">
              <Upload className="h-5 w-5" />
            </div>
            <div className="text-sm font-medium">Drop image or click to upload</div>
            <div className="text-xs text-muted-foreground">PNG, JPG, WebP up to 5 MB</div>
          </div>
        )}
      </div>
      {onRemove && thumb && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" /> Remove thumbnail
        </button>
      )}
    </div>
  );
}

function FileDropZone({
  onFiles,
  children,
}: {
  onFiles: (files: File[]) => void;
  children: React.ReactNode;
}) {
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={(e) => {
        // Only unset when leaving the wrapper, not child transitions
        if (e.currentTarget === e.target) setOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFiles(files);
      }}
      className={`relative rounded-xl transition ${
        over ? 'ring-2 ring-brand ring-offset-2 ring-offset-background' : ''
      }`}
    >
      {children}
      {over && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-brand/10 text-brand backdrop-blur-sm">
          <div className="flex flex-col items-center gap-1 text-sm font-medium">
            <Upload className="h-5 w-5" />
            Drop files to add
          </div>
        </div>
      )}
    </div>
  );
}
