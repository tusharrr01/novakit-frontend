import { ArrowLeft } from 'lucide-react';
import type React from 'react';

export function PageShell({
  eyebrow,
  title,
  subtitle,
  onBack,
  actions,
  children,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  onBack: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {eyebrow}
            </div>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
      <div className="mt-6 min-h-0 flex-1 overflow-y-auto thin-scrollbar pr-1 pb-4">
        {children}
      </div>
    </div>
  );
}
