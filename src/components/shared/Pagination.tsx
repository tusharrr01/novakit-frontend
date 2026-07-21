'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/src/elements/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/elements/ui/select';
import { cn } from '@/src/lib/utils';

export interface PaginationProps {
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  className?: string;
  isLoading?: boolean;
}

export function Pagination({
  totalCount,
  page,
  limit,
  onPageChange,
  onLimitChange,
  className,
  isLoading,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const startEntry = totalCount > 0 ? (page - 1) * limit + 1 : 0;
  const endEntry = Math.min(page * limit, totalCount);

  const limitOptions = [10, 20, 25, 50];

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (page > totalPages - 4) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 flex-wrap', className)}>
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
            Rows per page
          </span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => onLimitChange(Number(value))}
            disabled={isLoading}
          >
            <SelectTrigger className="w-18 h-9 text-sm rounded-lg bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 shadow-sm focus:ring-indigo-500/10">
              <SelectValue placeholder={limit.toString()} />
            </SelectTrigger>
            <SelectContent align="start" className="min-w-20 rounded-lg shadow-xl dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
              {limitOptions.map((option) => (
                <SelectItem
                  key={option}
                  value={option.toString()}
                  className="rounded-lg cursor-pointer focus:bg-indigo-50 dark:focus:bg-neutral-800 focus:text-indigo-600 dark:focus:text-white"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />
        <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          Showing <span className="text-neutral-950 dark:text-white">{startEntry}</span> to <span className="text-neutral-950 dark:text-white">{endEntry}</span> of <span className="text-neutral-950 dark:text-white">{totalCount}</span> results
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isLoading}
          className="h-9 w-9 p-0 rounded-lg bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-250 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1.5">
          {getPageNumbers().map((p, index) =>
            p === '...' ? (
              <div key={index} className="w-9 h-9 flex items-center justify-center text-neutral-400">
                ...
              </div>
            ) : (
              <Button
                key={index}
                variant={page === p ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(Number(p))}
                disabled={isLoading}
                className={cn(
                  'h-9 w-9 p-0 rounded-lg text-sm font-medium transition-all',
                  page === p
                    ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-500 dark:border-indigo-500/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                    : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white'
                )}
              >
                {p}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || isLoading}
          className="h-9 w-9 p-0 rounded-lg bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-250 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
export default Pagination;
