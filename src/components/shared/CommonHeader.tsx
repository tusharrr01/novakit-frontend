'use client';

import React from 'react';
import { Search, ListFilter, Plus, RefreshCw, Download, Settings2, Trash2 } from 'lucide-react';
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1">
            {title}
          </h1>
          {description && <p className="text-neutral-500 dark:text-neutral-400 text-sm">{description}</p>}
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          {extraActions}
          {onAddClick && (
            <Button
              onClick={onAddClick}
              className="flex items-center cursor-pointer gap-2 justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all active:scale-95 font-semibold text-sm"
            >
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
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none">
                  <Search className="w-4 h-4" />
                </div>
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => onSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-0 rounded-lg text-sm w-full"
                />
              </div>
              {searchActions}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            {onFilter && (
              <Button
                variant="outline"
                onClick={onFilter}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-all text-sm font-medium"
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
