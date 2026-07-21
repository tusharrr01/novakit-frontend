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
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 flex-wrap border-t border-border/80 bg-card/70 backdrop-blur-md', className)}>
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
            Rows per page
          </span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => onLimitChange(Number(value))}
            disabled={isLoading}
          >
            <SelectTrigger className="w-20 h-9 text-xs font-medium rounded-xl bg-background border-border focus:ring-2 focus:ring-brand/20">
              <SelectValue placeholder={limit.toString()} />
            </SelectTrigger>
            <SelectContent align="start" className="min-w-20 rounded-xl shadow-xl bg-card border-border">
              {limitOptions.map((option) => (
                <SelectItem
                  key={option}
                  value={option.toString()}
                  className="rounded-lg cursor-pointer focus:bg-brand/10 focus:text-brand text-xs"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="h-4 w-px bg-border hidden sm:block" />
        <div className="text-xs font-medium text-muted-foreground">
          Showing <span className="text-foreground font-semibold">{startEntry}</span> to <span className="text-foreground font-semibold">{endEntry}</span> of <span className="text-foreground font-semibold">{totalCount}</span> results
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isLoading}
          className="h-9 w-9 p-0 rounded-xl bg-background border-border hover:bg-accent text-muted-foreground hover:text-foreground disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1.5">
          {getPageNumbers().map((p, index) =>
            p === '...' ? (
              <div key={index} className="w-9 h-9 flex items-center justify-center text-xs text-muted-foreground">
                ...
              </div>
            ) : (
              <Button
                key={index}
                variant={page === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(Number(p))}
                disabled={isLoading}
                className={cn(
                  'h-9 w-9 p-0 rounded-xl text-xs font-medium transition-all',
                  page === p
                    ? 'bg-brand-gradient text-white border-0 shadow-md shadow-brand/20 font-bold'
                    : 'bg-background border-border text-muted-foreground hover:bg-accent hover:text-foreground'
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
          className="h-9 w-9 p-0 rounded-xl bg-background border-border hover:bg-accent text-muted-foreground hover:text-foreground disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
export default Pagination;
