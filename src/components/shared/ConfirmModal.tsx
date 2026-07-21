import React from 'react';
import { AlertCircle, Trash2, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/elements/ui/alert-dialog';
import { Button } from '@/src/elements/ui/button';
import { cn } from '@/src/lib/utils';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success' | 'info';
  showIcon?: boolean;
  showCancelButton?: boolean;
  loadingText?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = 'Are you sure?',
  subtitle,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  showIcon = true,
  showCancelButton = true,
  loadingText,
}: ConfirmModalProps) {
  const modalSubtitle = subtitle || description || 'This action cannot be undone.';

  const getVariantConfig = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: AlertCircle,
          iconBgColor: 'bg-red-100 text-red-600 dark:bg-red-950/90 dark:text-red-400 border border-red-200/60 dark:border-red-900/50',
          iconColor: 'text-red-600 dark:text-red-400',
          buttonColor: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-md shadow-destructive/20',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconBgColor: 'bg-amber-100 text-amber-600 dark:bg-amber-950/90 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/50',
          iconColor: 'text-amber-600 dark:text-amber-400',
          buttonColor: 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20',
        };
      case 'success':
        return {
          icon: CheckCircle,
          iconBgColor: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/90 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/50',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          buttonColor: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20',
        };
      case 'info':
        return {
          icon: Info,
          iconBgColor: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/90 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/50',
          iconColor: 'text-indigo-600 dark:text-indigo-400',
          buttonColor: 'bg-brand-gradient text-white shadow-md shadow-brand/20',
        };
      default:
        return {
          icon: Trash2,
          iconBgColor: 'bg-red-100 text-red-600 dark:bg-red-950/90 dark:text-red-400 border border-red-200/60 dark:border-red-900/50',
          iconColor: 'text-red-600 dark:text-red-400',
          buttonColor: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-md shadow-destructive/20',
        };
    }
  };

  const config = getVariantConfig();
  const IconComponent = config.icon;

  return (
    <AlertDialog open={isOpen} onOpenChange={!isLoading ? onClose : undefined}>
      <AlertDialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] rounded-2xl p-6 pt-10 bg-card border border-border/80 shadow-2xl overflow-visible transition-all">
        {showIcon && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center border-4 border-card shadow-lg transition-transform',
                config.iconBgColor
              )}
            >
              <IconComponent className={cn('w-8 h-8 stroke-[2.2]', config.iconColor)} />
            </div>
          </div>
        )}
        <AlertDialogHeader className="text-center space-y-2 relative pt-3">
          <AlertDialogTitle className="text-xl font-bold font-display text-center text-foreground tracking-tight">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm text-center font-normal leading-relaxed">
            {modalSubtitle}
          </AlertDialogDescription>
          {isLoading && loadingText && (
            <div className="text-xs font-medium text-brand mt-2 text-center">{loadingText}</div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2.5 mt-6">
          {showCancelButton && (
            <Button
              onClick={onClose}
              disabled={isLoading}
              variant="outline"
              className="w-full h-10 rounded-xl border-border hover:bg-accent text-foreground font-medium text-sm transition-all"
            >
              {cancelText}
            </Button>
          )}
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn('w-full h-10 rounded-xl font-medium text-sm transition-all cursor-pointer', config.buttonColor)}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {loadingText || 'Confirming...'}
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ConfirmDeleteModal({
  title = 'Delete item?',
  description = 'This action cannot be undone. This item will be permanently removed.',
  onConfirm,
  onCancel,
  confirmLabel = 'Delete',
  isLoading = false,
}: {
  title?: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmLabel?: string;
  isLoading?: boolean;
}) {
  return (
    <ConfirmModal
      isOpen={true}
      title={title}
      subtitle={description}
      confirmText={confirmLabel}
      variant="danger"
      isLoading={isLoading}
      onClose={onCancel}
      onConfirm={onConfirm}
    />
  );
}

export default ConfirmModal;
