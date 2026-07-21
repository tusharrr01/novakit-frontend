# Frontend Initial Setup & Shared Component Specifications (`steps.md`)

This document provides a step-by-step guide to setting up a new Next.js 16 frontend project from an empty directory, followed by complete code specifications for all core shared components. AI agents must build these shared components first before building feature-specific pages.

---

## Part 1: Step-by-Step Initial Setup Guide

### Step 1: Initialize Next.js 16 App Router
```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbo
```

### Step 2: Install Core Dependencies
```bash
npm install @reduxjs/toolkit react-redux next-auth lucide-react clsx tailwind-merge formik yup sonner next-themes @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-alert-dialog @radix-ui/react-select @radix-ui/react-label
```

### Step 3: Configure Folder Architecture
Create the required directory layout:
```
src/
├── app/
│   ├── (mainLayout)/
│   ├── admin/
│   ├── api/
│   ├── auth/
│   └── layout.tsx
├── components/
│   ├── shared/
│   │   └── form-fields/
│   └── {entity_name}/ (e.g. template, design, service, faq, testimonial)
├── layout/
├── lib/
├── redux/
│   └── api/
├── utils/
└── proxy.ts
```

---

## Part 2: Shared Component Code Specifications

AI agents must implement the following reusable components first.

### 1. `src/proxy.ts` (Next.js 16 Route Protection Middleware)
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'supersecret_nextauth_987654321' });
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!token;

  // Role-based auth redirect
  const isAuthPage = pathname.startsWith('/auth');
  if (isAuthPage && isAuthenticated) {
    const callbackUrl = req.nextUrl.searchParams.get('callbackUrl');
    if (callbackUrl && callbackUrl.startsWith('/')) {
      return NextResponse.redirect(new URL(callbackUrl, req.url));
    }
    const role = token?.role?.toString().toLowerCase();
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Define protected pages that require authentication
  const isProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/profile') || pathname.startsWith('/orders');

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Centralized Admin role guard
  if (pathname.startsWith('/admin') && isAuthenticated) {
    const role = token?.role?.toString().toLowerCase();
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|otf|css|js)).*)',
  ],
};
```

---

### 2. `src/components/shared/DataTable.tsx`
```tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Copy, Check } from 'lucide-react';

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  sortKey?: string;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  renderActions?: (row: T) => React.ReactNode;
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  getRowId?: (row: T) => string;
  emptyMessage?: string;
  pagination?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  selectedIds = [],
  onSelectionChange,
  renderActions,
  onSortChange,
  getRowId = (row) => row.id || row._id,
  emptyMessage = 'No records found.',
}: DataTableProps<T>): React.JSX.Element {
  const [currentSortKey, setCurrentSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const allIds = data.map(getRowId);
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(allIds);
    }
  };

  const handleSelectRow = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((item) => item !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleSort = (sortKey: string) => {
    let nextOrder: 'asc' | 'desc' = 'asc';
    if (currentSortKey === sortKey && sortOrder === 'asc') {
      nextOrder = 'desc';
    }
    setCurrentSortKey(sortKey);
    setSortOrder(nextOrder);
    if (onSortChange) {
      onSortChange(sortKey, nextOrder);
    }
  };

  const copyRowData = (row: T, e: React.MouseEvent) => {
    e.stopPropagation();
    const id = getRowId(row);
    navigator.clipboard.writeText(JSON.stringify(row, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            <tr>
              {onSelectionChange && (
                <th className="w-10 px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col, idx) => {
                const key = (col.sortKey || col.accessorKey || idx) as string;
                const isSorted = currentSortKey === key;
                return (
                  <th key={idx} className={`px-4 py-3.5 ${col.className || ''}`}>
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(key)}
                        className="inline-flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white"
                      >
                        {col.header}
                        {isSorted ? (
                          sortOrder === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-indigo-500" /> : <ChevronDown className="h-3.5 w-3.5 text-indigo-500" />
                        ) : (
                          <ChevronsUpDown className="h-3.5 w-3.5 text-neutral-400 opacity-60" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {data.length > 0 ? (
              data.map((row) => {
                const rowId = getRowId(row);
                const isSelected = selectedIds.includes(rowId);
                return (
                  <tr key={rowId} className={`transition-colors hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 ${isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''}`}>
                    {onSelectionChange && (
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowId)}
                          className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col, idx) => (
                      <td key={idx} className={`px-4 py-3.5 ${col.className || ''}`}>
                        {col.cell ? col.cell(row) : col.accessorKey ? row[col.accessorKey] : null}
                      </td>
                    ))}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => copyRowData(row, e)}
                          title="Copy Row Data"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                        >
                          {copiedId === rowId ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        {renderActions && renderActions(row)}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + (onSelectionChange ? 2 : 1)} className="px-4 py-12 text-center text-sm text-neutral-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
```

---

### 3. `src/components/shared/CommonHeader.tsx`
```tsx
'use client';

import React from 'react';
import { Search, ListFilter, Plus, RefreshCw, Download, Trash2 } from 'lucide-react';
import { Button } from '@/src/elements/ui/button';
import { Input } from '@/src/elements/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/elements/ui/dropdown-menu';

export interface CommonHeaderProps {
  title: string;
  description?: string;
  onSearch?: (value: string) => void;
  searchTerm?: string;
  searchPlaceholder?: string;
  onFilter?: () => void;
  onRefresh?: () => void;
  onExport?: (format: 'excel' | 'csv' | 'pdf') => void;
  onAddClick?: () => void;
  addLabel?: string;
  isLoading?: boolean;
  selectedCount?: number;
  onBulkDelete?: () => void;
  bulkActionLoading?: boolean;
  extraActions?: React.ReactNode;
  searchActions?: React.ReactNode;
}

export function CommonHeader({
  title,
  description,
  onSearch,
  searchTerm = '',
  searchPlaceholder = 'Search...',
  onFilter,
  onRefresh,
  onExport,
  onAddClick,
  addLabel = 'Add New',
  isLoading = false,
  selectedCount = 0,
  onBulkDelete,
  bulkActionLoading = false,
  extraActions,
  searchActions,
}: CommonHeaderProps) {
  return (
    <div className="space-y-6 pt-0 mb-5 sm:mb-2 py-4 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1">{title}</h1>
          {description && <p className="text-neutral-500 dark:text-neutral-400 text-sm">{description}</p>}
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          {extraActions}
          {onAddClick && (
            <Button onClick={onAddClick} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm">
              <Plus className="w-4 h-4" />
              {addLabel}
            </Button>
          )}
        </div>
      </div>

      {(onSearch || onFilter || onExport || onRefresh) && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-4 flex-wrap">
          {onSearch && (
            <div className="flex-1 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => onSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-indigo-500 rounded-lg text-sm w-full"
                />
              </div>
              {searchActions}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            {onFilter && (
              <Button variant="outline" onClick={onFilter} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 text-sm">
                <ListFilter className="w-4 h-4" /> Filter
              </Button>
            )}
            {onExport && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={isLoading} className="flex items-center gap-2 px-4 py-2 text-sm">
                    <Download className="w-4 h-4" /> Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-lg dark:bg-neutral-900">
                  <DropdownMenuLabel className="text-xs text-neutral-500">Export As</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem onSelect={() => onExport('excel')}>Excel (.xlsx)</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem onSelect={() => onExport('csv')}>CSV (.csv)</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem onSelect={() => onExport('pdf')}>PDF (.pdf)</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm">
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
              </Button>
            )}
            {selectedCount > 0 && onBulkDelete && (
              <Button variant="destructive" onClick={onBulkDelete} disabled={bulkActionLoading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
                <Trash2 className="w-4 h-4" /> Delete Selected ({selectedCount})
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CommonHeader;
```

---

### 4. `src/components/shared/ConfirmModal.tsx`
```tsx
'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmModalProps {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{title}</h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className="rounded-lg bg-rose-600 hover:bg-rose-700 px-4 py-2 text-sm font-medium text-white shadow-sm">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
```

---

### 5. `src/components/shared/Pagination.tsx`
```tsx
'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  totalRecords?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  totalRecords,
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-500 dark:text-neutral-400">
      <div className="flex items-center gap-3">
        {totalRecords !== undefined && <span>Showing {totalRecords} records</span>}
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded px-2 py-1 outline-none text-neutral-900 dark:text-white"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span>Page {currentPage} of {totalPages || 1}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
```

---

### 6. `src/components/shared/ExportModal.tsx`
```tsx
'use client';

import React from 'react';
import { FileDown, Printer, FileSpreadsheet, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/src/elements/ui/alert-dialog';
import { Button } from '@/src/elements/ui/button';

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'excel' | 'csv' | 'pdf') => void | Promise<void>;
  title?: string;
  description?: string;
  selectedCount?: number;
}

export function ExportModal({
  isOpen,
  onClose,
  onExport,
  title = 'Export Data',
  description = 'Choose your preferred format to export the data.',
  selectedCount,
}: ExportModalProps) {
  const options = [
    { id: 'excel', title: 'Excel Spreadsheet', description: 'Download data in standard .xlsx format', icon: FileSpreadsheet, color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-950/20' },
    { id: 'csv', title: 'CSV Document', description: 'Download data in plain text comma-separated format', icon: FileDown, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-950/20' },
    { id: 'pdf', title: 'PDF Document', description: 'Export list in formatted print-ready PDF layout', icon: Printer, color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-950/20' },
  ];

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="p-0 max-h-[90dvh] overflow-y-auto border-none bg-white dark:bg-neutral-900 shadow-2xl">
        <div className="sm:p-6 p-4 pb-0 space-y-6">
          <AlertDialogHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <AlertDialogTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-50">{title}</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-neutral-500 mt-1">{description} {selectedCount !== undefined && `(${selectedCount} items selected)`}</AlertDialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full"><X size={18} /></Button>
          </AlertDialogHeader>
          <div className="grid gap-3">
            {options.map((option) => (
              <button key={option.id} onClick={() => onExport(option.id as any)} className="flex items-center gap-4 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition text-left group w-full">
                <div className={`w-12 h-12 rounded-lg ${option.bgColor} flex items-center justify-center shrink-0`}><option.icon className={`w-6 h-6 ${option.color}`} /></div>
                <div className="flex-1">
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-50 group-hover:text-indigo-600 transition-colors text-base">{option.title}</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <AlertDialogFooter className="bg-neutral-50 dark:bg-neutral-800/20 p-4 shrink-0 sm:flex-row flex-col gap-2 mt-6">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto h-11">Cancel</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ExportModal;
```

---

### 7. Form Fields (`src/components/shared/form-fields/`)

#### `TextInput.tsx`
```tsx
'use client';

import React from 'react';
import { FieldHookConfig, useField } from 'formik';

interface TextInputProps extends FieldHookConfig<string> {
  label: string;
  placeholder?: string;
  type?: string;
}

export function TextInput({ label, ...props }: TextInputProps) {
  const [field, meta] = useField(props);
  const showError = Boolean(meta.touched && meta.error);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{label}</label>
      <input
        {...field}
        type={props.type || 'text'}
        placeholder={props.placeholder}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800/50 outline-none transition ${
          showError ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-neutral-200 dark:border-neutral-700 focus:border-indigo-500'
        }`}
      />
      {showError && <p className="text-xs text-rose-500">{meta.error}</p>}
    </div>
  );
}

export default TextInput;
```

#### `TextAreaField.tsx`
```tsx
'use client';

import React from 'react';
import { FieldHookConfig, useField } from 'formik';

interface TextAreaProps extends FieldHookConfig<string> {
  label: string;
  placeholder?: string;
  rows?: number;
}

export function TextAreaField({ label, rows = 4, ...props }: TextAreaProps) {
  const [field, meta] = useField(props);
  const showError = Boolean(meta.touched && meta.error);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{label}</label>
      <textarea
        {...field}
        rows={rows}
        placeholder={props.placeholder}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800/50 outline-none transition ${
          showError ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-neutral-200 dark:border-neutral-700 focus:border-indigo-500'
        }`}
      />
      {showError && <p className="text-xs text-rose-500">{meta.error}</p>}
    </div>
  );
}

export default TextAreaField;
```

#### `SelectField.tsx`
```tsx
'use client';

import React from 'react';
import { FieldHookConfig, useField } from 'formik';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends FieldHookConfig<string> {
  label: string;
  options: SelectOption[];
}

export function SelectField({ label, options, ...props }: SelectProps) {
  const [field, meta] = useField(props);
  const showError = Boolean(meta.touched && meta.error);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{label}</label>
      <select
        {...field}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800/50 outline-none transition ${
          showError ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-neutral-200 dark:border-neutral-700 focus:border-indigo-500'
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {showError && <p className="text-xs text-rose-500">{meta.error}</p>}
    </div>
  );
}

export default SelectField;
```

---

## Part 3: Entity Isolation Patterns (RTK Query & BFF Proxy)

### 1. RTK Query API Slice Pattern (`src/redux/api/{entity}Api.ts`)
```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const templateApi = createApi({
  reducerPath: 'templateApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/templates' }), // Calls Next.js BFF endpoint
  tagTypes: ['Template'],
  endpoints: (builder) => ({
    getTemplates: builder.query({
      query: (params) => ({ url: '', params }),
      providesTags: ['Template'],
    }),
    getTemplateBySlug: builder.query({
      query: (slug) => `/${slug}`,
      providesTags: ['Template'],
    }),
    createTemplate: builder.mutation({
      query: (body) => ({ url: '/create', method: 'POST', body }),
      invalidatesTags: ['Template'],
    }),
    updateTemplate: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/edit/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Template'],
    }),
    deleteTemplate: builder.mutation({
      query: (id) => ({ url: `/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Template'],
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useGetTemplateBySlugQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
} = templateApi;
```

### 2. Next.js BFF Handler Pattern (`src/app/api/{entity}/[...path]/route.ts` or `bff-proxy.ts`)
```typescript
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/src/app/api/auth/[...nextauth]/route';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function proxyToBackend(req: NextRequest, targetPath: string) {
  try {
    const session: any = await getServerSession(authOptions);
    const token = session?.accessToken as string;

    const url = new URL(req.url);
    const search = url.search;
    const backendEndpoint = `${BACKEND_URL}${targetPath.startsWith('/') ? targetPath : '/' + targetPath}${search}`;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    let body: any = undefined;
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      try { body = await req.json(); } catch { }
    }

    const response = await fetch(backendEndpoint, {
      method: req.method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      cache: 'no-store',
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'BFF proxy error' }, { status: 500 });
  }
}
```
