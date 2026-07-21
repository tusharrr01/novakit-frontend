import React from 'react';
import { Filter, Pencil } from 'lucide-react';
import type { Faq } from '@/src/lib/site-content';
import { DataTable, ColumnDef } from '@/src/components/shared/DataTable';
import { CommonHeader } from '@/src/components/shared/CommonHeader';

export function FaqList({
  filtered,
  totalCount,
  query,
  setQuery,
  category,
  setCategory,
  categories,
  publishedFilter,
  setPublishedFilter,
  onAdd,
  onEdit,
  onDelete,
  onExport,
}: {
  filtered: Faq[];
  totalCount: number;
  query: string;
  setQuery: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  categories: string[];
  publishedFilter: 'All' | 'Published' | 'Draft';
  setPublishedFilter: (v: 'All' | 'Published' | 'Draft') => void;
  onAdd: () => void;
  onEdit: (item: Faq) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
}) {
  const columns: ColumnDef<Faq>[] = [
    {
      header: 'Order',
      accessorKey: 'order',
      cell: (row) => <span className="font-mono text-xs text-neutral-500">#{row.order}</span>,
    },
    {
      header: 'Question',
      cell: (row) => (
        <div className="max-w-lg">
          <div className="font-semibold text-neutral-900 dark:text-neutral-100">{row.question}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">{row.answer}</div>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (row) => <span className="text-sm font-medium text-brand">{row.category}</span>,
    },
    {
      header: 'Status',
      cell: (row) => (
        <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${
          row.published ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
        }`}>
          {row.published ? 'Published' : 'Draft'}
        </span>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <CommonHeader
        title="FAQs"
        description={`${filtered.length} of ${totalCount} questions · edit display order values`}
        onSearch={setQuery}
        searchTerm={query}
        searchPlaceholder="Search questions…"
        onAddClick={onAdd}
        addLabel="Add FAQ"
        onExport={() => onExport()}
      />

      <div className="shrink-0 space-y-6">
        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-2 admin-card-static p-3">
          <div className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent text-xs outline-none font-medium"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1">
            <select
              value={publishedFilter}
              onChange={(e) => setPublishedFilter(e.target.value as typeof publishedFilter)}
              className="bg-transparent text-xs outline-none font-medium"
            >
              <option value="All">All statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <DataTable
          data={filtered}
          columns={columns}
          onDelete={(row) => onDelete(row.id)}
          renderActions={(row) => (
            <button
              onClick={() => onEdit(row)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:border-brand/40 hover:text-brand"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          pagination={false}
          getRowId={(row) => row.id}
        />
      </div>
    </div>
  );
}
export default FaqList;
