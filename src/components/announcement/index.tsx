'use client';

import React, { useEffect, useState } from 'react';
import { Megaphone, MessageSquare, RotateCcw, Save, Loader2, Play, X, Radio } from 'lucide-react';
import { toast } from 'sonner';
import {
  announcementsStore,
  defaultAnnouncements,
  useAnnouncements,
  type AnnouncementsSettings,
} from '@/src/lib/announcements';
import { useUpdateAnnouncementsMutation } from '@/src/redux/api/announcementApi';
import { checkSettingsDirty } from '@/src/utils/announcement';
import { MarqueeEditor } from './MarqueeEditor';
import { PopupWorkspace } from './PopupWorkspace';
import { PopupPreview } from './PopupPreview';
import { Toggle } from './FormElements';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/src/elements/ui/select';

type Section = 'marquee' | 'popup';

const SECTIONS: { key: Section; label: string; sub: string; icon: any }[] = [
  { key: 'marquee', label: 'Header Marquee', sub: 'Scrolling banner on landing & shop', icon: Megaphone },
  { key: 'popup', label: 'Popup Modal', sub: 'Trigger-based welcome / promo popup', icon: MessageSquare },
];

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

export function AnnouncementsTab() {
  const remote = useAnnouncements();
  const [updateAnnouncements, { isLoading: isSaving }] = useUpdateAnnouncementsMutation();
  const [active, setActive] = useState<Section>('marquee');
  const [draft, setDraft] = useState<AnnouncementsSettings>(remote);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [previewPopup, setPreviewPopup] = useState(false);
  const [previewMarquee, setPreviewMarquee] = useState(false);
  const isDark = useIsDarkMode();

  const previewBgColor = isDark && draft.marquee.darkBackgroundColor ? draft.marquee.darkBackgroundColor : draft.marquee.backgroundColor;
  const previewTextColor = isDark && draft.marquee.darkTextColor ? draft.marquee.darkTextColor : draft.marquee.textColor;

  useEffect(() => {
    setDraft(remote);
  }, [remote]);

  const handleSectionChange = (v: Section) => {
    setActive(v);
    setPreviewMarquee(false);
    setPreviewPopup(false);
  };

  // Use the utility function we created!
  const dirty = checkSettingsDirty(draft, remote);

  const isCurrentEnabled = active === 'marquee' ? draft.marquee.enabled : draft.popup.enabled;

  const toggleCurrentEnabled = (val: boolean) => {
    if (active === 'marquee') {
      setDraft({
        ...draft,
        marquee: { ...draft.marquee, enabled: val },
      });
    } else {
      setDraft({
        ...draft,
        popup: { ...draft.popup, enabled: val },
      });
    }
  };

  const save = async () => {
    try {
      await updateAnnouncements(draft).unwrap();
      announcementsStore.save(draft);
      setSavedAt(Date.now());
      toast.success('Announcements updated successfully!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update announcements');
    }
  };

  const meta = SECTIONS.find((s) => s.key === active)!;
  const Icon = meta.icon;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-brand">Announcements</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure the header marquee and popup announcements shown across your site.
          </p>
        </div>

        {/* Section switcher dropdown */}
        <Select value={active} onValueChange={(v) => handleSectionChange(v as Section)}>
          <SelectTrigger className="h-auto w-full sm:w-[290px] cursor-pointer rounded-xl border border-border bg-background p-2.5 shadow-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 transition hover:border-brand/50 data-[state=open]:border-brand/50">
            <div className="flex items-center gap-3 text-left">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-md shadow-brand/20">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{meta.label}</span>
                  <span
                    className={`rounded-md px-1.5 py-px text-[9px] font-semibold uppercase ${
                      isCurrentEnabled ? 'bg-emerald-500/15 text-emerald-500' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isCurrentEnabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <span className="block truncate text-[11px] text-muted-foreground">{meta.sub}</span>
              </div>
            </div>
          </SelectTrigger>
          <SelectContent align="end" className="w-[290px] space-y-1.5 rounded-xl border border-border bg-card p-2 shadow-xl">
            {SECTIONS.map((s) => {
              const SIcon = s.icon;
              const isSelected = s.key === active;
              const enabled = s.key === 'marquee' ? draft.marquee.enabled : draft.popup.enabled;
              return (
                <SelectItem
                  key={s.key}
                  value={s.key}
                  className={`my-1 cursor-pointer rounded-lg py-2.5 pl-3 !pr-14 transition focus:bg-brand/10 ${
                    isSelected ? 'bg-brand/10 font-medium' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                        isSelected ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <SIcon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{s.label}</span>
                        <span
                          className={`rounded-md px-1.5 py-px text-[9px] font-semibold uppercase ${
                            enabled ? 'bg-emerald-500/15 text-emerald-500' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {enabled ? 'ON' : 'OFF'}
                        </span>
                      </div>
                      <span className="block truncate text-[11px] text-muted-foreground">{s.sub}</span>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Live marquee preview banner in-flow */}
        {active === 'marquee' && previewMarquee && (
          <div className="shrink-0 mb-4 overflow-hidden rounded-xl border border-border shadow-sm transition animate-in fade-in slide-in-from-top-1 duration-200">
            <div
              className="relative w-full overflow-hidden transition-colors duration-300"
              style={{ backgroundColor: previewBgColor, color: previewTextColor }}
              role="region"
              aria-label="Site announcement preview"
            >
              <div className="flex items-center">
                <div className="min-w-0 flex-1 overflow-hidden py-2">
                  <div
                    className="flex w-max animate-marquee"
                    style={{ animationDuration: `${Math.max(6, draft.marquee.speedSeconds)}s` }}
                  >
                    {[0, 1].map((k) => (
                      <div key={k} className="flex shrink-0 items-center">
                        {[0, 1, 2, 3].map((i) => (
                          <span key={i} className="mx-3 whitespace-nowrap text-sm font-medium">
                            {draft.marquee.message || 'Your announcement text...'}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewMarquee(false)}
                  aria-label="Close preview"
                  className="mx-2 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition hover:bg-white/15 cursor-pointer"
                  style={{ color: previewTextColor }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

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
            <div className="flex items-center gap-3">
              {active === 'marquee' && (
                <button
                  type="button"
                  onClick={() => setPreviewMarquee(!previewMarquee)}
                  className={`inline-flex h-10 items-center gap-1.5 rounded-lg border px-4 text-sm font-medium transition cursor-pointer ${
                    previewMarquee
                      ? 'border-brand bg-brand/10 text-brand font-semibold shadow-xs'
                      : 'border-border bg-background hover:border-brand/40'
                  }`}
                >
                  <Play className="h-4 w-4" /> {previewMarquee ? 'Stop preview' : 'Preview'}
                </button>
              )}
              {active === 'popup' && (
                <button
                  type="button"
                  onClick={() => setPreviewPopup(true)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-background px-4 text-sm font-medium hover:border-brand/40 cursor-pointer transition"
                >
                  <Play className="h-4 w-4" /> Preview
                </button>
              )}
              {!(active === 'popup' && draft.popup.trigger === 'broadcast') && (
                <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background/80 px-3.5 py-2">
                  <Toggle
                    checked={isCurrentEnabled}
                    onChange={toggleCurrentEnabled}
                    label={isCurrentEnabled ? 'Enabled' : 'Disabled'}
                  />
                </div>
              )}
              <button
                onClick={save}
                disabled={!dirty || isSaving}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-gradient px-4 text-sm font-medium text-white shadow-lg shadow-brand/25 disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> {active === 'popup' && draft.popup.trigger === 'broadcast' ? 'Publishing...' : 'Saving...'}
                  </>
                ) : active === 'popup' && draft.popup.trigger === 'broadcast' ? (
                  <>
                    <Radio className="h-4 w-4" /> Publish Broadcast
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save changes
                  </>
                )}
              </button>
            </div>
          </div>
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
          variant={
            draft.popup.trigger === 'festival'
              ? (() => {
                  const festData = draft.popup.festival;
                  const festivals = festData?.festivals || [];
                  const activeFest = festivals.find((f) => f.id === festData?.activeFestivalId) || festivals[0];
                  return {
                    enabled: activeFest?.enabled ?? true,
                    version: 'v1',
                    title: activeFest?.title || 'Happy Festival',
                    body: activeFest?.body || '',
                    ctaLabel: activeFest?.ctaLabel || '',
                    ctaUrl: activeFest?.ctaUrl || '/products',
                    imageUrl: '',
                    dismissible: true,
                    accentColor: activeFest?.accentColor || '#f59e0b',
                    darkAccentColor: activeFest?.darkAccentColor || '#fbbf24',
                  };
                })()
              : draft.popup.variants[draft.popup.trigger as 'welcome' | 'broadcast' | 'birthday'] || draft.popup.variants.welcome
          }
          onClose={() => setPreviewPopup(false)}
        />
      )}
    </div>
  );
}
