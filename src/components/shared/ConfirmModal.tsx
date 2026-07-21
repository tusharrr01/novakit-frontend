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

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
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
  subtitle = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  showIcon = true,
  showCancelButton = true,
  loadingText,
}: ConfirmModalProps) {
  const getVariantConfig = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: AlertCircle,
          iconBgColor: 'bg-red-100 dark:bg-red-950/30',
          iconColor: 'text-red-600 dark:text-red-400',
          buttonColor: 'bg-red-600 hover:bg-red-700 dark:bg-red-750 dark:hover:bg-red-800',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconBgColor: 'bg-yellow-100 dark:bg-yellow-950/30',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
        };
      case 'success':
        return {
          icon: CheckCircle,
          iconBgColor: 'bg-green-100 dark:bg-green-950/30',
          iconColor: 'text-green-600 dark:text-green-400',
          buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
        };
      case 'info':
        return {
          icon: Info,
          iconBgColor: 'bg-blue-100 dark:bg-blue-950/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
        };
      default:
        return {
          icon: Trash2,
          iconBgColor: 'bg-red-100 dark:bg-red-950/30',
          iconColor: 'text-red-600 dark:text-red-400',
          buttonColor: 'bg-red-600 hover:bg-red-700',
        };
    }
  };

  const config = getVariantConfig();
  const IconComponent = config.icon;

  return (
    <AlertDialog open={isOpen} onOpenChange={!isLoading ? onClose : undefined}>
      <AlertDialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] rounded-lg sm:p-6 p-4">
        <AlertDialogHeader className="text-center space-y-4 relative">
          {showIcon && (
            <div className="flex justify-center mx-auto mb-2">
              <div className={`${config.iconBgColor} rounded-full p-3 w-16 h-16 flex items-center justify-center`}>
                <IconComponent className={`${config.iconColor} w-10 h-10`} />
              </div>
            </div>
          )}
          <AlertDialogTitle className="text-xl font-semibold text-center text-neutral-900 dark:text-neutral-100">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-500 dark:text-neutral-400 text-sm text-center">
            {subtitle}
          </AlertDialogDescription>
          {isLoading && loadingText && (
            <div className="text-sm text-neutral-500 mt-2 text-center">{loadingText}</div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
          {showCancelButton && (
            <Button
              onClick={onClose}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {cancelText}
            </Button>
          )}
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`${config.buttonColor} text-white w-full`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
export default ConfirmModal;
