'use client';

import React, { useEffect, useState } from 'react';
import {
  LogIn,
  UserPlus,
  KeyRound,
  ShieldAlert,
  MessageSquare,
  Lock,
  RotateCcw,
  Check,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import {
  AUTH_PAGE_META,
  authContentStore,
  defaultAuthContent,
  useAuthContent,
  type AuthPageContent,
  type AuthPageKey,
} from '@/src/lib/auth-content';

export function AuthPagesTab() {
  const content = useAuthContent();
  const [active, setActive] = useState<AuthPageKey>('login');
  const [draft, setDraft] = useState<AuthPageContent>(content[active]);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setDraft(content[active]);
    setSavedAt(null);
  }, [active, content]);

  const meta = AUTH_PAGE_META.find((m) => m.key === active)!;
  const dirty = JSON.stringify(draft) !== JSON.stringify(content[active]);

  function updateField(idx: number, patch: Partial<{ label: string; placeholder: string }>) {
    const next = [...draft.fields];
    next[idx] = { ...next[idx], ...patch };
    setDraft({ ...draft, fields: next });
  }

  function save() {
    authContentStore.update(active, draft);
    setSavedAt(Date.now());
  }

  function resetPage() {
    setDraft(defaultAuthContent[active]);
  }

  const iconFor: Record<AuthPageKey, typeof Lock> = {
    login: LogIn,
    register: UserPlus,
    forgotPassword: KeyRound,
    resetPassword: ShieldAlert,
    otp: MessageSquare,
  };
  const subtitleFor: Record<AuthPageKey, string> = {
    login: 'Login page content',
    register: 'Registration page content',
    forgotPassword: 'Forgot password content',
    resetPassword: 'Reset password content',
    otp: 'OTP verification content',
  };
  const ActiveIcon = iconFor[active];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-brand">Auth Page Setup</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage authentication pages content and side panels
          </p>
        </div>
      </div>

      <div className="mt-6 grid flex-1 gap-6 overflow-hidden lg:grid-cols-[280px_1fr]">
        {/* Left sidebar page list */}
        <aside className="h-fit admin-card p-3">
          <div className="space-y-2">
            {AUTH_PAGE_META.map((m) => {
              const Icon = iconFor[m.key];
              const isActive = active === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => setActive(m.key)}
                  className={`flex w-full items-center gap-3 rounded-md border p-3 text-left transition ${
                    isActive
                      ? 'border-transparent bg-brand-gradient text-white shadow-lg shadow-brand/25'
                      : 'border-border bg-background hover:border-brand/40'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-sm font-semibold ${isActive ? 'text-white' : ''}`}>
                      {m.label}
                    </span>
                    <span className={`block text-xs ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {subtitleFor[m.key]}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right main area */}
        <div className="flex min-h-0 flex-col overflow-hidden">
          {/* Static header card */}
          <div className="shrink-0 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 admin-card p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand/10 text-brand">
                  <ActiveIcon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    {meta.label} Configuration
                  </h2>
                  <p className="text-xs text-muted-foreground">{subtitleFor[active]}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetPage}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-background px-4 text-sm font-medium hover:border-brand/40"
                >
                  <RotateCcw className="h-4 w-4" /> Refresh
                </button>
                <button
                  onClick={save}
                  disabled={!dirty}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-gradient px-4 text-sm font-medium text-white shadow-lg shadow-brand/25 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" /> Publish
                </button>
              </div>
            </div>

            {savedAt && !dirty && (
              <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-500 animate-in fade-in duration-200">
                <CheckCircle2 className="h-3.5 w-3.5" /> Saved. Changes are now live on {meta.route}.
              </div>
            )}
          </div>

          {/* Scrollable preview + fields */}
          <div className="mt-5 flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-1 pb-4">
            {/* Live preview */}
            <div className="admin-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Live Preview</div>
                  <div className="text-sm font-medium">{meta.label}</div>
                </div>
                <a
                  href={meta.route}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-brand hover:underline"
                >
                  Open page <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
              <div className="rounded-md border border-border bg-background p-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand">{draft.eyebrow}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">{draft.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{draft.subtitle}</p>
                <div className="mt-4 space-y-3">
                  {draft.fields.map((f) => (
                    <div key={f.key}>
                      <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{f.label}</label>
                      <div className="h-9 rounded-lg border border-border bg-card px-3 text-xs leading-9 text-muted-foreground/70">
                        {f.placeholder}
                      </div>
                    </div>
                  ))}
                  <div className="mt-2 inline-flex h-9 w-full items-center justify-center rounded-lg bg-brand-gradient text-xs font-medium text-white">
                    {draft.submitLabel}
                  </div>
                  {(draft.footerText || draft.footerLinkLabel) && (
                    <p className="pt-2 text-center text-[11px] text-muted-foreground">
                      {draft.footerText}{' '}
                      <span className="font-medium text-brand">{draft.footerLinkLabel}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Main content fields */}
            <div className="admin-card p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <LabeledInput label="Eyebrow" value={draft.eyebrow} onChange={(v) => setDraft({ ...draft, eyebrow: v })} />
                <LabeledInput label="Main Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
                <div className="sm:col-span-2">
                  <LabeledTextarea label="Subtitle" value={draft.subtitle} onChange={(v) => setDraft({ ...draft, subtitle: v })} />
                </div>
                <LabeledInput label="Button Text" value={draft.submitLabel} onChange={(v) => setDraft({ ...draft, submitLabel: v })} />
                <LabeledInput label="Footer Text" value={draft.footerText} onChange={(v) => setDraft({ ...draft, footerText: v })} />
                <LabeledInput label="Footer Link Label" value={draft.footerLinkLabel} onChange={(v) => setDraft({ ...draft, footerLinkLabel: v })} />
                {(active === 'login' || active === 'register') && (
                  <div className="flex items-end">
                    <label className="flex h-10 w-full items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm cursor-pointer hover:border-brand/40">
                      <input
                        type="checkbox"
                        checked={draft.showSocials}
                        onChange={(e) => setDraft({ ...draft, showSocials: e.target.checked })}
                        className="h-4 w-4 rounded border-border accent-[var(--brand)]"
                      />
                      Show social sign-in buttons
                    </label>
                  </div>
                )}
              </div>

              {draft.fields.length > 0 && (
                <>
                  <div className="my-6 border-t border-border" />
                  <div className="mb-4 flex items-center gap-3 rounded-md border border-brand/20 bg-brand/5 p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Lock className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">Form Fields</h3>
                      <p className="text-xs text-muted-foreground">Label and placeholder for each input</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {draft.fields.map((f, i) => (
                      <div key={f.key} className="rounded-md border border-border bg-background/40 p-4">
                        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {f.key}
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <LabeledInput label="Label" value={f.label} onChange={(v) => updateField(i, { label: v })} />
                          <LabeledInput
                            label="Placeholder"
                            value={f.placeholder}
                            onChange={(v) => updateField(i, { placeholder: v })}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}
