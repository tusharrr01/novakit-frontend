'use client';

import React from 'react';
import { Megaphone, X, Type, Play, Palette, RotateCcw, Sun, Moon } from 'lucide-react';
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
              <p className="text-xs text-muted-foreground">Choose where the marquee appears on your site.</p>
            </div>
          </div>
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

      {/* Message */}
      <div className="admin-card p-5 lg:col-span-2">
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
          rows={3}
        />
      </div>

      {/* Appearance */}
      <div className="admin-card p-5 lg:col-span-2">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Palette className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Appearance</h3>
            <p className="text-xs text-muted-foreground">Colors used by the marquee banner in light and dark mode.</p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Light Mode Box */}
          <div className="rounded-xl border border-border p-4 bg-background/50 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
              <Sun className="h-3.5 w-3.5 text-amber-500" /> Light Mode Colors
            </div>
            <div className="grid gap-3">
              <LabeledColor
                label="Background color"
                value={m.backgroundColor || '#7c3aed'}
                onChange={(v) => patch({ backgroundColor: v })}
              />
              <LabeledColor
                label="Text color"
                value={m.textColor || '#ffffff'}
                onChange={(v) => patch({ textColor: v })}
              />
            </div>
          </div>

          {/* Dark Mode Box */}
          <div className="rounded-xl border border-border p-4 bg-background/50 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
              <Moon className="h-3.5 w-3.5 text-indigo-400" /> Dark Mode Colors
            </div>
            <div className="grid gap-3">
              <LabeledColor
                label="Background color"
                value={m.darkBackgroundColor || m.backgroundColor || '#4c1d95'}
                onChange={(v) => patch({ darkBackgroundColor: v })}
              />
              <LabeledColor
                label="Text color"
                value={m.darkTextColor || m.textColor || '#ffffff'}
                onChange={(v) => patch({ darkTextColor: v })}
              />
            </div>
          </div>
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
