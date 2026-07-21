'use client';

import React from 'react';
import { X } from 'lucide-react';
import type { PopupVariantSettings } from '@/src/lib/announcements';

export function PopupPreview({
  variant,
  onClose,
}: {
  variant: PopupVariantSettings;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(90deg, ${variant.accentColor}, ${variant.accentColor}88)` }}
        />
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
        {variant.imageUrl && (
          <img src={variant.imageUrl} alt="" className="h-40 w-full object-cover" />
        )}
        <div className="p-6">
          <h3 className="font-display text-xl font-semibold" style={{ color: variant.accentColor }}>
            {variant.title || 'Untitled announcement'}
          </h3>
          {variant.body && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{variant.body}</p>
          )}
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            {variant.dismissible && (
              <button onClick={onClose} className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium">
                Not now
              </button>
            )}
            {variant.ctaLabel && (
              <span
                className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white"
                style={{
                  background: `linear-gradient(135deg, ${variant.accentColor}, ${variant.accentColor}cc)`,
                }}
              >
                {variant.ctaLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
