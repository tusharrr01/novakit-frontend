'use client';

import React from 'react';
import { Megaphone, Eye, X, Type, Play, Palette, RotateCcw } from 'lucide-react';
import type { AnnouncementsSettings } from '@/src/lib/announcements';
import { Toggle, CheckboxRow, LabeledTextarea, LabeledInput, LabeledColor, LabeledSlider } from './FormElements';

export function MarqueeEditor({
  draft,
  setDraft,
}: {
  draft: AnnouncementsSettings;
  setDraft: (v: AnnouncementsSettings) => void;
}) {
  const m = draft.marquee;
  const patch = (p: Partial<typeof m>) => setDraft({ ...draft, marquee: { ...m, ...p } });

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Status & visibility */}
      <div className="admin-card p-5 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand/10 text-brand">
              <Megaphone className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold">Status & visibility</h3>
              <p className="text-xs text-muted-foreground">Turn the marquee on or off and choose where it appears.</p>
            </div>
          </div>
          <Toggle checked={m.enabled} onChange={(v) => patch({ enabled: v })} label="Enabled" />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <CheckboxRow
            checked={m.showOnLanding}
            onChange={(v) => patch({ showOnLanding: v })}
            label="Show on landing page"
          />
          <CheckboxRow
            checked={m.showOnShop}
            onChange={(v) => patch({ showOnShop: v })}
            label="Show on shop / products page"
          />
          <CheckboxRow
            checked={m.dismissible}
            onChange={(v) => patch({ dismissible: v })}
            label="Show close (X) button"
          />
        </div>
      </div>

      {/* Live preview */}
      <div className="admin-card p-5 lg:col-span-2">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Eye className="h-3.5 w-3.5" /> Live preview
        </div>
        <div className="overflow-hidden rounded-lg border border-border">
          <div
            className="relative flex items-center overflow-hidden"
            style={{ backgroundColor: m.backgroundColor, color: m.textColor }}
          >
            <div className="min-w-0 flex-1 overflow-hidden py-2">
              <div
                className="flex w-max animate-marquee"
                style={{ animationDuration: `${Math.max(6, m.speedSeconds)}s` }}
              >
                {[0, 1].map((k) => (
                  <div className="flex shrink-0 items-center" key={k}>
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className="mx-8 whitespace-nowrap text-sm font-medium">
                        {m.message || 'Your announcement text...'}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {m.dismissible && (
              <button
                type="button"
                className="mx-2 inline-flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-white/15"
                style={{ color: m.textColor }}
                aria-label="Preview close"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="admin-card p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Type className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Message</h3>
            <p className="text-xs text-muted-foreground">The scrolling announcement text.</p>
          </div>
        </div>
        <LabeledTextarea
          label="Message text"
          value={m.message}
          onChange={(v) => patch({ message: v })}
          placeholder="🚀 Launch week — 30% off everything…"
          rows={4}
        />
      </div>

      {/* Call to action */}
      <div className="admin-card p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Play className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Call to action</h3>
            <p className="text-xs text-muted-foreground">Optional button inside the marquee.</p>
          </div>
        </div>
        <div className="grid gap-4">
          <LabeledInput label="CTA label" value={m.ctaLabel} onChange={(v) => patch({ ctaLabel: v })} />
          <LabeledInput label="CTA URL" value={m.ctaUrl} onChange={(v) => patch({ ctaUrl: v })} />
        </div>
      </div>

      {/* Appearance */}
      <div className="admin-card p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Palette className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Appearance</h3>
            <p className="text-xs text-muted-foreground">Colors used by the banner.</p>
          </div>
        </div>
        <div className="grid gap-4">
          <LabeledColor
            label="Background color"
            value={m.backgroundColor}
            onChange={(v) => patch({ backgroundColor: v })}
          />
          <LabeledColor label="Text color" value={m.textColor} onChange={(v) => patch({ textColor: v })} />
        </div>
      </div>

      {/* Animation */}
      <div className="admin-card p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <RotateCcw className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Animation</h3>
            <p className="text-xs text-muted-foreground">How fast the text scrolls.</p>
          </div>
        </div>
        <LabeledSlider
          label="Scroll speed"
          min={10}
          max={80}
          value={m.speedSeconds}
          onChange={(v) => patch({ speedSeconds: v })}
          hint={`${m.speedSeconds}s per loop`}
        />
      </div>
    </div>
  );
}
