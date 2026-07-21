'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetTemplateBySlugQuery, useGetTemplatesQuery } from '@/src/redux/api/templateApi';
import { TemplateDetail, TemplateNotFound } from '@/src/components/template/TemplateDetail';
import { SiteHeader } from '@/src/layout/SiteHeader';
import { SiteFooter } from '@/src/layout/SiteFooter';

export default function TemplateDetailPage() {
  const { slug } = useParams();

  const { data: itemData, isLoading: isItemLoading } = useGetTemplateBySlugQuery(slug as string);
  const { data: allData } = useGetTemplatesQuery(undefined);

  const item = itemData?.data;
  const templates = allData?.data || [];

  const related = templates
    .filter((t: any) => t.slug !== slug && t.category === item?.category)
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
        <TemplateDetail
          item={item}
          related={related}
          listTo="/templates"
          detailPrefix="/templates"
          crumbLabel="Templates"
          ctaLabel="Purchase Template"
          relatedEyebrow="Related Templates"
        />
      ) : (
        <TemplateNotFound listTo="/templates" crumbLabel="Templates" />
      )}
      <SiteFooter />
    </div>
  );
}
export { TemplateDetailPage };
