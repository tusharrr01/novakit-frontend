'use client';

import React from 'react';
import { Sparkles, Radio, PartyPopper, Cake } from 'lucide-react';
import type { PopupTrigger, PopupVariantSettings, AnnouncementsSettings } from '@/src/lib/announcements';
import { PopupVariantEditor } from './PopupVariantEditor';
import { FestivalEditor } from './FestivalEditor';

const TRIGGERS: { key: PopupTrigger; label: string; description: string; icon: any }[] = [
  { key: 'welcome', label: 'Welcome Popup', description: 'Show once, the very first time a user logs in.', icon: Sparkles },
  { key: 'broadcast', label: 'Broadcast', description: 'Shows on arrival; expires 7 days after creation.', icon: Radio },
  { key: 'festival', label: 'Festival Wishing', description: 'Shows on festival date only; expires after 24h.', icon: PartyPopper },
  { key: 'birthday', label: 'Birthday Wishing', description: 'Shows on user\'s birthdate only; expires after 24h.', icon: Cake },
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
  const activeTrigger: PopupTrigger = p.trigger || 'welcome';

  const setTrigger = (trigger: PopupTrigger) =>
    setDraft({ ...draft, popup: { ...p, trigger } });

  const patchVariant = (trigger: 'welcome' | 'broadcast' | 'birthday', patch: Partial<PopupVariantSettings>) => {
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

  const isTriggerEnabled = (key: PopupTrigger) => {
    if (key === 'festival') {
      const activeFest = p.festival?.festivals?.find((f) => f.id === p.festival?.activeFestivalId) || p.festival?.festivals?.[0];
      return activeFest ? activeFest.enabled : false;
    }
    return p.variants[key]?.enabled ?? false;
  };

  return (
    <div className="mt-5 flex min-h-0 flex-1 gap-5 overflow-hidden">
      {/* Left: trigger sub-section cards */}
      <div className="hidden w-72 shrink-0 flex-col gap-3 overflow-y-auto custom-scrollbar pr-1 lg:flex">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Trigger sub-sections
        </div>
        {TRIGGERS.map((t) => {
          const TIcon = t.icon;
          const enabled = isTriggerEnabled(t.key);
          const isActive = activeTrigger === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTrigger(t.key)}
              className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition cursor-pointer ${
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
                    enabled
                      ? 'bg-emerald-500/15 text-emerald-500'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {enabled ? 'on' : 'off'}
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
            const enabled = isTriggerEnabled(t.key);
            const isActive = activeTrigger === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTrigger(t.key)}
                className={`flex flex-col gap-1 rounded-xl border p-3 text-left transition cursor-pointer ${
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
                      enabled
                        ? 'bg-emerald-500/15 text-emerald-500'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {enabled ? 'on' : 'off'}
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
        {activeTrigger === 'festival' ? (
          <FestivalEditor draft={draft} setDraft={setDraft} />
        ) : (
          <PopupVariantEditor
            popup={p}
            trigger={activeTrigger}
            variant={p.variants[activeTrigger]}
            onPatch={(patch) => patchVariant(activeTrigger, patch)}
          />
        )}
      </div>
    </div>
  );
}
