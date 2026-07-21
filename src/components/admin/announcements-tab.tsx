'use client';

import { useEffect, useState } from 'react';
import {
  Megaphone,
  MessageSquare,
  Save,
  RotateCcw,
  Eye,
  X,
  Play,
  Palette,
  Type,
  Sparkles,
  MousePointerClick,
  Clock,
  Repeat,
} from 'lucide-react';
import {
  announcementsStore,
  defaultAnnouncements,
  useAnnouncements,
  type AnnouncementsSettings,
  type PopupTrigger,
  type PopupVariantSettings,
} from '@/src/lib/announcements';

type Section = 'marquee' | 'popup';

const SECTIONS: { key: Section; label: string; sub: string; icon: typeof Megaphone }[] = [
  { key: 'marquee', label: 'Header Marquee', sub: 'Scrolling banner on landing & shop', icon: Megaphone },
  { key: 'popup', label: 'Popup Modal', sub: 'Trigger-based welcome / promo popup', icon: MessageSquare },
];

const TRIGGERS: { key: PopupTrigger; label: string; description: string; icon: typeof Sparkles }[] = [
  { key: 'firstLogin', label: 'First login', description: 'Show once, the very first time a user logs in.', icon: Sparkles },
  { key: 'everyLogin', label: 'Every login', description: 'Show once per session after login.', icon: Repeat },
  { key: 'onceEver', label: 'Once ever', description: 'Show once per browser until they dismiss.', icon: MousePointerClick },
  { key: 'everyVisit', label: 'Every visit', description: 'Show every page load until dismissed for this version.', icon: Clock },
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

  const dirty = JSON.stringify(draft) !== JSON.stringify(remote);

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

/* -------- Marquee editor -------- */

function MarqueeEditor({
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

/* -------- Popup workspace (two-column: triggers left, editor right) -------- */

function PopupWorkspace({
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

function PopupVariantEditor({
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
  const TriggerIcon = triggerMeta.icon;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Status & visibility */}
      <div className="admin-card p-5 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand/10 text-brand">
              <TriggerIcon className="h-4 w-4" />
            </span>
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

/* -------- Popup preview (admin only) -------- */

function PopupPreview({
  variant,
  onClose,
}: {
  variant: PopupVariantSettings;
  onClose: () => void;
}) {
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
          style={{ background: `linear-gradient(90deg, ${variant.accentColor}, ${variant.accentColor}88)` }}
        />
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
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
  );
}

/* -------- Small form primitives -------- */

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium">
      {label}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          checked ? 'bg-brand' : 'bg-muted'
        }`}
        aria-pressed={checked}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  );
}

function CheckboxRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-border accent-[var(--brand)]"
      />
      {label}
    </label>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  hint,
  placeholder,
}: {
  label: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
      />
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}

function LabeledColor({
  label,
  value,
  onChange,
}: {
  label: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-10 cursor-pointer rounded border border-border bg-background"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full flex-1 bg-transparent text-sm outline-none"
        />
      </div>
    </div>
  );
}

function LabeledSlider({
  label,
  value,
  min,
  max,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[var(--brand)]"
      />
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
