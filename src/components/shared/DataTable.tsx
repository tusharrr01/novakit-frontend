'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Copy, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/src/elements/ui/button';
import { Checkbox } from '@/src/elements/ui/checkbox';
import { Skeleton } from '@/src/elements/ui/skeleton';
import { ConfirmModal } from './ConfirmModal';
import { Pagination } from './Pagination';
import { cn } from '@/src/lib/utils';

export interface ColumnDef<T> {
  id?: string;
  header: string;
  accessorKey?: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  accessor?: (item: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  copyable?: boolean;
  copyField?: keyof T | string;
  sortable?: boolean;
  sortKey?: string;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];

  // Pagination
  page?: number;
  totalPages?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
  tableClassName?: string;
  pagination?: boolean;

  // Actions
  onDelete?: (item: T) => void | Promise<void>;
  onBulkDelete?: (ids: string[]) => void | Promise<void>;
  renderActions?: (row: T) => React.ReactNode;

  // State
  isLoading?: boolean;
  emptyMessage?: string;
  searchTerm?: string;
  isFilterActive?: boolean;

  // ID accessor
  getRowId?: (item: T) => string;

  // Styling / Selection
  minWidth?: string;
  onSelectionChange?: (ids: string[]) => void;
  selectedIds?: string[];
  selectionClassName?: string;
  actionClassName?: string;
  columnClassNames?: string[];

  // Sorting
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export function DataTable<T>({
  data,
  columns,
  page = 1,
  total = 0,
  onPageChange,
  onLimitChange,
  tableClassName,
  pagination = true,
  limit = 10,
  onDelete,
  onBulkDelete,
  isLoading = false,
  emptyMessage = 'No items found.',
  getRowId = (row: T) => (row as any)?._id || (row as any)?.id,
  renderActions,
  onSelectionChange,
  selectionClassName = '',
  actionClassName = '',
  columnClassNames = [],
  selectedIds: controlledSelectedIds,
  onSortChange,
  searchTerm,
  isFilterActive,
}: DataTableProps<T>): React.JSX.Element {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[] | null>(null);
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const selectedIds = controlledSelectedIds !== undefined ? controlledSelectedIds : internalSelectedIds;
  const setSelectedIds = controlledSelectedIds !== undefined && onSelectionChange ? onSelectionChange : setInternalSelectedIds;

  const currentPage = page || 1;
  const totalCount = total || 0;

  const [activeSortKey, setActiveSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrderState] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (!onSortChange) return;
    const newOrder = activeSortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setActiveSortKey(key);
    setSortOrderState(newOrder);
    onSortChange(key, newOrder);
  };

  const getSortIcon = (column: ColumnDef<T>) => {
    if (!column.sortable) return null;
    const key = column.sortKey || (column.accessorKey as string) || column.header;
    if (activeSortKey !== key) {
      return <ChevronsUpDown size={13} className="text-neutral-400 dark:text-neutral-500 shrink-0" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUp size={13} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
    ) : (
      <ChevronDown size={13} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
    );
  };

  const handleCopy = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard');
  };

  const handleDeleteClick = (id: string) => {
    if (onDelete) {
      setDeleteId(id);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteId && onDelete) {
      const item = data.find((row) => getRowId(row) === deleteId);
      if (item) {
        await onDelete(item);
      }
      setDeleteId(null);
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (bulkDeleteIds && bulkDeleteIds.length > 0) {
      if (onBulkDelete) {
        await onBulkDelete(bulkDeleteIds);
      } else if (onDelete) {
        for (const id of bulkDeleteIds) {
          const item = data.find((row) => getRowId(row) === id);
          if (item) {
            await onDelete(item);
          }
        }
      }
      setBulkDeleteIds(null);
      setSelectedIds([]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const ids = data.map((row) => getRowId(row));
      setSelectedIds(ids);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
    setSelectedIds([]);
  };

  useEffect(() => {
    if (onSelectionChange && controlledSelectedIds === undefined) {
      onSelectionChange(internalSelectedIds);
    }
  }, [internalSelectedIds, onSelectionChange, controlledSelectedIds]);

  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < data.length;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  if (data.length === 0 && !isLoading) {
    return (
      <div className="bg-card/70 border border-border/80 p-12 sm:p-20 text-center rounded-xl shadow-sm">
        <p className="text-muted-foreground">
          {searchTerm
            ? `No results match your search: "${searchTerm}"`
            : isFilterActive
              ? 'No results match the active filters.'
              : emptyMessage}
        </p>
      </div>
    );
  }

  const hasDeleteActions = onDelete || onBulkDelete || !!onSelectionChange;
  const showActionsColumn = !!onDelete || !!renderActions;

  return (
    <div className={cn('bg-card/70 border border-border/80 rounded-xl shadow-sm overflow-hidden transition-all', tableClassName)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-card/90 border-b border-border/80 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              {hasDeleteActions && (
                <th className={cn('w-12 px-6 py-4 text-center', selectionClassName)}>
                  <Checkbox
                    checked={allSelected ? true : isIndeterminate ? 'indeterminate' : false}
                    onCheckedChange={(checked) => handleSelectAll(checked === true)}
                  />
                </th>
              )}
              {columns.map((column, index) => {
                const key = column.sortKey || (column.accessorKey as string) || column.header;
                return (
                  <th
                    key={index}
                    className={cn(
                      'px-6 py-4 text-left text-xs font-semibold text-muted-foreground tracking-wider uppercase',
                      column.className,
                      columnClassNames[index],
                      column.sortable && 'cursor-pointer select-none hover:text-foreground'
                    )}
                    onClick={() => column.sortable && handleSort(key)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{column.header}</span>
                      {getSortIcon(column)}
                    </div>
                  </th>
                );
              })}
              {showActionsColumn && (
                <th className={cn('px-6 py-4 text-left text-xs font-semibold text-muted-foreground tracking-wider uppercase', actionClassName)}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading && data.length === 0
              ? Array.from({ length: limit }).map((_, rowIndex) => (
                  <tr key={`skeleton-row-${rowIndex}`} className="animate-pulse">
                    {hasDeleteActions && (
                      <td className={cn('px-6 py-4 text-center', selectionClassName)}>
                        <Skeleton className="w-4 h-4 rounded mx-auto" />
                      </td>
                    )}
                    {columns.map((_, colIndex) => (
                      <td key={`skeleton-col-${colIndex}`} className="px-6 py-4">
                        <Skeleton className={cn('h-4', colIndex === 0 ? 'w-2/3' : 'w-1/2')} />
                      </td>
                    ))}
                    {showActionsColumn && (
                      <td className={cn('px-6 py-4', actionClassName)}>
                        <Skeleton className="w-16 h-8 rounded-lg ml-auto" />
                      </td>
                    )}
                  </tr>
                ))
              : data.map((row, rowIndex) => {
                  const rowId = getRowId(row);
                  const isRowSelected = selectedIds.includes(rowId);
                  return (
                    <tr
                      key={rowIndex}
                      className={cn(
                        'hover:bg-accent/40 transition-colors',
                        isRowSelected && 'bg-brand/10 text-foreground'
                      )}
                    >
                      {hasDeleteActions && (
                        <td className={cn('px-6 py-4 text-center', selectionClassName)}>
                          <Checkbox
                            checked={isRowSelected}
                            onCheckedChange={(checked) => handleSelectOne(rowId, checked === true)}
                          />
                        </td>
                      )}
                      {columns.map((column, colIndex) => {
                        const cellVal = column.cell
                          ? column.cell(row)
                          : column.accessor
                            ? column.accessor(row)
                            : column.accessorKey
                              ? String((row as any)[column.accessorKey] ?? '')
                              : null;

                        const copyVal = column.copyField
                          ? String((row as any)[column.copyField] ?? '')
                          : column.accessorKey
                            ? String((row as any)[column.accessorKey] ?? '')
                            : '';

                        return (
                          <td key={colIndex} className={cn('px-6 py-4 text-sm font-medium text-foreground group/row', column.className, columnClassNames[colIndex])}>
                            <div className="flex items-center gap-2 max-w-xs sm:max-w-md">
                              <div className="truncate">{cellVal}</div>
                              {column.copyable && (
                                <button
                                  type="button"
                                  onClick={(e) => handleCopy(e, copyVal)}
                                  className="p-1 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground opacity-0 group-hover/row:opacity-100 shrink-0"
                                  title="Copy to clipboard"
                                >
                                  <Copy size={12} />
                                </button>
                              )}
                            </div>
                          </td>
                        );
                      })}
                      {showActionsColumn && (
                        <td className={cn('px-6 py-4 text-left', actionClassName)}>
                          <div className="flex items-center justify-start gap-1">
                            {renderActions && renderActions(row)}
                            {onDelete && (
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(rowId)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/15 transition-all cursor-pointer"
                                disabled={isLoading}
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="bg-neutral-50 dark:bg-neutral-800/30 border-t border-neutral-200 dark:border-neutral-800">
          <Pagination
            totalCount={totalCount}
            page={currentPage}
            limit={limit}
            onPageChange={handlePageChange}
            onLimitChange={onLimitChange || (() => {})}
            isLoading={isLoading}
          />
        </div>
      )}

      {onDelete && (
        <ConfirmModal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isLoading}
          title="Delete Item"
          subtitle="Are you sure you want to delete this item? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loadingText="Deleting..."
        />
      )}

      {onBulkDelete && (
        <ConfirmModal
          isOpen={!!bulkDeleteIds}
          onClose={() => setBulkDeleteIds(null)}
          onConfirm={handleConfirmBulkDelete}
          isLoading={isLoading}
          title="Delete Selected Items"
          subtitle={`Are you sure you want to delete ${bulkDeleteIds?.length || 0} selected items? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loadingText="Deleting..."
        />
      )}
    </div>
  );
}
export default DataTable;
