'use client';

import { useMemo, useState } from 'react';
import { FileText, Plus, Pencil, Trash2, Search as SearchIcon, Globe, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAdminGetPagesQuery, useDeletePageMutation } from '@/src/redux/api/pageApi';

export function PageManagementTab() {
  const { data, isLoading, isFetching } = useAdminGetPagesQuery(undefined);
  const [deletePage, { isLoading: isDeleting }] = useDeletePageMutation();
  const [query, setQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const pages = data?.data || [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter(
      (p: any) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q),
    );
  }, [pages, query]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete page "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deletePage(id).unwrap();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-brand">Page Management</h2>
            <p className="text-sm text-muted-foreground">
              Create and manage dynamic pages like Privacy Policy, Terms &amp; Conditions, About, etc.
            </p>
          </div>
          <Link
            href="/admin/page_management/create"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-3 py-2 text-sm font-medium text-white shadow-lg shadow-brand/20 hover:opacity-95 transition-opacity"
          >
            <Plus className="h-4 w-4" /> New page
          </Link>
        </div>

        {/* Search */}
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
          {isFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pt-6">
        <div className="admin-card-static">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-7 w-7 animate-spin text-brand" />
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">URL</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last updated</th>
                  <th className="w-28 px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      {query ? 'No pages match your search.' : 'No pages yet. Click "New page" to create one.'}
                    </td>
                  </tr>
                )}
                {filtered.map((p: any) => (
                  <tr key={p._id} className="border-b border-border/60 last:border-b-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand/10 text-brand">
                          <FileText className="h-4 w-4" />
                        </span>
                        <span className="font-medium text-sm">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/page/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-brand transition-colors group"
                      >
                        <Globe className="h-3 w-3 group-hover:text-brand" />
                        /page/{p.slug}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {p.status ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                          <ToggleRight className="h-3 w-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-500">
                          <ToggleLeft className="h-3 w-3" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(p.updated_at).toLocaleDateString('en-US', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/page_management/edit/${p._id}`}
                          className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id, p.title)}
                          disabled={deletingId === p._id || isDeleting}
                          className="grid h-8 w-8 place-items-center rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === p._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
