'use client';

import React, { useState } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { Eye, Code, Copy, Check, ExternalLink } from 'lucide-react';

interface SandpackPreviewProps {
  bundles: Record<string, string>;
  title: string;
  installCommand?: string;
  height?: number;
}

export function SandpackPreview({
  bundles,
  title,
  installCommand,
  height = 500,
}: SandpackPreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  // Normalize files keys to start with '/' for Sandpack
  const sandpackFiles = Object.entries(bundles).reduce((acc, [path, content]) => {
    const key = path.startsWith('/') ? path : `/${path}`;
    acc[key] = content;
    return acc;
  }, {} as Record<string, string>);

  // Ensure an App.js or App.tsx exists for React template
  if (!sandpackFiles['/App.js'] && !sandpackFiles['/App.tsx'] && !sandpackFiles['/src/App.tsx'] && !sandpackFiles['/src/App.js']) {
    // Inject default App file if missing
    sandpackFiles['/App.js'] = `export default function App() {
  return <div style={{ padding: 24, background: '#09090b', color: '#fff', minHeight: '100vh' }}>No App.js template found in bundle.</div>;
}`;
  }

  const handleCopyInstall = () => {
    if (installCommand) {
      navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full border border-neutral-250 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-neutral-950 shadow-lg">
      {/* Header controls bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-50">{title} preview</span>
          <span className="text-[10px] text-neutral-400">Sandbox Playground</span>
        </div>

        {/* View toggle buttons */}
        <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-950 p-1 rounded-lg border border-neutral-250 dark:border-neutral-850">
          <button
            onClick={() => setViewMode('preview')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              viewMode === 'preview'
                ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              viewMode === 'code'
                ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <Code className="h-3.5 w-3.5" /> Code & Edit
          </button>
        </div>
      </div>

      {/* Sandpack integration */}
      <div className="relative">
        <Sandpack
          template="react"
          theme="dark"
          files={sandpackFiles}
          options={{
            showNavigator: false,
            showTabs: viewMode === 'code',
            showLineNumbers: true,
            editorHeight: height,
            editorWidthPercentage: 45,
            showConsoleButton: false,
            // Switches between preview-only and code-editor splits
            layout: viewMode === 'code' ? 'tests' : 'preview',
          }}
        />
      </div>

      {/* Footer installation prompt bar */}
      {installCommand && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Install</span>
            <code className="font-mono text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-55/10 dark:bg-indigo-900/10 px-2 py-0.5 rounded">
              {installCommand}
            </code>
          </div>
          <button
            onClick={handleCopyInstall}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 rounded-full text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:border-indigo-500 transition"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy Code
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default SandpackPreview;
