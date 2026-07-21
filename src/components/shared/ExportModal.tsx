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
  description = 'Choose your preferred format to export the listing data.',
  selectedCount,
}: ExportModalProps) {
  const options = [
    {
      id: 'excel',
      title: 'Excel Spreadsheet',
      description: 'Download data in standard .xlsx Excel sheet format',
      icon: FileSpreadsheet,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    },
    {
      id: 'csv',
      title: 'CSV Document',
      description: 'Download data in plain text comma-separated format',
      icon: FileDown,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      id: 'pdf',
      title: 'PDF Document',
      description: 'Export list in formatted print-ready PDF layout',
      icon: Printer,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    },
  ];

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="p-0 max-h-[90dvh] overflow-y-auto border-none bg-white dark:bg-neutral-900 shadow-2xl">
        <div className="sm:p-6 p-4 pb-0 space-y-6">
          <AlertDialogHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <AlertDialogTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-50 text-left">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-left text-neutral-500 mt-1">
                {description} {selectedCount !== undefined && `(${selectedCount} items selected)`}
              </AlertDialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
              <X size={18} />
            </Button>
          </AlertDialogHeader>

          <div className="grid gap-3">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => onExport(option.id as any)}
                className="flex items-center gap-4 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 bg-neutral-50 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition-all text-left group w-full"
              >
                <div className={`w-12 h-12 rounded-lg ${option.bgColor} flex items-center justify-center shrink-0`}>
                  <option.icon className={`w-6 h-6 ${option.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-base">
                    {option.title}
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {option.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <AlertDialogFooter className="bg-neutral-50 dark:bg-neutral-800/20 p-4 shrink-0 sm:flex-row flex-col gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto h-11 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300"
          >
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ExportModal;
