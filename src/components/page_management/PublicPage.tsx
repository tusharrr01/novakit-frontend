'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useGetPageBySlugQuery } from '@/src/redux/api/pageApi';
import { SiteHeader } from '@/src/components/layout/SiteHeader';
import { SiteFooter } from '@/src/components/layout/SiteFooter';

interface PublicPageProps {
  slug: string;
}

export function PublicPage({ slug }: PublicPageProps) {
  const { data, isLoading, error } = useGetPageBySlugQuery(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-neutral-500">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Loading page…</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error || !data?.success || !data?.data) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
              <AlertCircle className="h-8 w-8 text-neutral-400" />
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-3">404</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8 text-sm leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const page = data.data;

  const lastUpdated = page.updated_at
    ? new Date(page.updated_at).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col text-neutral-900 dark:text-neutral-50">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-neutral-200/60 dark:border-neutral-800/60">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3 text-xs text-neutral-500 sm:px-6 lg:px-8">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/pages" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            Pages
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-neutral-100 font-medium">{page.title}</span>
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Article Card */}
        <article className="rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/50 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="border-b border-neutral-200/60 dark:border-neutral-800/60 p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Page
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white leading-tight">
              {page.title}
            </h1>
            {page.meta_description && (
              <p className="mt-4 text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {page.meta_description}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="p-8 sm:p-10">
            <div
              className="
                prose prose-neutral dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                prose-code:rounded prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm
                prose-blockquote:border-indigo-500 prose-blockquote:text-neutral-500
                leading-relaxed text-neutral-700 dark:text-neutral-300
              "
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>

          {/* Footer */}
          {lastUpdated && (
            <div className="border-t border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-800/20 px-8 sm:px-10 py-4 flex items-center gap-2 text-xs text-neutral-400">
              <Clock className="h-3.5 w-3.5" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          )}
        </article>

        {/* Back link */}
        <div className="mt-8 flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
