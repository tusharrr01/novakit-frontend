'use client';

import React, { useEffect, useState } from 'react';
import { Megaphone, MessageSquare, RotateCcw, Save } from 'lucide-react';
import {
  announcementsStore,
  defaultAnnouncements,
  useAnnouncements,
  type AnnouncementsSettings,
} from '@/src/lib/announcements';
import { checkSettingsDirty } from '@/src/utils/announcement';
import { MarqueeEditor } from './MarqueeEditor';
import { PopupWorkspace } from './PopupWorkspace';
import { PopupPreview } from './PopupPreview';

type Section = 'marquee' | 'popup';

const SECTIONS: { key: Section; label: string; sub: string; icon: any }[] = [
  { key: 'marquee', label: 'Header Marquee', sub: 'Scrolling banner on landing & shop', icon: Megaphone },
  { key: 'popup', label: 'Popup Modal', sub: 'Trigger-based welcome / promo popup', icon: MessageSquare },
];

export function AnnouncementsTab() {
  const remote = useAnnouncements();
  const [active, setActive] = useState<Section>('marquee');
  const [draft, setDraft] = useState<AnnouncementsSettings>(remote);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [previewPopup, setPreviewPopup] = useState(false);

  useEffect(() => {
    setDraft(remote);
  }, [remote]);

  // Use the utility function we created!
  const dirty = checkSettingsDirty(draft, remote);

  const save = () => {
    announcementsStore.save(draft);
    setSavedAt(Date.now());
  };
  const reset = () => setDraft(defaultAnnouncements);

  const meta = SECTIONS.find((s) => s.key === active)!;
  const Icon = meta.icon;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-brand">Announcements</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure the header marquee and popup announcements shown across your site.
          </p>
        </div>

        {/* Section switcher */}
        <div className="flex items-center gap-2">
          {SECTIONS.map((s) => {
            const SIcon = s.icon;
            const isActive = s.key === active;
            const enabled = s.key === 'marquee' ? draft.marquee.enabled : draft.popup.enabled;
            return (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition ${
                  isActive
                    ? 'border-transparent bg-brand-gradient text-white shadow-lg shadow-brand/25'
                    : 'border-border bg-background hover:border-brand/40'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <SIcon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className={`flex items-center gap-1.5 text-sm font-semibold ${isActive ? 'text-white' : ''}`}>
                    {s.label}
                    <span
                      className={`rounded-md px-1.5 py-px text-[9px] font-semibold uppercase ${
                        enabled
                          ? isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-500/15 text-emerald-500'
                          : isActive
                            ? 'bg-white/10 text-white/80'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {enabled ? 'on' : 'off'}
                    </span>
                  </span>
                  <span className={`block text-[11px] leading-tight ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {s.sub}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 admin-card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand/10 text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {meta.label}
                </h2>
                <p className="text-xs text-muted-foreground">{meta.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={reset}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-background px-4 text-sm font-medium hover:border-brand/40"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
              <button
                onClick={save}
                disabled={!dirty}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-gradient px-4 text-sm font-medium text-white shadow-lg shadow-brand/25 disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> Save changes
              </button>
            </div>
          </div>

          {savedAt && !dirty && (
            <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-500">
              Saved. Live on your site.
            </div>
          )}
        </div>

        {active === 'popup' ? (
          <PopupWorkspace
            draft={draft}
            setDraft={setDraft}
            onPreview={() => setPreviewPopup(true)}
          />
        ) : (
          <div className="mt-5 flex-1 overflow-y-auto custom-scrollbar pr-1">
            <MarqueeEditor draft={draft} setDraft={setDraft} />
          </div>
        )}
      </div>

      {previewPopup && (
        <PopupPreview
          variant={draft.popup.variants[draft.popup.trigger]}
          onClose={() => setPreviewPopup(false)}
        />
      )}
    </div>
  );
}
