'use client';

import { useMemo, useState } from 'react';
import { FileText, Plus, Pencil, Trash2, Search as SearchIcon, ArrowLeft, Save, X } from 'lucide-react';
import { pagesStore, usePages, type DynamicPage } from '@/src/lib/pages-content';

type View = { mode: 'list' } | { mode: 'edit'; page: DynamicPage } | { mode: 'create' };

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function PageManagementTab() {
  const pages = usePages();
  const [view, setView] = useState<View>({ mode: 'list' });
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter(
      (p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q),
    );
  }, [pages, query]);

  if (view.mode !== 'list') {
    return (
      <PageEditor
        initial={view.mode === 'edit' ? view.page : undefined}
        onBack={() => setView({ mode: 'list' })}
        onSaved={() => setView({ mode: 'list' })}
      />
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-brand">Page Management</h2>
            <p className="text-sm text-muted-foreground">
              Create and manage dynamic pages like Privacy Policy, Terms &amp; Conditions, About, etc.
            </p>
          </div>
          <button
            onClick={() => setView({ mode: 'create' })}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-3 py-2 text-sm font-medium text-white shadow-lg shadow-brand/20 hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> New page
          </button>
        </div>

        <div className="admin-card-static flex items-center gap-2 p-3">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages by title or slug"
              className="w-full rounded-lg border border-border/60 bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-brand/50"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto thin-scrollbar pt-6">
        <div className="admin-card-static">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Last updated</th>
                <th className="w-32 px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No pages found.
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/60 last:border-b-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand/10 text-brand">
                        <FileText className="h-4 w-4" />
                      </span>
                      <span className="font-medium">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">/{p.slug}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(p.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setView({ mode: 'edit', page: p })}
                        className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete page "${p.title}"?`)) pagesStore.remove(p.id);
                        }}
                        className="grid h-8 w-8 place-items-center rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PageEditor({
  initial,
  onBack,
  onSaved,
}: {
  initial?: DynamicPage;
  onBack: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [slugTouched, setSlugTouched] = useState(!!initial);

  const save = () => {
    if (!title.trim() || !slug.trim()) return;
    pagesStore.upsert({
      id: initial?.id ?? `pg_${Math.random().toString(36).slice(2, 8)}`,
      title: title.trim(),
      slug: slugify(slug),
      content,
      updatedAt: new Date().toISOString(),
    });
    onSaved();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border/60 hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-brand">
              {initial ? 'Edit page' : 'New page'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Content saved here is available at <code>/{slug || 'your-slug'}</code>.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm hover:bg-muted"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
          <button
            onClick={save}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-3 py-2 text-sm font-medium text-white shadow-lg shadow-brand/20 hover:opacity-95"
          >
            <Save className="h-4 w-4" /> Save page
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="admin-card p-5">
          <label className="block">
            <div className="mb-1 text-xs font-medium">Title</div>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              placeholder="Privacy Policy"
              className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-brand/50"
            />
          </label>
          <label className="mt-4 block">
            <div className="mb-1 text-xs font-medium">Content (Markdown supported)</div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={22}
              className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 font-mono text-sm outline-none focus:border-brand/50"
            />
          </label>
        </div>
        <aside className="space-y-4">
          <div className="admin-card p-4">
            <div className="mb-2 text-sm font-semibold">Slug</div>
            <input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              placeholder="privacy-policy"
              className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-brand/50"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Used in the URL and referenced by Signup Customization.
            </p>
          </div>
          <div className="admin-card p-4">
            <div className="mb-2 text-sm font-semibold">Tips</div>
            <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
              <li>Use <code># Heading</code> for section titles.</li>
              <li>Slugs must be lowercase and hyphen-separated.</li>
              <li>Once published, this page can be selected as a Signup consent checkbox.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
