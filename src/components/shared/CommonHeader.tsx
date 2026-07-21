'use client';

import React from 'react';
import { Search, ListFilter, Plus, RefreshCw, Download, Settings2, Trash2, ChevronLeft, X } from 'lucide-react';
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
  onBack?: () => void;
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
  onBack,
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
    <div className="sticky -top-4 lg:-top-6 -mt-4 lg:-mt-6 -mx-4 lg:-mx-6 px-4 lg:px-6 pt-4 lg:pt-6 pb-2 z-20 bg-background space-y-3 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground tracking-tight">
              {title}
            </h1>
            {description && <p className="text-muted-foreground text-sm mt-0.5">{description}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          {extraActions}
          {onAddClick && (
            <Button
              onClick={onAddClick}
              className="flex items-center cursor-pointer gap-2 justify-center bg-brand-gradient text-white h-11 px-5 rounded-lg font-semibold text-sm shadow-md shadow-brand/25 transition-all hover:opacity-95 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              {addLabel}
            </Button>
          )}
        </div>
      </div>

      {(onSearch || onFilter || onExport || onRefresh) && (
        <div className="bg-card/70 border border-border/80 p-4 rounded-xl shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-4 flex-wrap backdrop-blur-xl">
          {onSearch && (
            <div className="flex-1 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <div className="relative flex-1">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Search className="w-4 h-4" />
                </div>
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => onSearch(e.target.value)}
                  className="pl-10 pr-10 py-2 bg-background border-border focus:border-brand/60 focus:ring-2 focus:ring-brand/20 rounded-xl text-sm w-full"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => onSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center p-1.5 hover:bg-accent rounded-full transition-colors"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {searchActions}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            {onFilter && (
              <Button
                variant="outline"
                onClick={onFilter}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-border hover:bg-accent text-foreground transition-all text-sm font-medium"
                disabled={isLoading}
              >
                <ListFilter className="w-4 h-4" />
                Filter
              </Button>
            )}
            {onExport && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-all text-sm font-medium"
                    disabled={isLoading}
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-lg dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                  <DropdownMenuLabel className="text-xs text-neutral-500">Export As</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem onSelect={() => onExport('excel')} className="rounded-md cursor-pointer">
                    Excel (.xlsx)
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem onSelect={() => onExport('csv')} className="rounded-md cursor-pointer">
                    CSV (.csv)
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem onSelect={() => onExport('pdf')} className="rounded-md cursor-pointer">
                    PDF (.pdf)
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {onRefresh && (
              <Button
                onClick={onRefresh}
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-all text-sm font-medium"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
            {selectedCount > 0 && onBulkDelete && (
              <Button
                variant="destructive"
                onClick={onBulkDelete}
                disabled={bulkActionLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected ({selectedCount})
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CommonHeader;
