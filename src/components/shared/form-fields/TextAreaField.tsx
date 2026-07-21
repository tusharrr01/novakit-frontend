'use client';

import React from 'react';
import { cn } from '@/src/lib/utils';

export interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  formGroupClass?: string;
  labelClass?: string;
}

export function TextAreaField({
  label,
  helperText,
  error,
  formGroupClass,
  labelClass,
  className,
  id,
  name,
  rows = 4,
  ...props
}: TextAreaFieldProps) {
  const inputId = id || name;

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', formGroupClass)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 select-none',
            labelClass
          )}
        >
          {label}
        </label>
      )}

      <textarea
        id={inputId}
        name={name}
        rows={rows}
        className={cn(
          'w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors placeholder:text-neutral-400 resize-y',
          error && 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500',
          className
        )}
        {...props}
      />

      {error ? (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-neutral-400 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}

export default TextAreaField;
