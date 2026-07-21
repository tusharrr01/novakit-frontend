'use client';

import { CatalogList } from '@/src/components/reusable/CatalogList';
import { useGetTemplatesQuery } from '@/src/redux/api/templateApi';
import { SiteHeader } from '@/src/layout/site-header';
import { SiteFooter } from '@/src/layout/site-footer';

export default function TemplatesPage() {
  const { data, isLoading } = useGetTemplatesQuery(undefined);

  const items = data?.data || [];
  const categories = Array.from(new Set(items.map((i: any) => i.category)));

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 flex flex-col">
      <SiteHeader />
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center p-20 text-neutral-500 text-sm">
          Loading templates catalog...
        </div>
      ) : (
        <CatalogList
          items={items}
          eyebrow="React & Tailwind Templates"
          title="Beautifully crafted UI starters."
          subtitle="Production-ready page configurations and templates. Built with React and Tailwind CSS."
          categories={categories as string[]}
          searchPlaceholder="Search templates..."
          detailPrefix="/templates"
        />
      )}
      <SiteFooter />
    </div>
  );
}
