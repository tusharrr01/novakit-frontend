'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Sparkles,
  Terminal,
  Eye,
  ExternalLink,
  MessageSquare,
  Tag,
  User,
} from 'lucide-react';
import JSZip from 'jszip';
import { SandpackPreview } from './sandpack-preview';
import { CodeViewer } from './code-viewer';
import {
  incrementDesignMetric,
  type CodeBundle,
  type DesignRow,
} from '@/src/lib/designs-db';

function CopyChip({ value, label }: { value: string; label: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setOk(true);
          setTimeout(() => setOk(false), 1400);
        } catch {
          /* noop */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs hover:bg-accent"
    >
      {ok ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
      {label}
    </button>
  );
}

export function DesignDetailBody({
  design,
  previewHeight = 620,
}: {
  design: DesignRow;
  previewHeight?: number;
}) {
  const [bundleIdx, setBundleIdx] = useState(0);
  const bundle: CodeBundle | undefined = useMemo(
    () => design.bundles?.[bundleIdx],
    [design, bundleIdx],
  );

  useEffect(() => {
    incrementDesignMetric(design.id, 'views');
  }, [design.id]);

  const trackCopy = () => incrementDesignMetric(design.id, 'copies');

  const downloadZip = async () => {
    if (!bundle) return;
    const zip = new JSZip();
    for (const file of bundle.files) zip.file(file.name, file.content);
    zip.file('README.md', `# ${design.name}\n\n${design.description}\n`);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${design.slug}-${bundle.language}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    trackCopy();
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      {/* Preview — hero */}
      {bundle && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            <span className="text-xs text-muted-foreground">Live preview</span>
            <span className="ml-2 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
              {bundle.language}
            </span>
            <div className="ml-auto flex items-center gap-1 overflow-x-auto custom-scrollbar">
              {design.bundles.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => setBundleIdx(i)}
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize transition ${
                    i === bundleIdx
                      ? 'border-brand bg-brand/10 text-brand'
                      : 'border-border bg-background text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {b.label || b.language}
                </button>
              ))}
            </div>
          </div>
          <div className="p-2 sm:p-3">
            <SandpackPreview bundle={bundle} height={previewHeight} />
          </div>
        </div>
      )}

      {/* Title & meta */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand">
            <Sparkles className="h-3.5 w-3.5" /> {design.category}
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {design.name}
          </h1>
          {design.tagline && (
            <p className="mt-2 max-w-2xl text-muted-foreground">{design.tagline}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3" /> {design.author}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" /> {design.views}
            </span>
            <span className="inline-flex items-center gap-1">
              <Copy className="h-3 w-3" /> {design.copies}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(design.prompt);
              trackCopy();
            }}
            disabled={!design.prompt}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-40"
          >
            <MessageSquare className="h-4 w-4 text-brand" /> Copy prompt
          </button>
          <button
            type="button"
            onClick={downloadZip}
            disabled={!bundle}
            className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-4 py-2 text-sm font-medium text-white shadow disabled:opacity-40"
          >
            <Download className="h-4 w-4" /> Download .zip
          </button>
        </div>
      </div>

      {/* Two-column: code + sidebar */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          {bundle && <CodeViewer bundle={bundle} onCopy={trackCopy} />}
          {design.description && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                About
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {design.description}
              </p>
            </div>
          )}
          {design.prompt && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  AI prompt
                </div>
                <CopyChip value={design.prompt} label="Copy" />
              </div>
              <pre className="max-h-64 overflow-auto custom-scrollbar whitespace-pre-wrap rounded-lg bg-background p-3 text-xs text-muted-foreground">
                {design.prompt}
              </pre>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Pricing
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl font-semibold">Free</span>
              <span className="text-xs text-muted-foreground">/ MIT license</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Copy the code, paste into your project. No attribution required.
            </p>
            <button
              type="button"
              onClick={downloadZip}
              disabled={!bundle}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-gradient px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              <Download className="h-4 w-4" /> Get this component
            </button>
          </div>

          {design.install_command && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Terminal className="h-3 w-3" /> Install
                </span>
                <CopyChip value={design.install_command} label="Copy" />
              </div>
              <code className="block whitespace-pre-wrap break-all rounded-lg bg-background p-3 font-mono text-xs">
                {design.install_command}
              </code>
            </div>
          )}

          {design.tags.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Tag className="h-3 w-3" /> Tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {design.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <a
            href={`/design/${design.slug}`}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground hover:text-brand"
          >
            <ExternalLink className="h-3 w-3" /> Open standalone page
          </a>
        </aside>
      </div>
    </div>
  );
}
