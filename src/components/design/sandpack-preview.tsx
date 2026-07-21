'use client';

import { Sandpack } from '@codesandbox/sandpack-react';
import type { CodeBundle } from '@/src/lib/designs-db';

type Props = {
  bundle: CodeBundle;
  theme?: 'light' | 'dark';
  showEditor?: boolean;
  height?: number;
};

function toSandpackFiles(bundle: CodeBundle): Record<string, string> {
  const files: Record<string, string> = {};
  for (const f of bundle.files) {
    // Normalize paths to start with /
    const name = f.name.startsWith('/') ? f.name : `/${f.name}`;
    files[name] = f.content;
  }
  return files;
}

export function SandpackPreview({ bundle, theme = 'dark', showEditor = false, height = 480 }: Props) {
  // HTML-only bundles: use a fast inline iframe.
  if (bundle.language === 'html' && bundle.files.length === 1) {
    return (
      <iframe
        title="preview"
        srcDoc={bundle.files[0].content}
        sandbox="allow-scripts allow-forms allow-modals"
        style={{
          width: '100%',
          height,
          border: 0,
          background: 'white',
          borderRadius: 12,
        }}
      />
    );
  }

  const template =
    bundle.language === 'react'
      ? 'react-ts'
      : bundle.language === 'vue'
        ? 'vue-ts'
        : bundle.language === 'nextjs'
          ? 'nextjs'
          : bundle.language === 'vanilla'
            ? 'vanilla'
            : 'static';

  const files = toSandpackFiles(bundle);

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden' }}>
      <Sandpack
        template={template as never}
        theme={theme === 'dark' ? 'dark' : 'light'}
        files={files as never}
        options={{
          showNavigator: false,
          showTabs: showEditor,
          showLineNumbers: showEditor,
          editorHeight: showEditor ? height : 0,
          showConsoleButton: false,
          layout: showEditor ? 'preview' : 'preview',
        }}
      />
    </div>
  );
}
