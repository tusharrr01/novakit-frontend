'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/elements/ui/select';
import { cn } from '@/src/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface SelectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
}

export function SelectDropdown({
  value,
  onChange,
  options,
  label,
  placeholder,
  icon,
  className,
  triggerClassName,
  contentClassName,
  disabled = false,
}: SelectDropdownProps) {
  const formattedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const selectedOption = formattedOptions.find((o) => o.value === value);

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          'h-9 text-xs font-medium rounded-xl bg-background border-border shadow-xs focus:ring-2 focus:ring-brand/20 transition-all flex items-center gap-2 cursor-pointer',
          className,
          triggerClassName
        )}
      >
        <div className="flex items-center gap-1.5 overflow-hidden truncate">
          {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
          {label && <span className="text-muted-foreground font-normal shrink-0">{label}:</span>}
          <SelectValue placeholder={placeholder || label || 'Select option'}>
            {selectedOption ? (
              <span className="flex items-center gap-1.5 truncate">
                {selectedOption.icon}
                <span>{selectedOption.label}</span>
              </span>
            ) : null}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent align="start" className={cn('min-w-[120px] rounded-xl shadow-xl bg-card border-border z-50', contentClassName)}>
        {formattedOptions.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="rounded-lg cursor-pointer focus:bg-brand/10 focus:text-brand text-xs font-medium flex items-center gap-2 py-2"
          >
            <div className="flex items-center gap-2">
              {opt.icon}
              <span>{opt.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  icon,
  className,
}: {
  label: string;
  value: string;
  options: (string | SelectOption)[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <SelectDropdown
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      icon={icon}
      className={className}
    />
  );
}

export default SelectDropdown;
