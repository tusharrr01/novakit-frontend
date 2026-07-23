'use client';

import React from 'react';
import { Type, Palette, Sun, Moon, User } from 'lucide-react';
import type { PopupTrigger, PopupVariantSettings, AnnouncementsSettings } from '@/src/lib/announcements';
import { Toggle, LabeledInput, LabeledTextarea, LabeledColor } from './FormElements';

const TRIGGERS: Record<PopupTrigger, { label: string; description: string }> = {
  welcome: { label: 'Welcome Popup', description: 'Shows once to new users on their very first login.' },
  broadcast: { label: 'Broadcast Popup', description: 'Shows on arrival to all users; expires 7 days after creation. Saving a new broadcast overwrites the previous one.' },
  birthday: { label: 'Birthday Wishing', description: 'Triggers on arrival on the user\'s birthdate (user.dob). Expires after 24 hours.' },
  festival: { label: 'Festival Wishing', description: 'Auto-triggers on festival dates (Diwali, Christmas, etc.). Expires after 24 hours.' },
};

export function PopupVariantEditor({
  popup,
  trigger,
  variant,
  onPatch,
}: {
  popup: AnnouncementsSettings['popup'];
  trigger: PopupTrigger;
  variant: PopupVariantSettings;
  onPatch: (patch: Partial<PopupVariantSettings>) => void;
}) {
  const triggerMeta = TRIGGERS[trigger] || { label: trigger, description: '' };

  const insertNamePlaceholder = (field: 'title' | 'body') => {
    const currentVal = variant[field] || '';
    if (currentVal.includes('{name}')) return;
    onPatch({ [field]: `${currentVal} {name}`.trim() });
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Content */}
      <div className="admin-card p-5 lg:col-span-2">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Type className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold">{triggerMeta.label} Content</h3>
              <p className="text-xs text-muted-foreground">{triggerMeta.description}</p>
            </div>
          </div>
          {trigger !== 'broadcast' && (
            <Toggle checked={variant.enabled} onChange={(v) => onPatch({ enabled: v })} label="Variant enabled" />
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-foreground">Title</label>
              {(trigger === 'birthday' || trigger === 'welcome' || trigger === 'broadcast') && (
                <button
                  type="button"
                  onClick={() => insertNamePlaceholder('title')}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline cursor-pointer"
                >
                  <User className="h-3 w-3" /> Insert &#123;name&#125; variable
                </button>
              )}
            </div>
            <input
              type="text"
              value={variant.title}
              onChange={(e) => onPatch({ title: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-foreground">Body</label>
              {(trigger === 'birthday' || trigger === 'welcome' || trigger === 'broadcast') && (
                <button
                  type="button"
                  onClick={() => insertNamePlaceholder('body')}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline cursor-pointer"
                >
                  <User className="h-3 w-3" /> Insert &#123;name&#125; variable
                </button>
              )}
            </div>
            <textarea
              rows={4}
              value={variant.body}
              onChange={(e) => onPatch({ body: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          <LabeledInput label="CTA label" value={variant.ctaLabel} onChange={(v) => onPatch({ ctaLabel: v })} />
          <LabeledInput label="CTA URL" value={variant.ctaUrl} onChange={(v) => onPatch({ ctaUrl: v })} />
        </div>
      </div>

      {/* Appearance */}
      <div className="admin-card p-5 lg:col-span-2">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Palette className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Appearance</h3>
            <p className="text-xs text-muted-foreground">Accent colors used by the popup in light and dark mode.</p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Light Mode Box */}
          <div className="rounded-xl border border-border p-4 bg-background/50 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
              <Sun className="h-3.5 w-3.5 text-amber-500" /> Light Mode
            </div>
            <LabeledColor
              label="Accent color"
              value={variant.accentColor || '#7c3aed'}
              onChange={(v) => onPatch({ accentColor: v })}
            />
          </div>

          {/* Dark Mode Box */}
          <div className="rounded-xl border border-border p-4 bg-background/50 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
              <Moon className="h-3.5 w-3.5 text-indigo-400" /> Dark Mode
            </div>
            <LabeledColor
              label="Accent color"
              value={variant.darkAccentColor || variant.accentColor || '#a855f7'}
              onChange={(v) => onPatch({ darkAccentColor: v })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
