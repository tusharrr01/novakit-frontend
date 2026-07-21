'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  helperText?: string;
  error?: string;
  formGroupClass?: string;
  labelClass?: string;
}

export function TextInput({
  label,
  icon: Icon,
  helperText,
  error,
  formGroupClass,
  labelClass,
  type = 'text',
  className,
  id,
  name,
  ...props
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name;
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

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

      <div className="relative w-full">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none">
            <Icon size={16} />
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={resolvedType}
          className={cn(
            'w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors placeholder:text-neutral-400',
            Icon && 'pl-10',
            isPassword && 'pr-10',
            error && 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500',
            className
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error ? (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-neutral-400 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}

export default TextInput;
