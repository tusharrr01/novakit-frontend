import { useMemo, useState } from 'react';
import { Copy, Check, File as FileIcon } from 'lucide-react';
import type { CodeBundle } from '@/src/lib/designs-db';

export function CodeViewer({
  bundle,
  onCopy,
}: {
  bundle: CodeBundle;
  onCopy?: () => void;
}) {
  const [activeFile, setActiveFile] = useState(bundle.entry || bundle.files[0]?.name || '');
  const [copied, setCopied] = useState(false);
  const file = useMemo(
    () => bundle.files.find((f) => f.name === activeFile) ?? bundle.files[0],
    [activeFile, bundle.files],
  );

  const copy = async () => {
    if (!file) return;
    try {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  if (!file) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-1 border-b border-border bg-muted/40 px-2 py-1.5 overflow-x-auto thin-scrollbar">
        {bundle.files.map((f) => (
          <button
            key={f.name}
            type="button"
            onClick={() => setActiveFile(f.name)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
              f.name === activeFile
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
            }`}
          >
            <FileIcon className="h-3 w-3" />
            {f.name}
          </button>
        ))}
        <button
          type="button"
          onClick={copy}
          className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-accent"
        >
          {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="max-h-[520px] overflow-auto thin-scrollbar bg-[#0b0b14] p-4 text-xs leading-relaxed text-slate-100">
        <code>{file.content}</code>
      </pre>
    </div>
  );
}
