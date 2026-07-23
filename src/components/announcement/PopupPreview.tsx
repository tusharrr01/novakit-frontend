'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { PopupVariantSettings } from '@/src/lib/announcements';

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

export function PopupPreview({
  variant,
  onClose,
  userName = 'John',
}: {
  variant: PopupVariantSettings;
  onClose: () => void;
  userName?: string;
}) {
  const isDark = useIsDarkMode();
  const accentColor = isDark && variant?.darkAccentColor ? variant.darkAccentColor : (variant?.accentColor || '#7c3aed');

  const titleText = (variant?.title || 'Untitled announcement').replace(/\{name\}/g, userName);
  const bodyText = (variant?.body || '').replace(/\{name\}/g, userName);

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
          style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }}
        />
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="p-6">
          <h3 className="font-display text-xl font-semibold" style={{ color: accentColor }}>
            {titleText}
          </h3>
          {bodyText && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{bodyText}</p>
          )}
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            {variant.ctaLabel && (
              <span
                className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
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
