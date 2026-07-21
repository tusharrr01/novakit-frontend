'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { DesignDetailBody } from './design-detail-body';
import { getDesign, type DesignRow } from '@/src/lib/designs-db';

export function DesignPreviewModal({
  slug,
  onClose,
}: {
  slug: string | null;
  onClose: () => void;
}) {
  const open = !!slug;
  const [design, setDesign] = useState<DesignRow | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) {
      setDesign(null);
      return;
    }
    setLoading(true);
    getDesign(slug)
      .then((d) => setDesign(d))
      .catch(() => setDesign(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <button
        type="button"
        aria-label="Close preview"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
      />
      <div className="relative flex h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border-t border-border bg-background shadow-2xl animate-sheet-up sm:h-[94vh] sm:max-w-[1400px]">
        <div className="shrink-0 border-b border-border">
          <div className="mx-auto my-2 h-1 w-10 rounded-full bg-border" />
          <div className="flex items-center justify-between px-4 pb-3 sm:px-6">
            <div className="min-w-0">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Design preview
              </div>
              <div className="truncate text-sm font-medium">
                {design?.name ?? (loading ? 'Loading…' : 'Design')}
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full border border-border bg-card p-2 hover:bg-accent"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">
          {loading || !design ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <DesignDetailBody design={design} />
          )}
        </div>
      </div>
    </div>
  );
}
