'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/elements/ui/select';
import { cn } from '@/src/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  formGroupClass?: string;
  labelClass?: string;
  id?: string;
  name?: string;
}

export function SelectField({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select option',
  helperText,
  error,
  disabled = false,
  className,
  triggerClassName,
  formGroupClass,
  labelClass,
  id,
  name,
}: SelectFieldProps) {
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

      <Select
        value={value || undefined}
        onValueChange={(val) => {
          if (val) onChange(val);
        }}
        disabled={disabled}
      >
        <SelectTrigger
          id={inputId}
          className={cn(
            'w-full h-11 rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all',
            error && 'border-red-500 dark:border-red-500',
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          position="popper"
          sideOffset={4}
          className={cn(
            'rounded-lg shadow-xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100',
            'max-h-[min(320px,60vh)] overflow-y-auto'
          )}
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="rounded-lg cursor-pointer focus:bg-indigo-50 dark:focus:bg-neutral-800 focus:text-indigo-600 dark:focus:text-white"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error ? (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-neutral-400 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}

export default SelectField;
