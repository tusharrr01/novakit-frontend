'use client';

import React, { useEffect, useState } from 'react';
import {
  Mail,
  AtSign,
  Ticket,
  KeyRound,
  ShieldCheck,
  PartyPopper,
  Receipt,
  Key as KeyIcon,
  Undo2,
  RotateCcw,
  Check,
  CheckCircle2,
  Send,
  Zap,
  Plus,
} from 'lucide-react';
import {
  EMAIL_TEMPLATE_META,
  emailTemplatesStore,
  defaultEmailContent,
  useEmailTemplates,
  type EmailTemplate,
  type EmailTemplateKey,
} from '@/src/lib/email-templates-content';

const emailIconFor: Record<EmailTemplateKey, typeof Mail> = {
  accountVerification: AtSign,
  otpVerification: Ticket,
  forgotPassword: KeyRound,
  passwordResetConfirmed: ShieldCheck,
  welcome: PartyPopper,
  purchaseReceipt: Receipt,
  licenseDelivery: KeyIcon,
  refundIssued: Undo2,
};

export function EmailTemplatesTab() {
  const content = useEmailTemplates();
  const [active, setActive] = useState<EmailTemplateKey>('accountVerification');
  const [draft, setDraft] = useState<EmailTemplate>(content[active]);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setDraft(content[active]);
    setSavedAt(null);
  }, [active, content]);

  const meta = EMAIL_TEMPLATE_META.find((m) => m.key === active)!;
  const dirty = JSON.stringify(draft) !== JSON.stringify(content[active]);
  const ActiveIcon = emailIconFor[active];

  function save() {
    emailTemplatesStore.update(active, draft);
    setSavedAt(Date.now());
  }
  
  function resetPage() {
    setDraft(defaultEmailContent[active]);
  }
  
  function insertVar(v: string) {
    setDraft({ ...draft, body: (draft.body ? draft.body + ' ' : '') + v });
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-brand">Email Templates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage every transactional email sent from the platform
          </p>
        </div>
      </div>

      <div className="mt-6 grid flex-1 gap-6 overflow-hidden lg:grid-cols-[300px_1fr]">
        {/* Left list */}
        <aside className="h-fit admin-card p-3">
          <div className="space-y-2">
            {EMAIL_TEMPLATE_META.map((m) => {
              const Icon = emailIconFor[m.key];
              const isActive = active === m.key;
              const tpl = content[m.key];
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
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`flex items-center gap-1.5 text-sm font-semibold ${isActive ? 'text-white' : ''}`}>
                      {m.label}
                      {!tpl.enabled && (
                        <span className={`rounded-md px-1.5 py-px text-[9px] uppercase ${isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'}`}>
                          off
                        </span>
                      )}
                    </span>
                    <span className={`block truncate text-xs ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {m.trigger}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right main */}
        <div className="flex min-h-0 flex-col overflow-hidden">
          <div className="shrink-0 space-y-3">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 admin-card p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand/10 text-brand">
                  <ActiveIcon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    {meta.label}
                  </h2>
                  <p className="text-xs text-muted-foreground">{meta.description} · {meta.trigger}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm cursor-pointer hover:border-brand/40">
                  <input
                    type="checkbox"
                    checked={draft.enabled}
                    onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })}
                    className="h-4 w-4 rounded border-border accent-[var(--brand)]"
                  />
                  Enabled
                </label>
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
                <CheckCircle2 className="h-3.5 w-3.5" /> Saved. Future sends will use this template.
              </div>
            )}
          </div>

          <div className="mt-5 flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-1 pb-4">
            {/* Live email preview */}
            <div className="admin-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Live Preview</div>
                  <div className="text-sm font-medium">Inbox mockup</div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                  <Send className="h-3 w-3" /> {meta.trigger}
                </span>
              </div>

              <div className="overflow-hidden rounded-md border border-border bg-background">
                {/* Inbox row */}
                <div className="flex items-start gap-3 border-b border-border p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-white">NK</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-semibold">NovaKit &lt;no-reply@novakit.dev&gt;</span>
                      <span className="text-[10px] text-muted-foreground">now</span>
                    </div>
                    <div className="truncate text-sm">{draft.subject}</div>
                    <div className="truncate text-xs text-muted-foreground">{draft.preheader}</div>
                  </div>
                </div>
                {/* Email body */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold">{draft.heading}</h3>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {draft.body}
                  </p>
                  {draft.ctaLabel && (
                    <div className="mt-5">
                      <span className="inline-flex h-10 items-center rounded-lg bg-brand-gradient px-5 text-sm font-medium text-white">
                        {draft.ctaLabel}
                      </span>
                      {draft.ctaUrl && (
                        <div className="mt-1 text-[11px] text-muted-foreground">→ {draft.ctaUrl}</div>
                      )}
                    </div>
                  )}
                  {draft.footerNote && (
                    <p className="mt-6 border-t border-border pt-4 text-[11px] text-muted-foreground">
                      {draft.footerNote}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Editable fields */}
            <div className="admin-card p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <LabeledInput label="Subject line" value={draft.subject} onChange={(v) => setDraft({ ...draft, subject: v })} />
                <LabeledInput label="Preheader" value={draft.preheader} onChange={(v) => setDraft({ ...draft, preheader: v })} />
                <div className="sm:col-span-2">
                  <LabeledInput label="Heading" value={draft.heading} onChange={(v) => setDraft({ ...draft, heading: v })} />
                </div>
                <div className="sm:col-span-2">
                  <LabeledTextarea label="Body" value={draft.body} onChange={(v) => setDraft({ ...draft, body: v })} />
                </div>
                <LabeledInput label="CTA button label" value={draft.ctaLabel} onChange={(v) => setDraft({ ...draft, ctaLabel: v })} />
                <LabeledInput label="CTA URL" value={draft.ctaUrl} onChange={(v) => setDraft({ ...draft, ctaUrl: v })} />
                <div className="sm:col-span-2">
                  <LabeledTextarea label="Footer note" value={draft.footerNote} onChange={(v) => setDraft({ ...draft, footerNote: v })} />
                </div>
              </div>

              <div className="mt-6 rounded-md border border-brand/20 bg-brand/5 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Zap className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">Available variables</h3>
                    <p className="text-xs text-muted-foreground">Click to insert into the body</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {meta.variables.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => insertVar(v)}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition hover:border-brand/40 hover:text-foreground"
                    >
                      <Plus className="h-3 w-3" /> {v}
                    </button>
                  ))}
                </div>
              </div>
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
        rows={6}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}
