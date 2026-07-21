'use client';

import React from 'react';
import { Play, Eye, X, Type, Palette } from 'lucide-react';
import type { PopupTrigger, PopupVariantSettings, AnnouncementsSettings } from '@/src/lib/announcements';
import { Toggle, CheckboxRow, LabeledInput, LabeledTextarea, LabeledColor } from './FormElements';

const TRIGGERS = [
  { key: 'firstLogin', label: 'First login', description: 'Show once, the very first time a user logs in.' },
  { key: 'everyLogin', label: 'Every login', description: 'Show once per session after login.' },
  { key: 'onceEver', label: 'Once ever', description: 'Show once per browser until they dismiss.' },
  { key: 'everyVisit', label: 'Every visit', description: 'Show every page load until dismissed for this version.' },
];

export function PopupVariantEditor({
  popup,
  trigger,
  variant,
  onPatch,
  onToggleMaster,
  onPreview,
}: {
  popup: AnnouncementsSettings['popup'];
  trigger: PopupTrigger;
  variant: PopupVariantSettings;
  onPatch: (patch: Partial<PopupVariantSettings>) => void;
  onToggleMaster: (enabled: boolean) => void;
  onPreview: () => void;
}) {
  const triggerMeta = TRIGGERS.find((t) => t.key === trigger)!;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Status & visibility */}
      <div className="admin-card p-5 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div>
              <h3 className="text-sm font-semibold">{triggerMeta.label} popup</h3>
              <p className="text-xs text-muted-foreground">{triggerMeta.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPreview}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium hover:border-brand/40"
            >
              <Play className="h-3.5 w-3.5" /> Preview
            </button>
            <Toggle checked={popup.enabled} onChange={onToggleMaster} label="Master enabled" />
            <Toggle checked={variant.enabled} onChange={(v) => onPatch({ enabled: v })} label="Variant enabled" />
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <CheckboxRow
            checked={variant.dismissible}
            onChange={(v) => onPatch({ dismissible: v })}
            label="Allow visitors to dismiss"
          />
          <LabeledInput
            label="Version tag"
            value={variant.version}
            onChange={(v) => onPatch({ version: v })}
            hint="Bump to re-show to users who already dismissed."
          />
        </div>
      </div>

      {/* Live preview */}
      <div className="admin-card p-5 lg:col-span-2">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Eye className="h-3.5 w-3.5" /> Live preview
        </div>
        <div className="flex justify-center rounded-lg border border-border bg-muted/30 p-6">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div
              className="h-1.5 w-full"
              style={{ background: `linear-gradient(90deg, ${variant.accentColor}, ${variant.accentColor}88)` }}
            />
            {variant.dismissible && (
              <button
                type="button"
                aria-label="Close"
                className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
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
                  <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium">
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
      </div>

      {/* Content */}
      <div className="admin-card p-5 lg:col-span-2">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Type className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Content</h3>
            <p className="text-xs text-muted-foreground">What appears inside the popup.</p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <LabeledInput label="Title" value={variant.title} onChange={(v) => onPatch({ title: v })} />
          </div>
          <div className="sm:col-span-2">
            <LabeledTextarea label="Body" value={variant.body} onChange={(v) => onPatch({ body: v })} rows={4} />
          </div>
          <LabeledInput label="CTA label" value={variant.ctaLabel} onChange={(v) => onPatch({ ctaLabel: v })} />
          <LabeledInput label="CTA URL" value={variant.ctaUrl} onChange={(v) => onPatch({ ctaUrl: v })} />
          <div className="sm:col-span-2">
            <LabeledInput
              label="Image URL (optional)"
              value={variant.imageUrl}
              onChange={(v) => onPatch({ imageUrl: v })}
              placeholder="https://..."
            />
          </div>
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
            <p className="text-xs text-muted-foreground">Accent color used by the popup.</p>
          </div>
        </div>
        <LabeledColor
          label={<span className="inline-flex items-center gap-1"><Palette className="h-3 w-3" /> Accent color</span>}
          value={variant.accentColor}
          onChange={(v) => onPatch({ accentColor: v })}
        />
      </div>
    </div>
  );
}
