'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetDesignBySlugQuery, useGetDesignsQuery } from '@/src/redux/api/designApi';
import { CatalogDetail, CatalogNotFound } from '@/src/components/reusable/CatalogDetail';
import { SiteHeader } from '@/src/layout/site-header';
import { SiteFooter } from '@/src/layout/site-footer';

export default function DesignDetailPage() {
  const { slug } = useParams();

  const { data: itemData, isLoading: isItemLoading } = useGetDesignBySlugQuery(slug as string);
  const { data: allData } = useGetDesignsQuery(undefined);

  const item = itemData?.data;
  const designs = allData?.data || [];

  const related = designs
    .filter((d: any) => d.slug !== slug && d.category === item?.category)
    .slice(0, 3);

  if (isItemLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
        <SiteHeader />
        <div className="flex flex-1 items-center justify-center text-sm text-neutral-500">Loading asset...</div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col text-neutral-900 dark:text-neutral-50">
      <SiteHeader />
      {item ? (
        <CatalogDetail
          item={item}
          related={related}
          listTo="/designs"
          detailPrefix="/designs"
          crumbLabel="Designs"
          ctaLabel="Get Design System"
          relatedEyebrow="Related Designs"
        />
      ) : (
        <CatalogNotFound listTo="/designs" crumbLabel="Designs" />
      )}
      <SiteFooter />
    </div>
  );
}
export { DesignDetailPage };
