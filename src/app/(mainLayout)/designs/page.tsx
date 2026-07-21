'use client';

import { DesignList } from '@/src/components/design/DesignList';
import { useGetDesignsQuery } from '@/src/redux/api/designApi';
import { SiteHeader } from '@/src/components/layout/SiteHeader';
import { SiteFooter } from '@/src/components/layout/SiteFooter';

export default function DesignsPage() {
  const { data, isLoading } = useGetDesignsQuery(undefined);

  const items = data?.data || [];
  const categories = Array.from(new Set(items.map((i: any) => i.category)));

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 flex flex-col">
      <SiteHeader />
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center p-20 text-neutral-500 text-sm">
          Loading designs catalog...
        </div>
      ) : (
        <DesignList
          items={items}
          eyebrow="Figma Design Systems"
          title="Figma UI kits & brand assets."
          subtitle="Curated library of 2000+ Figma components, tokens, variants and layout frames built by professionals."
          categories={categories as string[]}
          searchPlaceholder="Search designs..."
          detailPrefix="/designs"
        />
      )}
      <SiteFooter />
    </div>
  );
}

