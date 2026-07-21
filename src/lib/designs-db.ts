import { getSession } from 'next-auth/react';

export type BundleLanguage = 'react' | 'html' | 'vue' | 'vanilla' | 'nextjs';

export type CodeFile = {
  name: string;
  content: string;
};

export type CodeBundle = {
  id: string;
  language: BundleLanguage;
  label?: string;
  entry: string;
  files: CodeFile[];
};

export type DesignRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  status: 'draft' | 'live' | 'archived';
  thumbnail_path: string | null;
  prompt: string;
  bundles: CodeBundle[];
  install_command: string;
  author: string;
  views: number;
  copies: number;
  created_at: string;
  updated_at: string;
};

export type DesignCategory = {
  id: string;
  slug: string;
  name: string;
};

const API_BASE_URL = typeof window === 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api')
  : (process.env.NEXT_PUBLIC_API_BASE_URL || '/api');

async function apiFetch(url: string, init?: RequestInit) {
  const session: any = typeof window !== 'undefined' ? await getSession() : null;
  const headers = new Headers(init?.headers);
  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }
  if (!headers.has('Content-Type') && init?.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...init,
    headers,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || response.statusText);
  }
  return response.json();
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function makeBundleId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function emptyBundle(language: BundleLanguage = 'react'): CodeBundle {
  if (language === 'html') {
    return {
      id: makeBundleId(),
      language,
      label: 'HTML',
      entry: 'index.html',
      files: [
        {
          name: 'index.html',
          content: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Preview</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 2rem; }
      .card { padding: 2rem; border-radius: 16px; background: #7c3aed; color: white; }
    </style>
  </head>
  <body>
    <div class="card">Hello from HTML!</div>
  </body>
</html>`,
        },
      ],
    };
  }
  if (language === 'vanilla') {
    return {
      id: makeBundleId(),
      language,
      label: 'JavaScript',
      entry: 'index.js',
      files: [
        { name: 'index.html', content: `<div id="app"></div>` },
        {
          name: 'index.js',
          content: `document.getElementById('app').innerHTML = '<h1 style="font-family:system-ui">Hello!</h1>';`,
        },
      ],
    };
  }
  return {
    id: makeBundleId(),
    language,
    label: 'React',
    entry: 'App.tsx',
    files: [
      {
        name: 'App.tsx',
        content: `export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui' }}>
      <div style={{ padding: '2rem', borderRadius: 16, background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: 'white' }}>
        <h1 style={{ margin: 0 }}>Hello from React!</h1>
        <p style={{ marginTop: 8, opacity: 0.85 }}>Edit App.tsx and see it update live.</p>
      </div>
    </div>
  );
}
`,
      },
    ],
  };
}

export async function listDesigns(opts?: { status?: 'live' | 'draft' | 'archived' | 'all' }): Promise<DesignRow[]> {
  const params = new URLSearchParams();
  if (opts?.status) {
    params.set('status', opts.status);
  }
  const res = await apiFetch(`/catalog/designs?${params.toString()}`);
  return res.data ?? [];
}

export async function getDesign(slug: string): Promise<DesignRow | null> {
  const res = await apiFetch(`/catalog/designs/${slug}`);
  return res.data ?? null;
}

export async function upsertDesign(row: Partial<DesignRow> & { name: string }): Promise<DesignRow> {
  const payload = {
    name: row.name,
    slug: row.slug ?? slugify(row.name),
    tagline: row.tagline ?? '',
    description: row.description ?? '',
    category: row.category ?? 'Components',
    tags: row.tags ?? [],
    status: row.status ?? 'draft',
    thumbnail_path: row.thumbnail_path ?? null,
    prompt: row.prompt ?? '',
    bundles: row.bundles ?? [],
    install_command: row.install_command ?? '',
    author: row.author ?? 'NovaKit',
  };

  if (row.id) {
    const res = await apiFetch(`/admin/catalog/designs/${row.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.data;
  }
  const res = await apiFetch(`/admin/catalog/designs`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deleteDesign(id: string): Promise<void> {
  await apiFetch(`/admin/catalog/designs/${id}`, {
    method: 'DELETE',
  });
}

export async function incrementDesignMetric(id: string, field: 'views' | 'copies'): Promise<void> {
  // Metric increment is optional backend-side, no-op or extend if needed
}

export async function uploadThumbnail(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiFetch('/upload', {
    method: 'POST',
    body: formData,
  });
  return res.url;
}

export async function signedThumbnailUrl(
  path: string | null | undefined,
  expiresIn = 3600,
): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith('/')) {
    return `${API_BASE_URL.replace('/api', '')}${path}`;
  }
  return path;
}

export async function listCategories(): Promise<DesignCategory[]> {
  // Return hardcoded categories or query from backend if database collections exist
  return [
    { id: 'cat1', slug: 'components', name: 'Components' },
    { id: 'cat2', slug: 'ui-kit', name: 'UI Kit' },
    { id: 'cat3', slug: 'design-system', name: 'Design System' },
  ];
}

export async function createCategory(name: string): Promise<DesignCategory> {
  return { id: Math.random().toString(), slug: slugify(name), name };
}

export async function deleteCategory(id: string): Promise<void> {
  // Category delete stub
}
