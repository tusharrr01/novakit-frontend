'use client';

import React, { useEffect, useState } from 'react';
import {
  Eye,
  EyeOff,
  CheckCircle2,
  RotateCcw,
  Check,
  ExternalLink,
} from 'lucide-react';
import {
  PAYMENT_PROVIDER_META,
  paymentsStore,
  defaultPaymentsContent,
  usePayments,
  type PaymentProviderKey,
  type PaymentsContent,
} from '@/src/lib/payments-content';

function ProviderMark({ provider }: { provider: PaymentProviderKey }) {
  const meta = PAYMENT_PROVIDER_META.find((m) => m.key === provider)!;
  return (
    <span className={`flex h-7 w-9 items-center justify-center rounded-md bg-gradient-to-br ${meta.accent} text-[11px] font-bold text-white shadow-sm`}>
      {meta.short}
    </span>
  );
}

function SecretField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label} <span className="text-rose-500">*</span>
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full rounded-lg border border-border bg-muted/40 px-3 pr-10 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={show ? 'Hide value' : 'Show value'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export function PaymentsTab() {
  const content = usePayments();
  const [draft, setDraft] = useState<PaymentsContent>(content);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setDraft(content);
    setSavedAt(null);
  }, [content]);

  const active = draft.active;
  const meta = PAYMENT_PROVIDER_META.find((m) => m.key === active)!;
  const provider = draft.providers[active];
  const dirty = JSON.stringify(draft) !== JSON.stringify(content);

  function updateProvider(patch: Partial<typeof provider>) {
    setDraft({
      ...draft,
      providers: { ...draft.providers, [active]: { ...provider, ...patch } },
    });
  }
  
  function save() {
    paymentsStore.save(draft);
    setSavedAt(Date.now());
  }
  
  function reset() {
    setDraft(defaultPaymentsContent);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-brand">Payment Gateways</h1>
          <p className="mt-1 text-sm text-muted-foreground">Configure and manage payment processing methods</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto thin-scrollbar pt-6 pb-4">
        <div className="admin-card p-6">
          {/* Provider selector */}
          <div className="mb-5">
            <div className="mb-3 text-sm font-semibold">Payment Provider</div>
            <div className="flex flex-wrap gap-3">
              {PAYMENT_PROVIDER_META.map((m) => {
                const isActive = active === m.key;
                const isEnabled = draft.providers[m.key].enabled;
                return (
                  <button
                    key={m.key}
                    onClick={() => setDraft({ ...draft, active: m.key })}
                    className={`group inline-flex items-center gap-2.5 rounded-md border px-4 py-2.5 text-sm font-medium transition cursor-pointer ${
                      isActive
                        ? 'border-brand bg-brand/5 text-foreground shadow-sm'
                        : 'border-border bg-background hover:border-brand/40'
                    }`}
                  >
                    <ProviderMark provider={m.key} />
                    <span>{m.label}</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isEnabled ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                      }`}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border pt-5">
            {/* Keys */}
            <div className="grid gap-5 md:grid-cols-2">
              <SecretField
                label={meta.publishableLabel}
                value={provider.publishableKey}
                placeholder={meta.publishablePlaceholder}
                onChange={(v) => updateProvider({ publishableKey: v })}
              />
              <SecretField
                label={meta.secretLabel}
                value={provider.secretKey}
                placeholder={meta.secretPlaceholder}
                onChange={(v) => updateProvider({ secretKey: v })}
              />
            </div>

            {/* Enable toggle */}
            <label className="mt-5 flex cursor-pointer items-center justify-between rounded-md border border-border bg-muted/30 p-4 hover:bg-muted/50">
              <div>
                <div className="text-sm font-semibold">Enable Payment Gateway</div>
                <div className="text-xs text-muted-foreground">Activate payment processing for your application</div>
              </div>
              <input
                type="checkbox"
                checked={provider.enabled}
                onChange={(e) => updateProvider({ enabled: e.target.checked })}
                className="h-4 w-4 rounded border-border accent-[var(--brand)]"
              />
            </label>

            {/* Configuration info */}
            <div className="mt-5 rounded-md border border-brand/20 bg-brand/5 p-5">
              <div className="mb-2 flex items-center gap-2">
                <ProviderMark provider={active} />
                <span className="text-sm font-semibold text-brand">{meta.configTitle}</span>
              </div>
              <p className="text-xs text-muted-foreground">{meta.configBlurb}</p>
              <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                {meta.keyHints.map((hint) => (
                  <li key={hint.label} className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[6px] text-muted-foreground">●</span>
                    <span>{hint.label}</span>
                    {hint.codes.map((c, i) => (
                      <span key={c} className="inline-flex items-center gap-1">
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">{c}</code>
                        {i < hint.codes.length - 1 && <span>or</span>}
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
              <a
                href={meta.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:underline"
              >
                {meta.docsLabel} <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <div>
                {savedAt && !dirty && (
                  <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-500 animate-in fade-in duration-200">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Saved. Gateway configuration updated.
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-background px-4 text-sm font-medium hover:border-brand/40"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={!dirty}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-gradient px-5 text-sm font-medium text-white shadow-lg shadow-brand/25 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
