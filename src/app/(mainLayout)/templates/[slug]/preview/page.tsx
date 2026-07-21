'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetTemplateBySlugQuery } from '@/src/redux/api/catalogApi';
import { SandpackPreview } from '@/src/components/feature/design/SandpackPreview';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TemplatePreviewPage() {
  const { slug } = useParams();
  const { data: itemData, isLoading } = useGetTemplateBySlugQuery(slug as string);

  const item = itemData?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col items-center justify-center text-sm text-neutral-500">
        Loading preview sandbox...
      </div>
    );
  }

  if (!item || !item.bundles) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col items-center justify-center p-8 text-center text-neutral-500">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Preview unavailable</h1>
        <p className="mt-2 text-sm max-w-sm">No interactive sandboxed bundles have been seeded for this template asset.</p>
        <Link href={`/templates/${slug}`} className="mt-6 text-sm font-semibold text-indigo-600 hover:underline">
          Back to Template
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col text-neutral-900 dark:text-neutral-50">
      <div className="border-b border-neutral-200/60 dark:border-neutral-800/60 py-3 bg-neutral-50/50 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between">
          <Link href={`/templates/${slug}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-indigo-600 transition">
            <ArrowLeft className="h-4 w-4" /> Back to details
          </Link>
          <span className="text-xs font-bold text-neutral-900 dark:text-white tracking-tight">{item.name} Code Playground</span>
        </div>
      </div>
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <SandpackPreview
          bundles={item.bundles}
          title={item.name}
          installCommand={item.install_command}
          height={600}
        />
      </div>
    </div>
  );
}
export { TemplatePreviewPage };
