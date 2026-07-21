'use client';

import React from 'react';
import { Sparkles, Repeat, MousePointerClick, Clock } from 'lucide-react';
import type { PopupTrigger, PopupVariantSettings, AnnouncementsSettings } from '@/src/lib/announcements';
import { PopupVariantEditor } from './PopupVariantEditor';

const TRIGGERS: { key: PopupTrigger; label: string; description: string; icon: any }[] = [
  { key: 'firstLogin', label: 'First login', description: 'Show once, the very first time a user logs in.', icon: Sparkles },
  { key: 'everyLogin', label: 'Every login', description: 'Show once per session after login.', icon: Repeat },
  { key: 'onceEver', label: 'Once ever', description: 'Show once per browser until they dismiss.', icon: MousePointerClick },
  { key: 'everyVisit', label: 'Every visit', description: 'Show every page load until dismissed for this version.', icon: Clock },
];

export function PopupWorkspace({
  draft,
  setDraft,
  onPreview,
}: {
  draft: AnnouncementsSettings;
  setDraft: (v: AnnouncementsSettings) => void;
  onPreview: () => void;
}) {
  const p = draft.popup;
  const activeTrigger = p.trigger;
  const activeVariant = p.variants[activeTrigger];

  const setTrigger = (trigger: PopupTrigger) =>
    setDraft({ ...draft, popup: { ...p, trigger } });

  const patchVariant = (trigger: PopupTrigger, patch: Partial<PopupVariantSettings>) => {
    setDraft({
      ...draft,
      popup: {
        ...p,
        variants: {
          ...p.variants,
          [trigger]: { ...p.variants[trigger], ...patch },
        },
      },
    });
  };

  return (
    <div className="mt-5 flex min-h-0 flex-1 gap-5 overflow-hidden">
      {/* Left: trigger sub-section cards (non-scrolled) */}
      <div className="hidden w-72 shrink-0 flex-col gap-3 overflow-y-auto custom-scrollbar pr-1 lg:flex">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Trigger sub-sections
        </div>
        {TRIGGERS.map((t) => {
          const TIcon = t.icon;
          const variant = p.variants[t.key];
          const isActive = activeTrigger === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTrigger(t.key)}
              className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition ${
                isActive
                  ? 'border-brand/40 bg-brand/5 ring-1 ring-brand/20'
                  : 'border-border bg-background hover:border-brand/30 hover:bg-muted/30'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-md ${isActive ? 'bg-brand/10 text-brand' : 'bg-secondary text-secondary-foreground'}`}>
                    <TIcon className="h-3.5 w-3.5" />
                  </span>
                  {t.label}
                </span>
                <span
                  className={`rounded-md px-1.5 py-px text-[9px] font-semibold uppercase ${
                    variant.enabled
                      ? 'bg-emerald-500/15 text-emerald-500'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {variant.enabled ? 'on' : 'off'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{t.description}</p>
            </button>
          );
        })}
      </div>

      {/* Mobile trigger selector */}
      <div className="flex w-full shrink-0 flex-col gap-3 lg:hidden">
        <div className="grid grid-cols-2 gap-3">
          {TRIGGERS.map((t) => {
            const TIcon = t.icon;
            const variant = p.variants[t.key];
            const isActive = activeTrigger === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTrigger(t.key)}
                className={`flex flex-col gap-1 rounded-xl border p-3 text-left transition ${
                  isActive
                    ? 'border-brand/40 bg-brand/5 ring-1 ring-brand/20'
                    : 'border-border bg-background hover:border-brand/30'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold">
                    <TIcon className="h-3 w-3" />
                    {t.label}
                  </span>
                  <span
                    className={`rounded-md px-1 py-px text-[8px] font-semibold uppercase ${
                      variant.enabled
                        ? 'bg-emerald-500/15 text-emerald-500'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {variant.enabled ? 'on' : 'off'}
                  </span>
                </div>
                <p className="text-[11px] leading-tight text-muted-foreground">{t.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: editor for selected trigger */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <PopupVariantEditor
          popup={p}
          trigger={activeTrigger}
          variant={activeVariant}
          onPatch={(patch) => patchVariant(activeTrigger, patch)}
          onToggleMaster={(enabled) => setDraft({ ...draft, popup: { ...p, enabled } })}
          onPreview={onPreview}
        />
      </div>
    </div>
  );
}
